// src/server/api/routers/dept.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { permissionMiddleware } from "@/server/api/middleware/permissions";
import { TRPCError } from "@trpc/server";
export const deptRouter = createTRPCRouter({
 getAll: protectedProcedure
    .use(permissionMiddleware)
    .query(async ({ ctx }) => {
      try {
        const departments = await ctx.db.dept.findMany({
          include: {
            roles: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return departments;
      } catch (error) {
        console.error("Failed to fetch departments", error);

        // Optional: Customize based on known Prisma error types
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch departments. Please try again later.",
        });
      }
    }),

getAllDept: protectedProcedure
  .use(permissionMiddleware)
  .query(async ({ ctx }) => {
    try {
      const departments = await ctx.db.dept.findMany({
        select: {
          id: true,
          name: true,
          fullName: true,
        },
      });
      return departments;
    } catch (error) {
      console.error("Failed to fetch departments", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch departments. Please try again later.",
      });
    }
  }),



 create: protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(10),        // short code like "ADM"
      fullName: z.string().min(3).max(100),   // descriptive name like "Administration"
    })
  )
  .use(permissionMiddleware)
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
  ).use(permissionMiddleware)
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
