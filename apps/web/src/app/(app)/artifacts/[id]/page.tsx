"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/artifacts/markdown-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Sparkles, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";

type ArtifactStatus = "draft" | "in-progress" | "completed";
type ArtifactType = "prd" | "architecture" | "story" | "epic" | "tech-spec" | "document";

export default function ArtifactEditorPage() {
  const params = useParams();
  const router = useRouter();
  const artifactId = params.id as string;
  const utils = trpc.useUtils();

  // Fetch artifact data
  const { data: artifact, isLoading, error } = trpc.artifact.getById.useQuery({
    id: artifactId,
  });

  // Local state for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ArtifactStatus>("draft");
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [content, setContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch projects for the selector
  const { data: projectsData } = trpc.project.list.useQuery({
    limit: 100,
  });

  // Sync form state with fetched data
  useEffect(() => {
    if (artifact) {
      setTitle(artifact.title);
      setDescription(artifact.description || "");
      setStatus(artifact.status as ArtifactStatus);
      setProjectId(artifact.projectId || undefined);
      setContent(artifact.content);
    }
  }, [artifact]);

  // Update artifact mutation
  const updateArtifact = trpc.artifact.update.useMutation({
    onSuccess: () => {
      setHasUnsavedChanges(false);
      // Invalidate queries to refresh data
      utils.artifact.getById.invalidate({ id: artifactId });
      utils.artifact.list.invalidate();
    },
    onError: (error) => {
      alert(`Error saving artifact: ${error.message}`);
    },
  });

  // Delete artifact mutation
  const deleteArtifact = trpc.artifact.delete.useMutation({
    onSuccess: () => {
      // Navigate back to chat after deletion
      router.push("/chat");
      // Invalidate list to refresh
      utils.artifact.list.invalidate();
    },
    onError: (error) => {
      alert(`Error deleting artifact: ${error.message}`);
    },
  });

  const handleSave = (newContent: string) => {
    updateArtifact.mutate({
      id: artifactId,
      title,
      description,
      status,
      projectId: projectId || null,
      content: newContent,
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this artifact? This action cannot be undone.")) {
      deleteArtifact.mutate({ id: artifactId });
    }
  };

  const handleGenerateWithAI = () => {
    alert("AI generation will be implemented in a future update!");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-neutral-400" />
          <p className="mt-4 text-sm text-neutral-600">Loading artifact...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !artifact) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900">
            {error ? "Error loading artifact" : "Artifact not found"}
          </h2>
          <p className="mt-2 text-neutral-600">
            {error
              ? error.message
              : "The artifact you're looking for doesn't exist."}
          </p>
          <Button className="mt-4" onClick={() => router.push("/chat")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/chat")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="h-6 w-px bg-neutral-200" />

          <div className="flex flex-col gap-1">
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="h-8 border-none px-0 text-lg font-semibold focus-visible:ring-0"
              placeholder="Artifact title"
            />
            <Input
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="h-6 border-none px-0 text-sm text-neutral-600 focus-visible:ring-0"
              placeholder="Brief description"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as ArtifactStatus);
              setHasUnsavedChanges(true);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={projectId || "none"}
            onValueChange={(v) => {
              setProjectId(v === "none" ? undefined : v);
              setHasUnsavedChanges(true);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="No project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No project</SelectItem>
              {projectsData?.projects.map((project: any) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleGenerateWithAI}
          >
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleteArtifact.isPending}
            className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            {deleteArtifact.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>

          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-xs">
              Unsaved changes
            </Badge>
          )}

          {updateArtifact.isPending && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </div>
          )}

          {updateArtifact.isSuccess && !hasUnsavedChanges && (
            <div className="text-xs text-green-600">Saved!</div>
          )}
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 overflow-hidden">
        <MarkdownEditor
          key={artifact.id} // Remount editor when artifact changes
          initialContent={content}
          artifactType={artifact.type as ArtifactType}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}
