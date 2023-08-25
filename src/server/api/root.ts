import { createTRPCRouter } from "~/server/api/trpc";
import { accountsRouter } from "../../../prisma/generated/routers/Account.router";
import { examplesRouter } from "../../../prisma/generated/routers/Example.router";
import { usersRouter } from "../../../prisma/generated/routers/User.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: examplesRouter,
  user: usersRouter,
  account: accountsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
