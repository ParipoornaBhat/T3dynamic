import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();
const saltRounds = 10;

const main = async () => {
  try {
    // Create Departments
    const admDept = await db.dept.upsert({
      where: { name: 'ADM' },
      update: {},
      create: {
        name: 'ADM',
        fullName: 'Administration',
      },
    });

    const devDept = await db.dept.upsert({
      where: { name: 'DEV' },
      update: {},
      create: {
        name: 'DEV',
        fullName: 'Development',
      },
    });

    const cstDept = await db.dept.upsert({
      where: { name: 'CST' },
      update: {},
      create: {
        name: 'CST',
        fullName: 'Customer Service',
      },
    });

    // Create Permissions
    const editRole = await db.permission.upsert({
      where: { name: 'EDIT_ROLE' },
      update: {},
      create: { name: 'EDIT_ROLE' },
    });

    const editPermission = await db.permission.upsert({
      where: { name: 'EDIT_PERMISSION' },
      update: {},
      create: { name: 'EDIT_PERMISSION' },
    });

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

    // Assign RolePermissions
    await db.rolePermission.createMany({
      data: [
        {
          roleId: developerRole.id,
          permissionId: editRole.id,
        },
        {
          roleId: developerRole.id,
          permissionId: editPermission.id,
        },
        {
          roleId: adminRole.id,
          permissionId: editRole.id,
        },
      ],
      skipDuplicates: true,
    });

    // Create Users
    const users = [
      {
        email: 'admin@example.com',
        fname: 'Admin',
        lname: 'User',
        phone: '1000000000',
        password: await bcrypt.hash('456456', saltRounds),
        roleId: adminRole.id,
      },
      {
        email: 'dev@example.com',
        fname: 'Developer',
        lname: 'User',
        phone: '1000000001',
        password: await bcrypt.hash('456456', saltRounds),
        roleId: developerRole.id,
      },
      {
        email: 'customer@example.com',
        fname: 'Customer',
        lname: 'User',
        phone: '1000000002',
        password: await bcrypt.hash('456456', saltRounds),
        roleId: customerRole.id,
      },
    ];

    for (const user of users) {
      await db.user.upsert({
        where: { email: user.email },
        update: {},
        create: user,
      });
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
