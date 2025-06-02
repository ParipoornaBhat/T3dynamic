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

    // Create Roles with deptName and RolePermissions
    const adminRole = await db.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: {
        name: 'ADMIN',
        deptName: 'ADM',
        permissions: {
          create: [
            { permissionName: 'EDIT_ROLE' },
            { permissionName: 'EDIT_PERMISSION' },
          ],
        },
      },
    });

    const developerRole = await db.role.upsert({
      where: { name: 'DEVELOPER' },
      update: {},
      create: {
        name: 'DEVELOPER',
        deptName: 'DEV',
        permissions: {
          create: [{ permissionName: 'EDIT_ROLE' }],
        },
      },
    });

    const customerRole = await db.role.upsert({
      where: { name: 'CUSTOMER' },
      update: {},
      create: {
        name: 'CUSTOMER',
        deptName: 'CST',
        permissions: { create: [] },
      },
    });

    // Create Users
    const adminUser = await db.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: await bcrypt.hash('456456', saltRounds),
        roleName: 'ADMIN',
      },
    });

    const developerUser = await db.user.upsert({
      where: { email: 'dev@example.com' },
      update: {},
      create: {
        email: 'dev@example.com',
        name: 'Developer User',
        password: await bcrypt.hash('456456', saltRounds),
        roleName: 'DEVELOPER',
      },
    });

    const customerUser = await db.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        email: 'customer@example.com',
        name: 'Customer User',
        password: await bcrypt.hash('456456', saltRounds),
        roleName: 'CUSTOMER',
      },
    });

    console.log('✅ Seed data successfully created!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
};

main();
// This script seeds the database with initial data for departments, permissions, roles, and users.