import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const contractRouter = createTRPCRouter({
  findMany: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const findManyContract = await ctx.prisma.contract.findMany({
      include: { renter: true },
    });
    return findManyContract;
  }),
});
