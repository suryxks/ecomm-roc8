/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import cookie from "cookie";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getPasswordHash, verifyPasword } from "~/utils/auth";
import { TRPCError } from "@trpc/server";
import { generateTOTP, verifyTOTP } from "@epic-web/totp";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

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
        select: { id: true, userId: true, user: { select: { email: true } } },
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

      const { otp, ...verificationConfig } = generateTOTP({
        algorithm: "SHA256",
        period: 10 * 60,
        digits: 8,
      });
      await resend.emails.send({
        from: "surya@skillhive.in",
        to: session.user.email,
        subject: "wellcome to Ecommerce",
        text: `Here is your otp ${otp} to verify your email`,
      });
      const type = "onboarding";
      const verificationData = {
        type,
        target: email,
        ...verificationConfig,
        expiresAt: new Date(Date.now() + verificationConfig.period * 1000),
      };
      await ctx.prisma.verification.upsert({
        where: { target_type: { target: email, type } },
        create: verificationData,
        update: verificationData,
      });
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

  getUserId: privateProcedure.query(async ({ ctx }) => {
    return {
      userId: ctx.userId,
    };
  }),
  getUser: privateProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.user,
    };
  }),
  verifyUser: privateProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const verificationConfig = await ctx.prisma.verification.findUnique({
        select: {
          secret: true,
          period: true,
          digits: true,
          algorithm: true,
          charSet: true,
        },
        where: {
          target_type: {
            target: ctx.user.email,
            type: "Onboarding",
          },
        },
      });
      if (!verificationConfig) {
        new TRPCError({
          code: "CONFLICT",
          message: "Invalid code",
        });
      }

      const isValid =
        verificationConfig &&
        verifyTOTP({
          otp: input.code,
          ...verificationConfig,
        });
      if (isValid) {
        await ctx.prisma.verification.delete({
          where: {
            target_type: {
              target: input.email,
              type: "Onboarding",
            },
          },
        });
      }
      return {
        isValid,
      };
    }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.setHeader(
      "set-cookie",
      cookie.serialize("sessionId", "", {
        secure: true,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 0,
      }),
    );
  }),
});
