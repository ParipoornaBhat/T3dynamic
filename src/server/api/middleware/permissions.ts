import { TRPCError } from "@trpc/server";
import { middleware } from "@/server/api/trpc";
import { routePermissionMap } from "@/server/api/middleware/routePermissions";

export const permissionMiddleware = middleware(async ({ path, ctx, next }) => {
  const { session } = ctx;

  if (!session || !session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in." });
  }

  const requiredPermissions = routePermissionMap[path] ?? [];
  const userPermissions = session.user.permissions ?? [];

  const hasAny = requiredPermissions.some((perm) =>
    userPermissions.includes(perm)
  );

  if (!hasAny) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You need one of the following permission(s): ${requiredPermissions.join(", ")}`,
    });
  }

  return next();
});
