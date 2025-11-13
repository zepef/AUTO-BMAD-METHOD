"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { formatDistanceToNow } from "date-fns";

const ARTIFACT_TYPE_LABELS: Record<string, string> = {
  prd: "PRD",
  architecture: "Architecture",
  story: "User Story",
  epic: "Epic",
  "tech-spec": "Tech Spec",
  document: "Document",
};

export default function DashboardPage() {
  const router = useRouter();

  // Fetch statistics
  const { data: projectStats } = trpc.project.stats.useQuery();
  const { data: artifactStats } = trpc.artifact.stats.useQuery();
  const { data: chatStats } = trpc.chat.stats.useQuery();

  // Fetch recent data
  const { data: recentProjects } = trpc.project.list.useQuery({
    limit: 5,
  });

  const { data: recentArtifacts } = trpc.artifact.list.useQuery({
    limit: 5,
  });

  const { data: recentChats } = trpc.chat.listSessions.useQuery({
    limit: 5,
  });

  const handleNewProject = () => {
    router.push("/projects");
  };

  const handleNewChat = () => {
    router.push("/chat");
  };

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      {/* Page Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Welcome to FlowForge - Your AI-powered development workspace
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleNewProject}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <Button className="gap-2" onClick={handleNewChat}>
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    Total Projects
                  </p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">
                    {projectStats?.total ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {projectStats?.byStatus.find((s: any) => s.status === "active")
                      ?._count ?? 0}{" "}
                    active
                  </p>
                </div>
                <div className="rounded-full bg-primary-100 p-3">
                  <FolderKanban className="h-8 w-8 text-primary-600" />
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
                  <p className="mt-1 text-3xl font-bold text-neutral-900">
                    {artifactStats?.total ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {artifactStats?.byStatus.find((s: any) => s.status === "completed")
                      ?._count ?? 0}{" "}
                    completed
                  </p>
                </div>
                <div className="rounded-full bg-secondary-100 p-3">
                  <FileText className="h-8 w-8 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    Chat Sessions
                  </p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">
                    {chatStats?.totalSessions ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {chatStats?.totalMessages ?? 0} messages
                  </p>
                </div>
                <div className="rounded-full bg-amber-100 p-3">
                  <MessageSquare className="h-8 w-8 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Activity</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">
                    <TrendingUp className="inline h-8 w-8" />
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">All systems active</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Projects</CardTitle>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="gap-2">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentProjects?.projects && recentProjects.projects.length > 0 ? (
                <div className="space-y-3">
                  {recentProjects.projects.map((project: any) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary-100" />
                          <div>
                            <p className="font-medium text-neutral-900">
                              {project.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {project._count.artifacts} artifacts
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{project.status}</Badge>
                          <Clock className="h-4 w-4 text-neutral-400" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FolderKanban className="mb-3 h-12 w-12 text-neutral-300" />
                  <p className="text-sm text-neutral-500">No projects yet</p>
                  <Button className="mt-4" size="sm" onClick={handleNewProject}>
                    Create your first project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Artifacts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Artifacts</CardTitle>
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="gap-2">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentArtifacts?.artifacts &&
              recentArtifacts.artifacts.length > 0 ? (
                <div className="space-y-3">
                  {recentArtifacts.artifacts.map((artifact: any) => (
                    <Link
                      key={artifact.id}
                      href={`/artifacts/${artifact.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-100">
                            <FileText className="h-5 w-5 text-secondary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">
                              {artifact.title}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {ARTIFACT_TYPE_LABELS[artifact.type] || artifact.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{artifact.status}</Badge>
                          <span className="text-xs text-neutral-500">
                            {formatDistanceToNow(new Date(artifact.updatedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-3 h-12 w-12 text-neutral-300" />
                  <p className="text-sm text-neutral-500">No artifacts yet</p>
                  <Button className="mt-4" size="sm" onClick={handleNewChat}>
                    Start chatting to create artifacts
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Chat Sessions */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Conversations</CardTitle>
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="gap-2">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentChats?.sessions && recentChats.sessions.length > 0 ? (
                <div className="space-y-3">
                  {recentChats.sessions.map((session: any) => (
                    <Link
                      key={session.id}
                      href="/chat"
                      className="block"
                    >
                      <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                            <MessageSquare className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">
                              {session.title}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {session._count.messages} messages
                              {session.project && ` • ${session.project.name}`}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-neutral-500">
                          {formatDistanceToNow(new Date(session.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="mb-3 h-12 w-12 text-neutral-300" />
                  <p className="text-sm text-neutral-500">No conversations yet</p>
                  <Button className="mt-4" size="sm" onClick={handleNewChat}>
                    Start your first chat
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
