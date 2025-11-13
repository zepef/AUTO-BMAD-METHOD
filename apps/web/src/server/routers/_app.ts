/**
 * Main tRPC Router
 *
 * Combines all routers into a single app router
 */

import { createTRPCRouter } from "../trpc";
import { artifactRouter } from "./artifact";
import { projectRouter } from "./project";

export const appRouter = createTRPCRouter({
  artifact: artifactRouter,
  project: projectRouter,
  // Add more routers here as needed:
  // message: messageRouter,
  // user: userRouter,
});

// Export type definition of the API
export type AppRouter = typeof appRouter;
