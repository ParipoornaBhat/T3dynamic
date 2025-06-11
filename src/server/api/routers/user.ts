import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { permissionMiddleware } from "@/server/api/middleware/permissions";

export const userRouter = createTRPCRouter({
  signUpCustomer: protectedProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      fname: z.string().min(1).max(50),
      lname: z.string().min(1).max(50),
      phone: z.string(),
      brands: z.array(z.string()).optional(),
      addresses: z.array(z.string()).optional(),
      companyBilling: z.array(z.string()).optional(),
    })
  )
  .use(permissionMiddleware)
  .mutation(async ({ ctx, input }) => {
    const {
      email,
      password,
      fname,
      lname,
      phone,
      brands = [],
      addresses = [],
      companyBilling = [],
    } = input;

    const existingUser = await ctx.db.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await ctx.db.user.create({
      data: {
        name: `${fname} ${lname}`,
        email,
        phone,
        password: hashedPassword,
        type: "CUSTOMER",
      },
    });

    await ctx.db.customer.create({
      data: {
        userId: newUser.id,
        brands,
        addresses,
        companyBilling,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
  }),

  signUpEmployee: protectedProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      fname: z.string().min(1).max(50),
      lname: z.string().min(1).max(50),
      phone: z.string(),
      roleId: z.string(),
    })
  )
  .use(permissionMiddleware)
  .mutation(async ({ ctx, input }) => {
    const { email, password, fname, lname, phone, roleId } = input;

    const existingUser = await ctx.db.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const role = await ctx.db.role.findUnique({ where: { id: roleId } });
    if (!role) throw new Error("Invalid role");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await ctx.db.user.create({
      data: {
        name: `${fname} ${lname}`,
        email,
        phone,
        password: hashedPassword,
        type: "EMPLOYEE",
      },
    });

    await ctx.db.employee.create({
      data: {
        userId: newUser.id,
        roleId: role.id,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
  }),

//general profiles operations
viewProfile: protectedProcedure.query(async ({ ctx }) => {
  const user = await ctx.db.user.findUnique({
    where: { id: ctx.session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      type: true,
      msgEmail: true,
      msgWhatsapp: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          companyBilling: true,
          brands: true,
          addresses: true,
          totalItemsBOPP: true,
          totalItemsPET: true,
        },
      },
      employee: {
        select: {
          role: {
            select: {
              name: true,
              dept: {
                select: {
                  name: true,
                  fullName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) throw new Error("NOT_FOUND: User not found");

  const profile= {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    type: user.type,
    msgEmail: user.msgEmail,
    msgWhatsapp: user.msgWhatsapp,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),

    // Role logic based on user type
    role: user.employee
      ? {
          name: user.employee.role.name,
          dept: {
            name: user.employee.role.dept.name,
            fullName: user.employee.role.dept.fullName,
          },
        }
      : "CUSTOMER" as const,

    // Customer-specific data
    ...(user.customer && {
      customer: {
        companyBilling: user.customer.companyBilling,
        brands: user.customer.brands,
        addresses: user.customer.addresses,
        totalItemsBOPP: user.customer.totalItemsBOPP,
        totalItemsPET: user.customer.totalItemsPET,
      },
    }),
  };

  return profile;
}),


 updateNotification: protectedProcedure
  .input(
    z
      .object({
        userId: z.string(),
        msgEmail: z.boolean().optional(),
        msgWhatsapp: z.boolean().optional(),
        msgWeb: z.boolean().optional(),
      })
      .refine((data) => data.msgEmail !== undefined || data.msgWhatsapp !== undefined || data.msgWeb !== undefined, {
        message: "One notification field is required.",
      })
  )
  .mutation(async ({ ctx, input }) => {
    const { userId, msgEmail, msgWhatsapp, msgWeb } = input;

    const data: Record<string, boolean> = {};
    if (msgEmail !== undefined) data.msgEmail = msgEmail;
    if (msgWhatsapp !== undefined) data.msgWhatsapp = msgWhatsapp;
    if (msgWeb !== undefined) data.msgWeb = msgWeb;

    const updatedUser = await ctx.db.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        msgEmail: true,
        msgWhatsapp: true,
        msgWeb: true,
      },
    });

    const field = Object.keys(data)[0]; // only one field is expected
    return { user: updatedUser, field };
  }),


  editProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        brands: z.array(z.string()).optional(),
        addresses: z.array(z.string()).optional(),
        companyBilling: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, phone, brands, addresses, companyBilling } = input;

      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: name ?? undefined,
          phone: phone ?? undefined,
        },
      });

      const customer = await ctx.db.customer.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (customer) {
        await ctx.db.customer.update({
          where: { userId: ctx.session.user.id },
          data: {
            brands: brands ?? customer.brands,
            addresses: addresses ?? customer.addresses,
            companyBilling: companyBilling ?? customer.companyBilling,
          },
        });
      }

      return { success: true };
    }),


    //manage user and employee operations




  viewAnyProfile: protectedProcedure
    .input(z.object({ userId: z.string() }))
  .use(permissionMiddleware)

    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      type: true,
      msgEmail: true,
      msgWhatsapp: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          companyBilling: true,
          brands: true,
          addresses: true,
          totalItemsBOPP: true,
          totalItemsPET: true,
        },
      },
      employee: {
        select: {
          role: {
            select: {
              name: true,
              dept: {
                select: {
                  name: true,
                  fullName: true,
                },
              },
            },
          },
        },
      },
    },
  });

      if (!user) throw new Error("User not found");

      const profile= {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    type: user.type,
    msgEmail: user.msgEmail,
    msgWhatsapp: user.msgWhatsapp,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),

    // Role logic based on user type
    role: user.employee
      ? {
          name: user.employee.role.name,
          dept: {
            name: user.employee.role.dept.name,
            fullName: user.employee.role.dept.fullName,
          },
        }
      : "CUSTOMER" as const,

    // Customer-specific data
    ...(user.customer && {
      customer: {
        companyBilling: user.customer.companyBilling,
        brands: user.customer.brands,
        addresses: user.customer.addresses,
        totalItemsBOPP: user.customer.totalItemsBOPP,
        totalItemsPET: user.customer.totalItemsPET,
      },
    }),
  };

  return profile;
    }),


    editAnyProfile: protectedProcedure
  .input(
    z.object({
      userId: z.string(),
      name: z.string().optional(),
      phone: z.string().optional(),
      brands: z.array(z.string()).optional(),
      addresses: z.array(z.string()).optional(),
      companyBilling: z.array(z.string()).optional(),
    })
  )
  .use(permissionMiddleware)
  .mutation(async ({ ctx, input }) => {
    const { userId, name, phone, brands, addresses, companyBilling } = input;

    // Update the User
    const updatedUser = await ctx.db.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
      },
    });

    // If user is a customer, update the customer-specific fields
    if (updatedUser.type === "CUSTOMER") {
      await ctx.db.customer.update({
        where: { userId },
        data: {
          ...(brands && { brands }),
          ...(addresses && { addresses }),
          ...(companyBilling && { companyBilling }),
        },
      });
    }

    return { success: true };
  }),


});
