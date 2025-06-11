import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/lib/zod";

// --- Type augmentation ---
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      permissions: string[]; // Array of permission names
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    permissions: string[];
  }
}


export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        if (!email || !password) return null;

        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email },
          include: {
            employee: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: { permission: true },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Extract role and permissions if employee
        const role = user.employee?.role?.name ?? "CUSTOMER";
        const permissions =
          user.employee?.role?.permissions.map((rp) => rp.permission.name) ?? [];

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (!token || !session.user) return session;

      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.permissions = token.permissions as string[];

      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    newUser: "/auth/welcome",
  },
};

