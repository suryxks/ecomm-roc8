import { z } from "zod";
import cookie from "cookie";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getPasswordHash, verifyPasword } from "~/utils/auth";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password, name } = input;
      const hash = await getPasswordHash(password);
      const user = await ctx.prisma.user.findFirst({
        where: { email: email },
      });
      if (user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with the same email already exists",
        });
      }
      const session = await ctx.prisma.session.create({
        data: {
          user: {
            create: {
              name: name,
              email: email,
              password: {
                create: {
                  hash: hash,
                },
              },
            },
          },
        },
        select: { id: true, userId: true },
      });

      if (!session) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating user and session",
        });
      }
      ctx.res.setHeader(
        "set-cookie",
        cookie.serialize("sessionId", session.id, {
          secure: true,
          httpOnly: true,
          path: "/",
          sameSite: "lax",
        }),
      );
      return {
        session,
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const user = await ctx.prisma.user.findFirst({
        where: { email: email },
        select: {
          id: true,
          password: {
            select: {
              hash: true,
            },
          },
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const isPasswordvalid = await verifyPasword(
        user.password?.hash ?? "",
        password,
      );
      if (!isPasswordvalid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }
      const session = await ctx.prisma.session.create({
        data: {
          userId: user.id,
        },
      });
      ctx.res.setHeader(
        "set-cookie",
        cookie.serialize("sessionId", session.id, {
          secure: true,
          httpOnly: true,
          path: "/",
          sameSite: "lax",
        }),
      );
      return {
        userId: user.id,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.prisma.category.create({
        data: {
          name: input.name,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      orderBy: { created_at: "desc" },
    });
  }),
});
