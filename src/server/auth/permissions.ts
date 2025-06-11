// @/server/auth/permissions.ts


import { middleware } from "@/server/api/trpc";

export function hasPermission(required: string | string[]) {
  return middleware(async ({ ctx, next }) => {
    const { session } = ctx;

    if (!session || !session.user) {
      throw new Error("UNAUTHORIZED: Not logged in." );
    }

    const userPermissions = session.user.permissions ?? [];

    const requiredPermissions = Array.isArray(required)
      ? required
      : [required];

    const hasAll = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAll) {
      throw new Error( `FORBIDDEN: Missing permission(s): ${requiredPermissions.join(", ")}`,);
    }

    return next();
  });
}
