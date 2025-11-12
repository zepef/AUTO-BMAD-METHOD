/**
 * tRPC Server Initialization
 *
 * This file sets up the tRPC server with context, error handling,
 * and type-safe procedures.
 */

import { initTRPC } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";

/**
 * Create context for tRPC requests
 * This runs for every request and provides access to:
 * - Database client
 * - Request headers
 * - User session (to be added later with authentication)
 */
export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    prisma,
    headers: opts.req.headers,
    // Add user session here when authentication is implemented
    // user: await getUserFromSession(opts.req),
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Middleware for authenticated requests (to be implemented)
// const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
//   if (!ctx.user) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return next({
//     ctx: {
//       user: ctx.user,
//     },
//   });
// });

// export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
