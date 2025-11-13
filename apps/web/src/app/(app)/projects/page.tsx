"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Plus,
  FolderKanban,
  FileText,
  Clock,
  MoreVertical,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function ProjectsPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "archived" | "completed",
  });

  // Fetch projects
  const { data, isLoading, error } = trpc.project.list.useQuery({
    limit: 50,
  });

  // Fetch stats
  const { data: stats } = trpc.project.stats.useQuery();

  // Create project mutation
  const createProject = trpc.project.create.useMutation({
    onSuccess: (newProjectData) => {
      utils.project.list.invalidate();
      utils.project.stats.invalidate();
      setIsCreateDialogOpen(false);
      setNewProject({ name: "", description: "", status: "active" });
      router.push(`/projects/${newProjectData.id}`);
    },
    onError: (error) => {
      alert(`Error creating project: ${error.message}`);
    },
  });

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      alert("Please enter a project name");
      return;
    }
    createProject.mutate(newProject);
  };

  const projects = data?.projects ?? [];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-neutral-50">
        <Loader2 className="h-12 w-12 animate-spin text-neutral-300" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Error loading projects</p>
          <p className="mt-2 text-sm text-neutral-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      {/* Page Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Manage your software development projects
            </p>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    Total Projects
                  </p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {stats?.total ?? 0}
                  </p>
                </div>
                <div className="rounded-full bg-primary-100 p-3">
                  <FolderKanban className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    Active Projects
                  </p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {stats?.byStatus.find((s: any) => s.status === "active")?._count ?? 0}
                  </p>
                </div>
                <div className="rounded-full bg-secondary-100 p-3">
                  <FolderKanban className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    Total Artifacts
                  </p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {stats?.totalArtifacts ?? 0}
                  </p>
                </div>
                <div className="rounded-full bg-amber-100 p-3">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-auto p-6">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project: any) => (
              <Card
                key={project.id}
                className="group transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 h-10 w-10 rounded-lg"
                        style={{
                          backgroundColor:
                            STATUS_COLORS[
                              project.status as keyof typeof STATUS_COLORS
                            ] || STATUS_COLORS.active,
                        }}
                      />
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {project.description || "No description"}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Stats Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{project._count.artifacts} artifacts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatDistanceToNow(new Date(project.updatedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
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

                    {/* Action Button */}
                    <div className="flex justify-end">
                      <Link href={`/projects/${project.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          View Project
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="rounded-full bg-neutral-100 p-6">
              <FolderKanban className="h-12 w-12 text-neutral-400" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-neutral-900">
              No projects yet
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Get started by creating your first project
            </p>
            <Button className="mt-6 gap-2" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </div>
        )}
      </div>

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to organize your artifacts and collaborate with your
              team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="E-commerce Platform"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Full-stack e-commerce solution with payment integration"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newProject.status}
                onValueChange={(value: any) =>
                  setNewProject({ ...newProject, status: value })
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
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={createProject.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={createProject.isPending}
            >
              {createProject.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
