import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserRole: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findUnique({ where: { email: input.email } });
    }),

  setRoleToUser: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        newRole: z.union([z.literal("USER"), z.literal("ADMIN")]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { email: input.email },
        data: { role: input.newRole },
      });
    }),
});
