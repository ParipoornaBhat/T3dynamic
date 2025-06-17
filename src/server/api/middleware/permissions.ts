import { middleware } from "@/server/api/trpc";
import { routePermissionMap } from "@/server/api/middleware/routePermissions";

export const permissionMiddleware = middleware(async ({ path, ctx, next }) => {
  const { session } = ctx;

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED: Not logged in." );
  }

  const requiredPermissions = routePermissionMap[path] ?? [];
  const userPermissions = session.user.permissions ?? [];

  const hasAny = requiredPermissions.some((perm) =>
    userPermissions.includes(perm)
  );

  if (!hasAny) {
    throw new Error(`FORBIDDEN: You need one of the following permission(s): ${requiredPermissions.join(", ")}`);
  }

  return next();
});
