import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const CATEGORIES_PER_PAGE = 6;
export const categoryRouter = createTRPCRouter({
  getPaginated: privateProcedure
    .input(
      z.object({
        page: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { page } = input;

      const categories = await ctx.prisma.category.findMany({
        select: {
          id: true,
          users: {
            select: {
              id: true,
            },
          },
          name: true,
        },
        skip: (page - 1) * CATEGORIES_PER_PAGE,
        take: CATEGORIES_PER_PAGE,
        orderBy: {},
      });

      if (!categories) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error getting categories",
        });
      }
      return {
        categories,
      };
    }),

  selectCategory: privateProcedure
    .input(
      z.object({
        category: z.string(),
        categoryId: z.string(),
        intent: z.enum(["connect", "disconnect"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { categoryId, intent } = input;
      const { sessionId } = ctx;

      const session = await ctx.prisma.session.findFirst({
        where: {
          id: sessionId,
        },
        select: {
          id: true,
          userId: true,
        },
      });
      let category;
      if (intent === "connect") {
        category = await ctx.prisma.category.update({
          where: {
            id: categoryId,
          },
          data: {
            users: {
              connect: {
                id: session?.userId,
              },
            },
          },
        });
      } else {
        category = await ctx.prisma.category.update({
          where: {
            id: categoryId,
          },
          data: {
            users: {
              disconnect: {
                id: session?.userId,
              },
            },
          },
        });
      }

      return {
        userId: session?.userId,
        category: category,
      };
    }),
});
