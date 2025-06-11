import { z } from "zod";
import crypto from "crypto";
import { addMinutes, differenceInSeconds, subHours } from "date-fns";
import { sendMail } from "@/lib/hooks/mailer";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import bcrypt from "bcryptjs";
export const passRouter = createTRPCRouter({
requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) return; // silent success for unknown emails

      // Check for existing, unexpired token
      const existingToken = await ctx.db.passwordResetToken.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
          used: false,
        },
      });

      if (existingToken) {
        const secondsLeft = differenceInSeconds(existingToken.expiresAt, new Date());
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;

        throw new Error(
          `A reset link has already been sent. Please wait ${minutes}m ${seconds}s before requesting a new one.`
        );
      }

      // Check how many tokens were created in the last 24 hours
      const past24h = subHours(new Date(), 24);
      const requestsInLastDay = await ctx.db.passwordResetToken.count({
        where: {
          userId: user.id,
          createdAt: { gt: past24h },
        },
      });

      if (requestsInLastDay >= 2) {
        throw new Error(
          "You’ve reached the maximum of 2 password reset requests within 24 hours."
        );
      }

      // Create a new token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = addMinutes(new Date(), 10);

      await ctx.db.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });


    const resetLink = `${process.env.FRONTEND_URL}/auth/resetpassword?token=${token}`;
    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link is valid for 10 minutes.</p>`,
    });
  }),

    resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        newPassword: z.string().min(6),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const record = await ctx.db.passwordResetToken.findUnique({
        where: { token: input.token },
      });

      if (!record || record.expiresAt < new Date() || record.used) {
        throw new Error("BAD_REQUEST: Invalid or expired token");
      }

      const hashed = await bcrypt.hash(input.newPassword, 10);
      await ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: record.userId },
          data: { password: hashed },
        }),
        ctx.db.passwordResetToken.update({
          where: { id: record.id },
          data: { used: true },
        }),
      ]);

      return { success: true };
    }),
 verifyResetToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input, ctx }) => {
      const tokenRow = await ctx.db.passwordResetToken.findFirst({
        where: {
          token: input.token,
          expiresAt: { gte: new Date() },
          used: false,
        },
        select: { id: true },
      });
      return { valid: !!tokenRow }; // { valid: true | false }
    }),

});
