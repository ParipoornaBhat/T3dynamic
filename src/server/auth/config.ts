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
            role: {
              include: {
                permissions: { // Correct relation to permissions via RolePermission
                  include: {
                    permission: true, // Fetch associated permissions
                  },
                },
              },
            },
          },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        const permissions = user.role?.permissions.map((rp) => rp.permission.name) ?? [];

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role?.name ?? "CUSTOMER",
          permissions, // Include permissions in the return object
        };
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      // Initial login
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      token.id = dbUser?.id;
      token.role = dbUser?.role?.name ?? "CUSTOMER";
      token.permissions = dbUser?.role?.permissions.map(rp => rp.permission.name) ?? [];
    }
    return token;
  },

  async session({ session, token }) {
    if (token && session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.permissions = token.permissions as string[];
    }
    return session;
  },
}
,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    newUser: "/auth/welcome", // Display this page if it's the first time the user logs in
  },
};
