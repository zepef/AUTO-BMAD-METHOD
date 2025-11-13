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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  FolderKanban,
  FileText,
  Clock,
  MoreVertical,
  ArrowRight,
  Loader2,
  Sparkles,
  Download,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { formatDistanceToNow } from "date-fns";
import { PROJECT_TEMPLATES, type ProjectTemplate } from "@/lib/project-templates";
import { cn } from "@/lib/utils";

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
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [createMode, setCreateMode] = useState<"blank" | "template">("blank");
  const [importFile, setImportFile] = useState<File | null>(null);
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

  // Create project mutation (blank)
  const createProject = trpc.project.create.useMutation({
    onSuccess: (newProjectData) => {
      utils.project.list.invalidate();
      utils.project.stats.invalidate();
      setIsCreateDialogOpen(false);
      setNewProject({ name: "", description: "", status: "active" });
      setSelectedTemplate(null);
      setCreateMode("blank");
      router.push(`/projects/${newProjectData.id}`);
    },
    onError: (error) => {
      alert(`Error creating project: ${error.message}`);
    },
  });

  // Create project from template mutation
  const createFromTemplate = trpc.project.createFromTemplate.useMutation({
    onSuccess: (newProjectData) => {
      utils.project.list.invalidate();
      utils.project.stats.invalidate();
      setIsCreateDialogOpen(false);
      setNewProject({ name: "", description: "", status: "active" });
      setSelectedTemplate(null);
      setCreateMode("blank");
      router.push(`/projects/${newProjectData.id}`);
    },
    onError: (error) => {
      alert(`Error creating project: ${error.message}`);
    },
  });

  // Import project mutation
  const importProject = trpc.project.import.useMutation({
    onSuccess: (importedProject) => {
      utils.project.list.invalidate();
      utils.project.stats.invalidate();
      setIsImportDialogOpen(false);
      setImportFile(null);
      alert(`Successfully imported project: ${importedProject?.name}`);
      router.push(`/projects/${importedProject?.id}`);
    },
    onError: (error) => {
      alert(`Error importing project: ${error.message}`);
    },
  });

  const handleCreateProject = () => {
    if (createMode === "template" && selectedTemplate) {
      // Create from template
      createFromTemplate.mutate({
        templateId: selectedTemplate.id,
        name: newProject.name.trim() || undefined,
        description: newProject.description.trim() || undefined,
      });
    } else {
      // Create blank project
      if (!newProject.name.trim()) {
        alert("Please enter a project name");
        return;
      }
      createProject.mutate(newProject);
    }
  };

  const handleExportProject = async (projectId: string, projectName: string) => {
    try {
      // Fetch export data using tRPC
      const exportData = await trpc.project.export.query({ id: projectId });

      // Create downloadable file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(`Error exporting project: ${error.message}`);
    }
  };

  const handleImportProject = async () => {
    if (!importFile) {
      alert("Please select a file to import");
      return;
    }

    try {
      const fileContent = await importFile.text();
      const importData = JSON.parse(fileContent);

      // Validate structure
      if (!importData.version || !importData.project) {
        throw new Error("Invalid export file format");
      }

      importProject.mutate({ data: importData });
    } catch (error: any) {
      alert(`Error importing project: ${error.message}`);
    }
  };

  const isCreating = createProject.isPending || createFromTemplate.isPending;
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
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleExportProject(project.id, project.name)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Start from scratch or use a template to get started quickly
            </DialogDescription>
          </DialogHeader>

          <Tabs value={createMode} onValueChange={(v: any) => setCreateMode(v)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="blank">Start from Scratch</TabsTrigger>
              <TabsTrigger value="template">
                <Sparkles className="mr-2 h-4 w-4" />
                Use Template
              </TabsTrigger>
            </TabsList>

            {/* Blank Project Tab */}
            <TabsContent value="blank" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Project"
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
                  placeholder="Brief description of your project"
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
            </TabsContent>

            {/* Template Tab */}
            <TabsContent value="template" className="space-y-4">
              <div className="space-y-2">
                <Label>Choose a Template</Label>
                <div className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto rounded-lg border p-3">
                  {PROJECT_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setNewProject({
                          name: template.name,
                          description: template.description,
                          status: "active",
                        });
                      }}
                      className={cn(
                        "flex flex-col gap-2 rounded-lg border-2 p-3 text-left transition-all hover:border-primary-300 hover:bg-primary-50",
                        selectedTemplate?.id === template.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-neutral-200 bg-white"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-semibold text-neutral-900">
                            {template.name}
                          </h4>
                          <p className="text-xs text-neutral-500">
                            {template.category}
                          </p>
                        </div>
                      </div>
                      <p className="line-clamp-2 text-xs text-neutral-600">
                        {template.description}
                      </p>
                      {template.defaultArtifacts.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <FileText className="h-3 w-3" />
                          <span>{template.defaultArtifacts.length} artifacts included</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {selectedTemplate && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Project Name</Label>
                    <Input
                      id="template-name"
                      placeholder={selectedTemplate.name}
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                    />
                    <p className="text-xs text-neutral-500">
                      Leave blank to use template name
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-description">Description (Optional)</Label>
                    <Textarea
                      id="template-description"
                      placeholder={selectedTemplate.description}
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({ ...newProject, description: e.target.value })
                      }
                      rows={2}
                    />
                    <p className="text-xs text-neutral-500">
                      Leave blank to use template description
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary-50 p-3 text-sm">
                    <p className="font-medium text-primary-900">What's included:</p>
                    <ul className="mt-2 space-y-1 text-xs text-primary-800">
                      {selectedTemplate.defaultArtifacts.map((artifact, idx) => (
                        <li key={idx}>• {artifact.title}</li>
                      ))}
                      {selectedTemplate.defaultArtifacts.length === 0 && (
                        <li>• No default artifacts (blank project)</li>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setSelectedTemplate(null);
                setCreateMode("blank");
                setNewProject({ name: "", description: "", status: "active" });
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={isCreating || (createMode === "template" && !selectedTemplate)}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  {createMode === "template" && <Sparkles className="mr-2 h-4 w-4" />}
                  Create Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Project Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Project</DialogTitle>
            <DialogDescription>
              Import a project from a previously exported JSON file
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="import-file">Select Export File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json,application/json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-neutral-500">
                Choose a .json file exported from FlowForge
              </p>
            </div>
            {importFile && (
              <div className="rounded-lg bg-primary-50 p-3 text-sm">
                <p className="font-medium text-primary-900">Selected file:</p>
                <p className="mt-1 text-xs text-primary-800">{importFile.name}</p>
                <p className="mt-1 text-xs text-primary-700">
                  Size: {(importFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsImportDialogOpen(false);
                setImportFile(null);
              }}
              disabled={importProject.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportProject}
              disabled={importProject.isPending || !importFile}
            >
              {importProject.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
