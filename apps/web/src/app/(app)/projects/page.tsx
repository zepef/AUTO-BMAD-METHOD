"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  FolderKanban,
  Users,
  Clock,
  MoreVertical,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const MOCK_PROJECTS = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment integration",
    color: "#8b5cf6",
    phase: "Phase 3: Solutioning",
    progress: 65,
    team: [
      { name: "John Doe", avatar: "JD" },
      { name: "Sarah Smith", avatar: "SS" },
      { name: "Mike Johnson", avatar: "MJ" },
    ],
    artifacts: 12,
    updatedAt: "2 hours ago",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Mobile App Redesign",
    description: "Complete UX overhaul for iOS and Android applications",
    color: "#0ea5e9",
    phase: "Phase 2: Discovery",
    progress: 40,
    team: [
      { name: "Emma Wilson", avatar: "EW" },
      { name: "Alex Brown", avatar: "AB" },
    ],
    artifacts: 8,
    updatedAt: "5 hours ago",
    status: "active" as const,
  },
  {
    id: "3",
    name: "API Gateway Service",
    description: "Microservices architecture with API gateway pattern",
    color: "#10b981",
    phase: "Phase 4: Implementation",
    progress: 85,
    team: [
      { name: "David Lee", avatar: "DL" },
      { name: "Lisa Chen", avatar: "LC" },
      { name: "Tom Anderson", avatar: "TA" },
      { name: "Kate Martin", avatar: "KM" },
    ],
    artifacts: 18,
    updatedAt: "1 day ago",
    status: "active" as const,
  },
  {
    id: "4",
    name: "Customer Portal v2",
    description: "Next-generation customer self-service platform",
    color: "#f59e0b",
    phase: "Phase 1: Analysis",
    progress: 20,
    team: [
      { name: "Robert Green", avatar: "RG" },
    ],
    artifacts: 4,
    updatedAt: "3 days ago",
    status: "planning" as const,
  },
];

const STATUS_VARIANTS = {
  active: "default" as const,
  planning: "secondary" as const,
  completed: "success" as const,
  onHold: "outline" as const,
};

export default function ProjectsPage() {
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
          <Button className="gap-2">
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
                    Active Projects
                  </p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {MOCK_PROJECTS.filter((p) => p.status === "active").length}
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
                    Team Members
                  </p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {
                      new Set(MOCK_PROJECTS.flatMap((p) => p.team.map((t) => t.name)))
                        .size
                    }
                  </p>
                </div>
                <div className="rounded-full bg-secondary-100 p-3">
                  <Users className="h-6 w-6 text-secondary-600" />
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
                    {MOCK_PROJECTS.reduce((acc, p) => acc + p.artifacts, 0)}
                  </p>
                </div>
                <div className="rounded-full bg-amber-100 p-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {MOCK_PROJECTS.map((project) => (
            <Card
              key={project.id}
              className="group transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1 h-10 w-10 rounded-lg"
                      style={{ backgroundColor: project.color }}
                    />
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {project.description}
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
                  {/* Phase & Progress */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">
                        {project.phase}
                      </span>
                      <span className="text-sm font-medium text-neutral-700">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project.team.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FolderKanban className="h-4 w-4" />
                        <span>{project.artifacts}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{project.updatedAt}</span>
                      </div>
                    </div>
                    <Badge variant={STATUS_VARIANTS[project.status]}>
                      {project.status}
                    </Badge>
                  </div>

                  {/* Team Avatars */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 4).map((member, idx) => (
                        <Avatar
                          key={idx}
                          className="h-8 w-8 border-2 border-white"
                        >
                          <AvatarFallback className="bg-neutral-200 text-xs text-neutral-700">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.team.length > 4 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-neutral-200 text-xs font-medium text-neutral-700">
                          +{project.team.length - 4}
                        </div>
                      )}
                    </div>

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

        {/* Empty State (if no projects) */}
        {MOCK_PROJECTS.length === 0 && (
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
            <Button className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
