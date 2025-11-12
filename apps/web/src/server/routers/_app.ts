/**
 * Main tRPC Router
 *
 * Combines all routers into a single app router
 */

import { createTRPCRouter } from "../trpc";
import { artifactRouter } from "./artifact";

export const appRouter = createTRPCRouter({
  artifact: artifactRouter,
  // Add more routers here as needed:
  // project: projectRouter,
  // message: messageRouter,
  // user: userRouter,
});

// Export type definition of the API
export type AppRouter = typeof appRouter;
