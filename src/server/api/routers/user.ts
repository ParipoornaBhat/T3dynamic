import { z } from "zod";
import bcrypt from "bcryptjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        fname: z.string().min(1).max(50),
        lname: z.string().min(1).max(50),
        phone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password, fname, lname, phone } = input;

      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error("User already exists");
      }
      const dept = await ctx.db.dept.findUnique({
        where: { name: "CUS" },
      });

      if (!dept) {
        throw new Error("Customer Service department not found");
      }
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await ctx.db.user.create({
        data: {
          email,
          password: hashedPassword,
          fname,
          lname,
          phone,
          role: {
            connect: {
              name_deptId: {
                name: "CUSTOMER",
                deptId: dept.id,
              },
            },
          }
        }
      });

      return { id: newUser.id, email: newUser.email, name: newUser.fname + " " + newUser.lname };
    }),
});
