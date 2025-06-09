// src/server/api/routers/dept.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const deptRouter = createTRPCRouter({
getAll: protectedProcedure.query(async ({ ctx }) => {
  return ctx.db.dept.findMany({
    include: {
      roles: {
        select:{
            id: true,
            name: true,
        }

      },
    },
  });
}),



 create: protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(10),        // short code like "ADM"
      fullName: z.string().min(3).max(100),   // descriptive name like "Administration"
    })
  )
  .mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.dept.findUnique({
      where: { name: input.name },
    });

    if (existing) {
      throw new Error("Department with this name already exists.");
    }

    const newDept = await ctx.db.dept.create({
      data: {
        name: input.name,
        fullName: input.fullName,
      },
    });

    return newDept;
  }),


delete: protectedProcedure
  .input(
    z.object({
      id: z.string().min(1), // Delete by id
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const deletedDept = await ctx.db.dept.delete({
        where: { id: input.id },
        include: {
          roles: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });


      // Prisma delete throws if no record found, so this check is optional
      if (!deletedDept) {
        throw new Error(`Department with id ${input.id} not found.`);
      }

      return deletedDept; // { name, fullName }
    } catch (error) {
      // You can customize error handling here if you want
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }),


});
