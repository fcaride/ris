import { Category, RateType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const createContractSchema = z.object({
  id: z.string().optional(),
  startsAt: z.date().min(new Date()),
  endsAt: z.date().min(new Date()),
  renterId: z.string(),
  rates: z.array(
    z.object({
      id: z.string().optional(),
      rate: z.number().min(0),
      rateType: z.nativeEnum(RateType),
      category: z.nativeEnum(Category),
      deleted: z.boolean().optional(),
    })
  ),
});

export const contractRouter = createTRPCRouter({
  findMany: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const findManyContract = await ctx.prisma.contract.findMany({
      include: { renter: true, ContractRate: true },
    });
    return findManyContract;
  }),
  createContractWithRates: protectedProcedure
    .input(createContractSchema)
    .mutation(async ({ ctx, input }) => {
      const contract = await ctx.prisma.contract.create({
        data: {
          endsAt: input.endsAt,
          startsAt: input.startsAt,
          renterId: input.renterId,
          ContractRate: { create: input.rates },
        },
      });
      return contract;
    }),
  updateContractWithRates: protectedProcedure
    .input(createContractSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const contract = await ctx.prisma.contract.update({
        where: { id: input.id },
        data: {
          endsAt: input.endsAt,
          startsAt: input.startsAt,
          renterId: input.renterId,
          ContractRate: {
            update: input.rates
              .filter((rate) => rate.id && !rate.deleted)
              .map((rate) => ({
                where: { id: rate.id },
                data: {
                  rate: rate.rate,
                  rateType: rate.rateType,
                  category: rate.category,
                },
              })),
            create: input.rates
              .filter((rate) => !rate.id && !rate.deleted)
              .map((rate) => ({
                rate: rate.rate,
                rateType: rate.rateType,
                category: rate.category,
              })),
            delete: input.rates
              .filter((rate) => rate.deleted)
              .map((rate) => ({
                id: rate.id,
              })),
          },
        },
      });
      return contract;
    }),
});
