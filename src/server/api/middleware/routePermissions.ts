const permissionRouteMap: Record<string, string[]> = {
  MANAGE_ROLE: [
    "role.getAll",
    "dept.getAll",
    "perm.getAll",
    "role.create",
    "role.delete",
    "role.updatePermissions",
    "dept.create",
    "dept.delete",
  ],
  MANAGE_PERMISSION: [
    "role.getAll",
    "dept.getAll",
    "perm.getAll",
    "perm.create",
    "perm.delete",
  ],
  MANAGE_CUSTOMER: [
    "user.viewAnyProfile","user.editAnyProfile","user.registerCustomer","user.searchCustomers","role.getAllRoles","dept.getAllDept",
    ],
  MANAGE_EMPLOYEE: [
    "user.viewAnyProfile","user.editAnyProfile","user.registerEmployee","user.searchEmployees","role.getAllRoles","dept.getAllDept",
  ],
};

export const routePermissionMap: Record<string, string[]> = {};

for (const [permission, routes] of Object.entries(permissionRouteMap)) {
  for (const route of routes) {
    if (!routePermissionMap[route]) {
      routePermissionMap[route] = [];
    }
    routePermissionMap[route]!.push(permission);
  }
}
