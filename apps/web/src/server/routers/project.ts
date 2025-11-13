/**
 * Project Router
 *
 * Handles CRUD operations for projects
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// Zod schemas for validation
const projectStatusSchema = z.enum(["active", "archived", "completed"]);

const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: projectStatusSchema.default("active"),
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
});
