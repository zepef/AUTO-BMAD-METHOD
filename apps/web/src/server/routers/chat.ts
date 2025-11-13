/**
 * Chat Router
 *
 * Handles chat sessions and message persistence
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// Zod schemas for validation
const createSessionSchema = z.object({
  title: z.string().default("New Chat"),
  projectId: z.string().optional(),
});

const updateSessionSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  projectId: z.string().optional().nullable(),
});

const createMessageSchema = z.object({
  sessionId: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1, "Message content is required"),
  agentId: z.string().optional(),
});

export const chatRouter = createTRPCRouter({
  /**
   * Get all chat sessions for a user
   * Returns sessions sorted by most recently updated
   */
  listSessions: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};

      if (input.projectId) {
        where.projectId = input.projectId;
      }

      const sessions = await ctx.prisma.chatSession.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (sessions.length > input.limit) {
        const nextItem = sessions.pop();
        nextCursor = nextItem?.id;
      }

      return {
        sessions,
        nextCursor,
      };
    }),

  /**
   * Get a single chat session with all its messages
   */
  getSession: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.prisma.chatSession.findUnique({
        where: { id: input.id },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!session) {
        throw new Error("Chat session not found");
      }

      return session;
    }),

  /**
   * Create a new chat session
   */
  createSession: publicProcedure
    .input(createSessionSchema)
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

      const session = await ctx.prisma.chatSession.create({
        data: {
          ...input,
          userId: user.id,
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
      });

      return session;
    }),

  /**
   * Update an existing chat session (title, project link)
   */
  updateSession: publicProcedure
    .input(updateSessionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const session = await ctx.prisma.chatSession.update({
        where: { id },
        data,
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
      });

      return session;
    }),

  /**
   * Delete a chat session (and all its messages due to cascade)
   */
  deleteSession: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.prisma.chatSession.delete({
        where: { id: input.id },
      });

      return session;
    }),

  /**
   * Create a new message in a session
   */
  createMessage: publicProcedure
    .input(createMessageSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Get userId from authenticated session
      let user = await ctx.prisma.user.findFirst();

      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            email: "demo@flowforge.dev",
            name: "Demo User",
          },
        });
      }

      const message = await ctx.prisma.message.create({
        data: {
          ...input,
          userId: user.id,
        },
      });

      // Update session's updatedAt timestamp
      await ctx.prisma.chatSession.update({
        where: { id: input.sessionId },
        data: { updatedAt: new Date() },
      });

      return message;
    }),

  /**
   * Get messages for a specific session
   */
  getMessages: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        limit: z.number().min(1).max(200).default(100),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.message.findMany({
        where: {
          sessionId: input.sessionId,
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "asc",
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (messages.length > input.limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  /**
   * Delete all messages in a session (clear chat)
   */
  clearMessages: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.message.deleteMany({
        where: {
          sessionId: input.sessionId,
        },
      });

      return result;
    }),

  /**
   * Get chat statistics
   */
  stats: publicProcedure.query(async ({ ctx }) => {
    const [totalSessions, totalMessages] = await Promise.all([
      ctx.prisma.chatSession.count(),
      ctx.prisma.message.count(),
    ]);

    return {
      totalSessions,
      totalMessages,
    };
  }),
});
