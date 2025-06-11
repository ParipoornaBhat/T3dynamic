// src/server/api/routers/permission.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { permissionMiddleware } from "@/server/api/middleware/permissions";

export const permRouter = createTRPCRouter({
  getAll: protectedProcedure 
  .use(permissionMiddleware)
  .query(async ({ ctx }) => {
    return ctx.db.permission.findMany();
  }),

  
    
    
    create: protectedProcedure
      .input(
        z.object({
            name: z.string().min(1),
        })
      ).use(permissionMiddleware)
      .mutation(async ({ ctx, input }) => {
        const existing = await ctx.db.permission.findUnique({
          where: {
            name: input.name, // Optional: prevent duplicate role in same dept
          },
        });

        if (existing) {
          throw new Error("Permission with this name already exists.");
        }

        const newPerm = await ctx.db.permission.create({
          data: {
            name: input.name,
          },
        });

        return newPerm;
      }),


    


    delete: protectedProcedure
      .input(
        z.object({
          id: z.string(), // Delete by id
        })
      ).use(permissionMiddleware)
      .mutation(async ({ ctx, input }) => {
        try {
          const delPerm = await ctx.db.permission.delete({
            where: { id: input.id },
          });
          // Prisma delete throws if no record found, so this check is optional
          if (!delPerm) {
            throw new Error(`Permission with id ${input.id} not found.`);
          }
          return delPerm; // { name, fullName }
        } catch (error) {
          // You can customize error handling here if you want
          throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
        }
      }),
});
