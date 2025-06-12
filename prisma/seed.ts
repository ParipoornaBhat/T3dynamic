import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();
const saltRounds = 10;

const generateId = (prefix: string, count: number) => {
  return `${prefix}-${String(count + 1).padStart(3, '0')}`;
};

const main = async () => {
  try {
    // --- Create Departments ---
    const admDept = await db.dept.upsert({
      where: { name: 'ADM' },
      update: {},
      create: { name: 'ADM', fullName: 'Administration' },
    });

    const devDept = await db.dept.upsert({
      where: { name: 'DEV' },
      update: {},
      create: { name: 'DEV', fullName: 'Development' },
    });

    const cstDept = await db.dept.upsert({
      where: { name: 'CUS' },
      update: {},
      create: { name: 'CUS', fullName: 'Customer Service' },
    });

    // --- Create Permissions ---
    const editRole = await db.permission.upsert({
      where: { name: 'MANAGE_ROLE' },
      update: {},
      create: { name: 'MANAGE_ROLE' },
    });

    const editPermission = await db.permission.upsert({
      where: { name: 'MANAGE_PERMISSION' },
      update: {},
      create: { name: 'MANAGE_PERMISSION' },
    });

    await db.permission.createMany({
      data: [
        { name: 'MANAGE_CUSTOMER' },
        { name: 'MANAGE_EMPLOYEE' },
      ],
      skipDuplicates: true,
    });

    // --- Create Roles ---
    const adminRole = await db.role.upsert({
      where: {
        name_deptId: {
          name: 'ADMIN',
          deptId: admDept.id,
        },
      },
      update: {},
      create: {
        name: 'ADMIN',
        deptId: admDept.id,
      },
    });

    const developerRole = await db.role.upsert({
      where: {
        name_deptId: {
          name: 'DEVELOPER',
          deptId: devDept.id,
        },
      },
      update: {},
      create: {
        name: 'DEVELOPER',
        deptId: devDept.id,
      },
    });

    const customerRole = await db.role.upsert({
      where: {
        name_deptId: {
          name: 'CUSTOMER',
          deptId: cstDept.id,
        },
      },
      update: {},
      create: {
        name: 'CUSTOMER',
        deptId: cstDept.id,
      },
    });

    // --- Assign RolePermissions ---
    await db.rolePermission.createMany({
      data: [
        { roleId: developerRole.id, permissionId: editRole.id },
        { roleId: developerRole.id, permissionId: editPermission.id },
        { roleId: adminRole.id, permissionId: editRole.id },
      ],
      skipDuplicates: true,
    });

    // --- Create Users ---
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '1000000000',
        password: await bcrypt.hash('456456', saltRounds),
        type: 'EMPLOYEE',
        role: adminRole,
      },
      {
        name: 'Developer User',
        email: 'paripoornabhat@gmail.com',
        phone: '1000000001',
        password: await bcrypt.hash('456456', saltRounds),
        type: 'EMPLOYEE',
        role: developerRole,
      },
      {
        name: 'Customer User',
        email: 'customer@example.com',
        phone: '1000000002',
        password: await bcrypt.hash('456456', saltRounds),
        type: 'CUSTOMER',
        role: customerRole,
      },
    ];

    for (const user of users) {
      const dept = await db.dept.findUnique({
        where: { id: user.role.deptId },
      });

      if (!dept) {
        throw new Error(`Department not found for role: ${user.role.name}`);
      }

      const newId = generateId(dept.name, dept.memberCount);

      // create user + update member count transaction
      const [updatedDept, createdUser] = await db.$transaction([
        db.dept.update({
          where: { id: dept.id },
          data: { memberCount: { increment: 1 } },
        }),
        db.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            id: newId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            type: user.type as any,
          },
        }),
      ]);

      if (user.type === 'EMPLOYEE') {
        await db.employee.upsert({
          where: { userId: createdUser.id },
          update: {},
          create: {
            userId: createdUser.id,
            roleId: user.role.id,
          },
        });
      }

      if (user.type === 'CUSTOMER') {
        await db.customer.upsert({
          where: { userId: createdUser.id },
          update: {},
          create: {
            userId: createdUser.id,
            companyBilling: ['Name1', 'Name2'],
            brands: ['Dynamic Packaging Pvt Ltd', 'Shree Packaging Co.'],
            addresses: [
              'Plot No. 23, Industrial Area, Mumbai, Maharashtra',
              'Unit 12, Sector 5, Bhiwandi, Thane, Maharashtra',
            ],
          },
        });
      }
    }

    console.log('✅ Seed data successfully created!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
};

main();
