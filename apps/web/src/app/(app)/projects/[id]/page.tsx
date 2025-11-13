"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  FileText,
  Clock,
  MessageSquare,
  Loader2,
  Download,
} from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { formatDistanceToNow } from "date-fns";

const STATUS_VARIANTS = {
  active: "default" as const,
  archived: "secondary" as const,
  completed: "outline" as const,
};

const STATUS_COLORS = {
  active: "#10b981",
  archived: "#6b7280",
  completed: "#8b5cf6",
};

const ARTIFACT_TYPE_LABELS: Record<string, string> = {
  prd: "PRD",
  architecture: "Architecture",
  story: "User Story",
  epic: "Epic",
  "tech-spec": "Tech Spec",
  document: "Document",
};

const ARTIFACT_TYPE_COLORS: Record<string, string> = {
  prd: "#8b5cf6",
  architecture: "#0ea5e9",
  story: "#10b981",
  epic: "#f59e0b",
  "tech-spec": "#ec4899",
  document: "#6b7280",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const utils = trpc.useUtils();
  const projectId = params.id as string;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateArtifactDialogOpen, setIsCreateArtifactDialogOpen] = useState(false);
  const [editedProject, setEditedProject] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "archived" | "completed",
  });
  const [newArtifact, setNewArtifact] = useState({
    type: "document" as "prd" | "architecture" | "story" | "epic" | "tech-spec" | "document",
    title: "",
    description: "",
  });

  // Fetch project with artifacts
  const { data: project, isLoading, error } = trpc.project.getById.useQuery({
    id: projectId,
  });

  // Update project mutation
  const updateProject = trpc.project.update.useMutation({
    onSuccess: () => {
      utils.project.getById.invalidate({ id: projectId });
      utils.project.list.invalidate();
      utils.project.stats.invalidate();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      alert(`Error updating project: ${error.message}`);
    },
  });

  // Delete project mutation
  const deleteProject = trpc.project.delete.useMutation({
    onSuccess: () => {
      router.push("/projects");
      utils.project.list.invalidate();
      utils.project.stats.invalidate();
    },
    onError: (error) => {
      alert(`Error deleting project: ${error.message}`);
    },
  });

  // Create artifact mutation
  const createArtifact = trpc.artifact.create.useMutation({
    onSuccess: (newArtifact) => {
      utils.project.getById.invalidate({ id: projectId });
      utils.artifact.list.invalidate();
      setIsCreateArtifactDialogOpen(false);
      setNewArtifact({ type: "document", title: "", description: "" });
      router.push(`/artifacts/${newArtifact.id}`);
    },
    onError: (error) => {
      alert(`Error creating artifact: ${error.message}`);
    },
  });

  const handleEditProject = () => {
    if (project) {
      setEditedProject({
        name: project.name,
        description: project.description || "",
        status: project.status as "active" | "archived" | "completed",
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateProject = () => {
    if (!editedProject.name.trim()) {
      alert("Please enter a project name");
      return;
    }
    updateProject.mutate({
      id: projectId,
      ...editedProject,
    });
  };

  const handleDeleteProject = () => {
    if (
      confirm(
        "Are you sure you want to delete this project? This will unlink all artifacts but won't delete them."
      )
    ) {
      deleteProject.mutate({ id: projectId });
    }
  };

  const handleCreateArtifact = () => {
    if (!newArtifact.title.trim()) {
      alert("Please enter an artifact title");
      return;
    }
    createArtifact.mutate({
      ...newArtifact,
      projectId,
    });
  };

  const handleDownloadArtifact = (artifact: any) => {
    const blob = new Blob([artifact.content || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifact.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-neutral-50">
        <Loader2 className="h-12 w-12 animate-spin text-neutral-300" />
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="flex h-full items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">
            {error ? "Error loading project" : "Project not found"}
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            {error?.message || "The project you're looking for doesn't exist"}
          </p>
          <Link href="/projects">
            <Button className="mt-4" variant="outline">
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-6">
        <div className="mb-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className="h-16 w-16 rounded-lg"
              style={{
                backgroundColor:
                  STATUS_COLORS[project.status as keyof typeof STATUS_COLORS] ||
                  STATUS_COLORS.active,
              }}
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-neutral-900">
                  {project.name}
                </h1>
                <Badge
                  variant={
                    STATUS_VARIANTS[
                      project.status as keyof typeof STATUS_VARIANTS
                    ] || STATUS_VARIANTS.active
                  }
                >
                  {project.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                {project.description || "No description"}
              </p>
              <div className="mt-2 flex items-center gap-4 text-sm text-neutral-500">
                <span>
                  Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                </span>
                <span>•</span>
                <span>
                  Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleEditProject}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleDeleteProject}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Artifacts</p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {project._count.artifacts}
                  </p>
                </div>
                <div className="rounded-full bg-primary-100 p-3">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Messages</p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {project._count.messages}
                  </p>
                </div>
                <div className="rounded-full bg-secondary-100 p-3">
                  <MessageSquare className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Artifacts Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Artifacts</h2>
          <Button
            className="gap-2"
            onClick={() => setIsCreateArtifactDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Artifact
          </Button>
        </div>

        {project.artifacts.length > 0 ? (
          <div className="space-y-3">
            {project.artifacts.map((artifact: any) => (
              <Card
                key={artifact.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 h-10 w-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor:
                            ARTIFACT_TYPE_COLORS[artifact.type] ||
                            ARTIFACT_TYPE_COLORS.document,
                        }}
                      >
                        {ARTIFACT_TYPE_LABELS[artifact.type]?.substring(0, 3).toUpperCase() || "DOC"}
                      </div>
                      <div>
                        <Link href={`/artifacts/${artifact.id}`}>
                          <CardTitle className="text-base hover:text-primary-600 cursor-pointer">
                            {artifact.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="mt-1">
                          {artifact.description || "No description"}
                        </CardDescription>
                        <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
                          <Badge variant="secondary" className="text-xs">
                            {ARTIFACT_TYPE_LABELS[artifact.type] || artifact.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {artifact.status}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(artifact.updatedAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDownloadArtifact(artifact)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 py-16">
            <FileText className="h-12 w-12 text-neutral-300" />
            <h3 className="mt-4 text-base font-medium text-neutral-900">
              No artifacts yet
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Create your first artifact for this project
            </p>
            <Button
              className="mt-4 gap-2"
              onClick={() => setIsCreateArtifactDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              New Artifact
            </Button>
          </div>
        )}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editedProject.name}
                onChange={(e) =>
                  setEditedProject({ ...editedProject, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editedProject.description}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editedProject.status}
                onValueChange={(value: any) =>
                  setEditedProject({ ...editedProject, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updateProject.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProject}
              disabled={updateProject.isPending}
            >
              {updateProject.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Artifact Dialog */}
      <Dialog
        open={isCreateArtifactDialogOpen}
        onOpenChange={setIsCreateArtifactDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Artifact</DialogTitle>
            <DialogDescription>
              Add a new artifact to this project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="artifact-type">Type</Label>
              <Select
                value={newArtifact.type}
                onValueChange={(value: any) =>
                  setNewArtifact({ ...newArtifact, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prd">PRD (Product Requirements)</SelectItem>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="story">User Story</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="tech-spec">Technical Specification</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="artifact-title">Title</Label>
              <Input
                id="artifact-title"
                placeholder="My Artifact"
                value={newArtifact.title}
                onChange={(e) =>
                  setNewArtifact({ ...newArtifact, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artifact-description">Description (Optional)</Label>
              <Textarea
                id="artifact-description"
                placeholder="Brief description of this artifact"
                value={newArtifact.description}
                onChange={(e) =>
                  setNewArtifact({ ...newArtifact, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateArtifactDialogOpen(false)}
              disabled={createArtifact.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateArtifact}
              disabled={createArtifact.isPending}
            >
              {createArtifact.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Artifact"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
