import { createTRPCRouter } from "~/server/api/trpc";
import { accountsRouter } from "../../../prisma/generated/routers/Account.router";
import { contractsRouter } from "../../../prisma/generated/routers/Contract.router";
import { rentersRouter } from "../../../prisma/generated/routers/Renter.router";
import { usersRouter } from "../../../prisma/generated/routers/User.router";
import { userRouter as customUserRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customUser: customUserRouter,
  user: usersRouter,
  account: accountsRouter,
  renter: rentersRouter,
  contract: contractsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
