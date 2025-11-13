/**
 * Project Router
 *
 * Handles CRUD operations for projects
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getTemplateById } from "@/lib/project-templates";

// Zod schemas for validation
const projectStatusSchema = z.enum(["active", "archived", "completed"]);

const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: projectStatusSchema.default("active"),
});

const createFromTemplateSchema = z.object({
  templateId: z.string().min(1, "Template ID is required"),
  name: z.string().optional(), // Override template name
  description: z.string().optional(), // Override template description
});

const updateProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: projectStatusSchema.optional(),
});

export const projectRouter = createTRPCRouter({
  /**
   * Get all projects for a user
   * Optionally filter by status
   */
  list: publicProcedure
    .input(
      z.object({
        status: projectStatusSchema.optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(), // for pagination
      })
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};

      if (input.status) {
        where.status = input.status;
      }

      const projects = await ctx.prisma.project.findMany({
        where,
        take: input.limit + 1, // Get one extra to check if there are more
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          _count: {
            select: {
              artifacts: true,
              messages: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (projects.length > input.limit) {
        const nextItem = projects.pop();
        nextCursor = nextItem?.id;
      }

      return {
        projects,
        nextCursor,
      };
    }),

  /**
   * Get a single project by ID with its artifacts
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        include: {
          artifacts: {
            orderBy: {
              updatedAt: "desc",
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              artifacts: true,
              messages: true,
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    }),

  /**
   * Create a new project
   */
  create: publicProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Get userId from authenticated session
      // For now, create or get a default user
      let user = await ctx.prisma.user.findFirst();

      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            email: "demo@flowforge.dev",
            name: "Demo User",
          },
        });
      }

      const project = await ctx.prisma.project.create({
        data: {
          ...input,
          userId: user.id,
        },
        include: {
          _count: {
            select: {
              artifacts: true,
              messages: true,
            },
          },
        },
      });

      return project;
    }),

  /**
   * Create a new project from a template
   */
  createFromTemplate: publicProcedure
    .input(createFromTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      // Get the template
      const template = getTemplateById(input.templateId);
      if (!template) {
        throw new Error(`Template not found: ${input.templateId}`);
      }

      // Get or create user
      let user = await ctx.prisma.user.findFirst();
      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            email: "demo@flowforge.dev",
            name: "Demo User",
          },
        });
      }

      // Create project with template data (allow overrides)
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name || template.name,
          description: input.description || template.description,
          status: "active",
          userId: user.id,
        },
        include: {
          _count: {
            select: {
              artifacts: true,
              messages: true,
            },
          },
        },
      });

      // Create default artifacts from template
      const artifactPromises = template.defaultArtifacts.map((artifact) =>
        ctx.prisma.artifact.create({
          data: {
            ...artifact,
            projectId: project.id,
            userId: user.id,
          },
        })
      );

      await Promise.all(artifactPromises);

      // Return project with updated artifact count
      const projectWithArtifacts = await ctx.prisma.project.findUnique({
        where: { id: project.id },
        include: {
          artifacts: {
            orderBy: {
              createdAt: "asc",
            },
          },
          _count: {
            select: {
              artifacts: true,
              messages: true,
            },
          },
        },
      });

      return projectWithArtifacts;
    }),

  /**
   * Update an existing project
   */
  update: publicProcedure
    .input(updateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const project = await ctx.prisma.project.update({
        where: { id },
        data,
        include: {
          _count: {
            select: {
              artifacts: true,
              messages: true,
            },
          },
        },
      });

      return project;
    }),

  /**
   * Delete a project
   */
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.delete({
        where: { id: input.id },
      });

      return project;
    }),

  /**
   * Get project statistics
   */
  stats: publicProcedure.query(async ({ ctx }) => {
    const [total, byStatus, totalArtifacts, totalMessages] = await Promise.all([
      ctx.prisma.project.count(),
      ctx.prisma.project.groupBy({
        by: ["status"],
        _count: true,
      }),
      ctx.prisma.artifact.count(),
      ctx.prisma.message.count(),
    ]);

    return {
      total,
      byStatus,
      totalArtifacts,
      totalMessages,
    };
  }),

  /**
   * Export a project with all its artifacts
   */
  export: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        include: {
          artifacts: {
            select: {
              id: true,
              type: true,
              title: true,
              description: true,
              content: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      // Create export data structure
      const exportData = {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        project: {
          name: project.name,
          description: project.description,
          status: project.status,
          artifacts: project.artifacts,
        },
      };

      return exportData;
    }),

  /**
   * Import a project from export data
   */
  import: publicProcedure
    .input(
      z.object({
        data: z.object({
          version: z.string(),
          project: z.object({
            name: z.string(),
            description: z.string().nullable(),
            status: z.enum(["active", "archived", "completed"]),
            artifacts: z.array(
              z.object({
                type: z.enum(["prd", "architecture", "story", "epic", "tech-spec", "document"]),
                title: z.string(),
                description: z.string().nullable(),
                content: z.string(),
                status: z.enum(["draft", "in-progress", "completed", "archived"]),
              })
            ),
          }),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get or create user
      let user = await ctx.prisma.user.findFirst();
      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            email: "demo@flowforge.dev",
            name: "Demo User",
          },
        });
      }

      // Create project
      const project = await ctx.prisma.project.create({
        data: {
          name: input.data.project.name,
          description: input.data.project.description,
          status: input.data.project.status,
          userId: user.id,
        },
      });

      // Create artifacts
      const artifactPromises = input.data.project.artifacts.map((artifact) =>
        ctx.prisma.artifact.create({
          data: {
            type: artifact.type,
            title: artifact.title,
            description: artifact.description,
            content: artifact.content,
            status: artifact.status,
            projectId: project.id,
            userId: user.id,
          },
        })
      );

      await Promise.all(artifactPromises);

      // Return project with artifacts
      const importedProject = await ctx.prisma.project.findUnique({
        where: { id: project.id },
        include: {
          artifacts: true,
          _count: {
            select: {
              artifacts: true,
              messages: true,
            },
          },
        },
      });

      return importedProject;
    }),
});
