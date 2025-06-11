// src/server/api/routers/role.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { permissionMiddleware } from "@/server/api/middleware/permissions";

export const roleRouter = createTRPCRouter({
 getAll: protectedProcedure
  .use(permissionMiddleware)
 .query(async ({ ctx }) => {

  return ctx.db.role.findMany({
  include: {
    dept: {
      select: {
        id: true,
        name: true,
        fullName: true,
      },
    },
    permissions: {
      select: {
        permission: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
});

}),


     create: protectedProcedure
  .input(
    z.object({
      
      name: z.string().min(1),
      deptId: z.string(),
    })
  )
  .use(permissionMiddleware)
  .mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.role.findUnique({
      where: {
        name_deptId: {
        name: input.name,
        deptId: input.deptId,
        } // Optional: prevent duplicate role in same dept
      },
    });

    if (existing) {
      throw new Error("Role with this name and department already exists.");
    }

    const newRole = await ctx.db.role.create({
      data: {
        name: input.name,
        deptId: input.deptId,
      },
      include: {
        dept: {
          select: {
            name: true,
            fullName: true,
          },
        },
      },
    });

    return newRole;
  }),

   delete: protectedProcedure
  .input(
    z.object({
      id: z.string(), // Delete by id
    })
  ).use(permissionMiddleware)
  .mutation(async ({ ctx, input }) => {
    try {
      const delRole = await ctx.db.role.delete({
        where: { id: input.id },
        include: {
          dept: {
            select: {
              name: true,
              fullName: true,
            },
          },
        },
      });
      // Prisma delete throws if no record found, so this check is optional
      if (!delRole) {
        throw new Error(`Role with id ${input.id} not found.`);
      }
      return delRole; // { name, fullName }
    } catch (error) {
      // You can customize error handling here if you want
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }),

  updatePermissions: protectedProcedure
  .input(
    z.object({
      roleId: z.string(),
      permissionId: z.string(),
    })
  )
  .use(permissionMiddleware)
  .mutation(async ({ input, ctx }) => {
    try {
      const { roleId, permissionId } = input;

      const existing = await ctx.db.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });

      if (existing) {
        const deleted = await ctx.db.rolePermission.delete({
          where: {
            roleId_permissionId: {
              roleId,
              permissionId,
            },
          },
          select: {
            role: { select: { name: true } },
            permission: { select: { name: true } },
          },
        });

        return {
          action: "deleted",
          role: deleted.role,
          perm: deleted.permission,
        };
      } else {
        const created = await ctx.db.rolePermission.create({
          data: {
            roleId,
            permissionId,
          },
          select: {
            role: { select: { name: true } },
            permission: { select: { name: true } },
          },
        });

        return {
          action: "created",
          role: created.role,
          perm: created.permission,
        };
      }
    } catch (error) {
      console.error("Failed to toggle role permission:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while updating permissions."
      );
    }
  }),


 
});
