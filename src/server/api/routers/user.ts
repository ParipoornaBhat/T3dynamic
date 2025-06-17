import { z } from "zod";
import bcrypt from "bcryptjs";
import type { Prisma } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { permissionMiddleware } from "@/server/api/middleware/permissions";

export const userRouter = createTRPCRouter({
  registerCustomer: protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(100),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string(),
      brands: z.array(z.string()).optional(),
      addresses: z.array(z.string()).optional(),
      companyBilling: z.array(z.string()).optional(),
    })
  )
  .use(permissionMiddleware)
  .mutation(async ({ ctx, input }) => {
    const {
      name,
      email,
      password,
      phone,
      brands = [],
      addresses = [],
      companyBilling = [],
    } = input;

    const existingUser = await ctx.db.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    // Fetch CUS department (short name must be "CUS")
    const dept = await ctx.db.dept.findUnique({ where: { name: "CUS" } });
    if (!dept) throw new Error("Customer department not found");

    // Generate customer ID (e.g., CUS-001)
    const nextCount = dept.memberCount + 1;
    const formattedId = `${dept.name}-${String(nextCount).padStart(3, "0")}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction: update count + create user + create customer
    const [, newUser] = await ctx.db.$transaction([
      ctx.db.dept.update({
        where: { id: dept.id },
        data: { memberCount: { increment: 1 } },
      }),
      ctx.db.user.create({
        data: {
          id: formattedId,
          name,
          email,
          phone,
          password: hashedPassword,
          type: "CUSTOMER",
        },
      }),
    ]);

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

  registerEmployee: protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(100),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string(),
      roleId: z.string(),
      deptId: z.string(), // required to fetch memberCount and name
    })
  )
  .use(permissionMiddleware)
  .mutation(async ({ ctx, input }) => {
    const { name, email, password, phone, roleId, deptId } = input;

    // Check for existing user
    const existingUser = await ctx.db.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    // Fetch department
    const dept = await ctx.db.dept.findUnique({ where: { id: deptId } });
    if (!dept) throw new Error("Invalid department");

    // Validate role belongs to department (optional)
    const role = await ctx.db.role.findUnique({ where: { id: roleId } });
    if (!role || role.deptId !== dept.id) {
      throw new Error("Role does not belong to the selected department");
    }

    // Generate user ID (e.g., DEV-001)
    const nextCount = dept.memberCount + 1;
    const formattedId = `${dept.name}-${String(nextCount).padStart(3, "0")}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Run all in transaction
    const [, newUser] = await ctx.db.$transaction([
      ctx.db.dept.update({
        where: { id: dept.id },
        data: { memberCount: { increment: 1 } },
      }),
      ctx.db.user.create({
        data: {
          id: formattedId,
          name,
          email,
          phone,
          password: hashedPassword,
          type: "EMPLOYEE",
        },
      }),
    ]);

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

      await ctx.db.user.update({
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

 searchCustomers: protectedProcedure
  .input(
    z.object({
      search: z.string().optional(),
      role: z.string().optional(), // allow filtering by role (e.g., AGENT, CUSTOMER)
      sort: z.enum([
        "name-asc",
        "name-desc",
        "email-asc",
        "email-desc",
        "createdAt-asc",
        "createdAt-desc",
      ]).optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
    })
  )
  .query(async ({ input, ctx }) => {
    const {
      search,
      role,
      sort = "name-asc",
      page,
      limit,
    } = input;

    const whereClause: Prisma.UserWhereInput = {
      type: "CUSTOMER",
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && { role }),
    };

    // Define a safe sort map
   const orderByClause: Prisma.UserOrderByWithRelationInput = (() => {
  if (sort === "name-asc") return { name: "asc" };
  if (sort === "name-desc") return { name: "desc" };
  if (sort === "email-asc") return { email: "asc" };
  if (sort === "email-desc") return { email: "desc" };
  if (sort === "createdAt-asc") return { createdAt: "asc" };
  if (sort === "createdAt-desc") return { createdAt: "desc" };

  return { createdAt: "desc" }; // fallback
})();

    const [customers, totalCount] = await Promise.all([
      ctx.db.user.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          type: true,
        },
      }),
      ctx.db.user.count({ where: whereClause }),
    ]);

    return {
      profiles: customers.map((cust) => ({
        id: cust.id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        type: cust.type,
        role: "CUSTOMER", // fallback in case role is null
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }),


  // src/server/api/routers/profile.ts

searchEmployees: protectedProcedure
  .input(
  z.object({
    search: z.string().optional(),
    role: z.string().optional(), // filter by role name
    dept: z.string().optional(), // filter by dept name
    sort: z.enum(["name-asc", "name-desc", "email-asc", "email-desc", "createdAt-asc","createdAt-desc"]).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
)

 .query(async ({ input, ctx }) => {
 const {
  search,
  role: rawRole,
  dept: rawDept,
  sort = "name-asc",
  page = 1,
  limit = 10,
} = input;

const role = rawRole === "ALL" ? undefined : rawRole;
const dept = rawDept === "ALL" ? undefined : rawDept;

  // Construct dynamic where clause
  const whereClause: Prisma.UserWhereInput = {
    type: "EMPLOYEE",
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(role || dept
      ? {
          employee: {
            role: {
              ...(role && {
                name: { equals: role, mode: "insensitive" },
              }),
              ...(dept && {
                dept: {
                  id: { equals: dept, mode: "insensitive" },
                },
              }),
            },
          },
        }
      : {}),
  };

  const orderByClause: Prisma.UserOrderByWithRelationInput = (() => {
  if (sort === "name-asc") return { name: "asc" };
  if (sort === "name-desc") return { name: "desc" };
  if (sort === "email-asc") return { email: "asc" };
  if (sort === "email-desc") return { email: "desc" };
  if (sort === "createdAt-asc") return { createdAt: "asc" };
  if (sort === "createdAt-desc") return { createdAt: "desc" };

  return { createdAt: "desc" }; // fallback
})();



  const [employees, totalCount] = await Promise.all([
    ctx.db.user.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
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
    }),
    ctx.db.user.count({ where: whereClause }),
  ]);

  return {
    profiles: employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      type: emp.type,
      role: emp.employee?.role
        ? {
            name: emp.employee.role.name,
            dept: emp.employee.role.dept,
          }
        : "CUSTOMER",
    })),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}),





});
