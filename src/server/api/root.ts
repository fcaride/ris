import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { examplesRouter } from "../../../prisma/generated/routers/Example.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  example: examplesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
