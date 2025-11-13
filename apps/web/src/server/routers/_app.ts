/**
 * Main tRPC Router
 *
 * Combines all routers into a single app router
 */

import { createTRPCRouter } from "../trpc";
import { artifactRouter } from "./artifact";
import { projectRouter } from "./project";
import { chatRouter } from "./chat";

export const appRouter = createTRPCRouter({
  artifact: artifactRouter,
  project: projectRouter,
  chat: chatRouter,
  // Add more routers here as needed:
  // user: userRouter,
});

// Export type definition of the API
export type AppRouter = typeof appRouter;
