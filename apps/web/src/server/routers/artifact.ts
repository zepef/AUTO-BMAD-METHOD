/**
 * Artifact Router
 *
 * Handles CRUD operations for artifacts (PRDs, Architecture docs, User Stories, etc.)
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// Zod schemas for validation
const artifactTypeSchema = z.enum([
  "prd",
  "architecture",
  "story",
  "epic",
  "tech-spec",
  "document",
]);

const artifactStatusSchema = z.enum(["draft", "in-progress", "completed"]);

const createArtifactSchema = z.object({
  type: artifactTypeSchema,
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content: z.string().default(""),
  status: artifactStatusSchema.default("draft"),
  projectId: z.string().optional(),
});

const updateArtifactSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  status: artifactStatusSchema.optional(),
  type: artifactTypeSchema.optional(),
});

export const artifactRouter = createTRPCRouter({
  /**
   * Get all artifacts for a user
   * Optionally filter by project ID or type
   */
  list: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        type: artifactTypeSchema.optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(), // for pagination
      })
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};

      if (input.projectId) {
        where.projectId = input.projectId;
      }

      if (input.type) {
        where.type = input.type;
      }

      const artifacts = await ctx.prisma.artifact.findMany({
        where,
        take: input.limit + 1, // Get one extra to check if there are more
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          updatedAt: "desc",
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (artifacts.length > input.limit) {
        const nextItem = artifacts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        artifacts,
        nextCursor,
      };
    }),

  /**
   * Get a single artifact by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const artifact = await ctx.prisma.artifact.findUnique({
        where: { id: input.id },
        include: {
          project: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!artifact) {
        throw new Error("Artifact not found");
      }

      return artifact;
    }),

  /**
   * Create a new artifact
   */
  create: publicProcedure
    .input(createArtifactSchema)
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

      const artifact = await ctx.prisma.artifact.create({
        data: {
          ...input,
          userId: user.id,
        },
      });

      return artifact;
    }),

  /**
   * Update an existing artifact
   */
  update: publicProcedure
    .input(updateArtifactSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const artifact = await ctx.prisma.artifact.update({
        where: { id },
        data,
      });

      return artifact;
    }),

  /**
   * Delete an artifact
   */
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const artifact = await ctx.prisma.artifact.delete({
        where: { id: input.id },
      });

      return artifact;
    }),

  /**
   * Get artifact statistics
   */
  stats: publicProcedure.query(async ({ ctx }) => {
    const [total, byType, byStatus] = await Promise.all([
      ctx.prisma.artifact.count(),
      ctx.prisma.artifact.groupBy({
        by: ["type"],
        _count: true,
      }),
      ctx.prisma.artifact.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    return {
      total,
      byType,
      byStatus,
    };
  }),
});
