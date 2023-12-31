import { createTRPCRouter } from "~/server/api/trpc";
import { accountsRouter } from "../../../prisma/generated/routers/Account.router";
import { contractsRouter } from "../../../prisma/generated/routers/Contract.router";
import { contractratesRouter } from "../../../prisma/generated/routers/ContractRate.router";
import { rentersRouter } from "../../../prisma/generated/routers/Renter.router";
import { usersRouter } from "../../../prisma/generated/routers/User.router";
import { contractRouter } from "./routers/contracts";
import { userRouter as customUserRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customUser: customUserRouter,
  customContract: contractRouter,
  user: usersRouter,
  account: accountsRouter,
  renter: rentersRouter,
  contract: contractsRouter,
  contractRate: contractratesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
