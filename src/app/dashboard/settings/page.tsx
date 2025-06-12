"use client"

import { useState,useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import { Label } from "@/app/_components/ui/label"
import { Input } from "@/app/_components/ui/input"
import { Button } from "@/app/_components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select"
import { Checkbox } from "@/app/_components/ui/checkbox"
import { Separator } from "@/app/_components/ui/separator"
import { Badge } from "@/app/_components/ui/badge"
import { Trash2, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { api } from "@/trpc/react";
import { ComponentLoading } from "@/app/_components/component-loading"
import { useSession } from "next-auth/react"

type Permission = {
  id: string;
  name: string;
};
type Role = {
  id: string;
  name: string;
  deptId: string;
  dept: { 
    id: string; 
    name: string; 
    fullName: string; 
  };
  permissions: {
    permission: {
      id: string;
      name: string;
    }
  }[];
};
type Dept = {
  id: string;
  name: string;
  fullName: string;
  memberCount: number;
  roles:{
    id: string;
    name: string;
  }[];
};

export default function SettingsPage() {
  const { data: session } = useSession()
  const perms = session?.user.permissions ?? []
  const has = (perm: string) => perms.includes(perm)

  const utils = api.useUtils();



  const { data: rolesRaw, isLoading: roleLoading } = api.role.getAll.useQuery();
  const { data: permissionsRaw, isLoading: permLoading } = api.perm.getAll.useQuery();
  const { data: departmentsRaw, isLoading: deptLoading } = api.dept.getAll.useQuery();
  
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

 
useEffect(() => {
  if (departmentsRaw) setDepartments(departmentsRaw);
}, [departmentsRaw]);
useEffect(() => {
  if (rolesRaw) setRoles(rolesRaw);
}, [rolesRaw]);

useEffect(() => {
  if (permissionsRaw) setPermissions(permissionsRaw);
}, [permissionsRaw]);

  
  // Explicit type assignments
const [newDeptName, setNewDeptName] = useState('');
const [newDeptFullName, setNewDeptFullName] = useState('');
const [newRoleName, setNewRoleName] = useState('');
const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
const [newPermissionName, setNewPermissionName] = useState('');
//create dept,role,perm mutations
const createDeptMutation = api.dept.create.useMutation({
  onSuccess: (newDept) => {
    toast.success(`Department : "${newDept.name} ""${newDept.fullName}" created.`);
    setNewDeptName("");
    setNewDeptFullName("");
    utils.dept.getAll.invalidate();
  },
  onError: (error) => {
    toast.error(error.message || "Failed to create department.");
  },
});
const createRoleMutation = api.role.create.useMutation({
  onSuccess: (newRole) => {
    toast.success(`Role: "${newRole.name}" with dept "${newRole.dept.name} ${newRole.dept.fullName}" created.`);
    setNewRoleName("");
    setSelectedDeptId("");
    utils.role.getAll.invalidate();
  },
  onError: (error) => {
    toast.error(error.message || "Failed to create Role.");
  },
});
const createPermMutation = api.perm.create.useMutation({
  onSuccess: (newPerm) => {
    toast.success(`Permission: "${newPerm.name}" created.`);
    setNewPermissionName("");
    utils.perm.getAll.invalidate();
  },
  onError: (error) => {
    toast.error(error.message || "Failed to create Permission.");
  },
});
//delete dept,role,perm mutations
const deleteDeptMutation = api.dept.delete.useMutation({
  onSuccess: (delDept) => {
    toast.success(`Department "${delDept.fullName}" deleted. with Roles: ${delDept.roles.map(r => r.name).join(", ")}`);
    utils.dept.getAll.invalidate();
  },
  onError: (error) => {
    toast.error(error.message || "Failed to delete department.");
  },
});
const deleteRoleMutation = api.role.delete.useMutation({
  onSuccess: (delRole) => {
    toast.success(`Role "${delRole.name}" of dept: "${delRole.dept.name} ${delRole.dept.fullName}" deleted.`);
    utils.role.getAll.invalidate();
  },
  onError: (error) => {
    toast.error(error.message || "Failed to delete Role.");
  },
});
const deletePermMutation = api.perm.delete.useMutation({
  onSuccess: (delPerm) => {
    toast.success(`Permission: "${delPerm.name}" deleted.`);
    utils.perm.getAll.invalidate();
  },
  onError: (error) => {
    toast.error(error.message || "Failed to delete Permission.");
  },
});
const toggleRolePermMutation = api.role.updatePermissions.useMutation({
  onSuccess: (data) => {
    const { action, role, perm } = data;
    const verb = action === "created" ? "added to" : "removed from";

    toast.success(`Permission "${perm.name}" ${verb} role "${role.name}".`);
    utils.role.getAll.invalidate(); // Or utils.perm.getAll.invalidate();
  },
  onError: (error) => {
    toast.error(error.message || "Failed to update permission.");
  },
});




 const addNewDepartment = () => {
  if (!newDeptName || !newDeptFullName) {
    toast.error("Please provide both department name and full name.");
    return;
  }
  createDeptMutation.mutate({ name: newDeptName.trim(), fullName: newDeptFullName.trim() });
};
const deleteDept = (deptId: string) => {
  if (!deptId) {
    toast.error("Please provide a valid department id for deletion.");
    return;
  }
  deleteDeptMutation.mutate({ id: deptId.trim() });
  };
  
  const addNewRole = () => {
   if (!newRoleName || !selectedDeptId) {
    toast.error("Please provide both department name and full name.");
    return;
  }
  createRoleMutation.mutate({ name: newRoleName.trim(), deptId: selectedDeptId.trim() });
};
  const deleteRole = (roleId: string) => {
  if (!roleId) {
    toast.error("Please provide a valid department id for deletion.");
    return;
  }
  deleteRoleMutation.mutate({ id: roleId.trim() });
  };

  
  const addNewPermission = () => {
     if (!newPermissionName) {
    toast.error("Please provide both department name and full name.");
    return;
  }
  createPermMutation.mutate({ name: newPermissionName.trim() });
};
  const deletePermission = (permissionId: string) => {
  if (!permissionId) {
    toast.error("Please provide a valid department id for deletion.");
    return;
  }
  deletePermMutation.mutate({ id: permissionId.trim() });
  };

  

  const togglePermission = (roleId: string, permId: string) => {
  if (!roleId || !permId) {
    toast.error("Invalid role or permission.");
    return;
  }

  toggleRolePermMutation.mutate({
    roleId,
    permissionId: permId,
  });
};


  

  
  

  if (deptLoading || roleLoading || permLoading) {
    return <ComponentLoading message="Loading data..." />;
  }



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-teal-50 via-purple-50 to-orange-50 dark:from-teal-900 dark:via-purple-900 dark:to-orange-900">
      <motion.div
        className="flex flex-col gap-2 p-2 md:p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Settings
        </motion.h1>

        <Tabs defaultValue="permissions" className="w-full">
          <TabsList className="grid w-auto grid-cols-4 bg-gradient-to-r from-teal-100 to-purple-100 dark:from-teal-800 dark:to-purple-800">
            <TabsTrigger
              value="permissions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Permissions
            </TabsTrigger>
            
            <TabsTrigger
              value="database"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Database
            </TabsTrigger>
           {

            //reports, traffic  etc.
           }
          </TabsList>

       <TabsContent value="permissions">
  <motion.div variants={itemVariants}>
    <Card className="bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900 shadow-xl">
      <CardHeader>
        <CardTitle className="text-teal-700 dark:text-teal-300">Role & Permission Management</CardTitle>
        <CardDescription>Define roles and assign specific permissions.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">

        {/* Create Department */}
        <div className="grid gap-4 p-4 border rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900">
          <h3 className="text-lg font-semibold">Create Department</h3>
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              placeholder="Dept ID (e.g., 'ADM')"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
            />
            <Input
              placeholder="Full Department Name"
              value={newDeptFullName}
              onChange={(e) => setNewDeptFullName(e.target.value)}
            />
            <Button onClick={addNewDepartment} className="bg-gradient-to-r from-cyan-500 to-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
        </div>

        {/* Add Role */}
        <div className="grid gap-4 p-4 border rounded-lg bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900">
          <h3 className="text-lg font-semibold">Add New Role</h3>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Input
              placeholder="New Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <Select onValueChange={setSelectedDeptId} value={selectedDeptId ?? undefined}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addNewRole} className="bg-gradient-to-r from-teal-500 to-purple-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
        </div>

        {/* Add Permission */}
        {has("MANAGE_PERMISSION") && (
          <div className="grid gap-4 p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900 dark:to-pink-900">
            <h3 className="text-lg font-semibold">Add New Permission</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                placeholder="Permission Name"
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
              />
              <Button onClick={addNewPermission} className="bg-gradient-to-r from-orange-500 to-pink-500">
                <Plus className="h-4 w-4 mr-2" />
                Add Permission
              </Button>
            </div>
          </div>
        )}

        <Separator />

        {/* Permissions Matrix */}
        <div className="relative">
          {/* Overlay when loading */}
          {[
            createDeptMutation,
            createRoleMutation,
            createPermMutation,
            deleteDeptMutation,
            deleteRoleMutation,
            deletePermMutation,
            toggleRolePermMutation,
          ].some((m) => m.isPending) && (
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-teal-50/30 to-purple-50/30 dark:from-teal-900/30 dark:to-purple-900/30 backdrop-blur-sm flex items-center justify-center">
              <div className="text-black dark:text-white animate-pulse text-sm">
                <ComponentLoading message="Updating permissions..." />
              </div>
            </div>
          )}

          {/* Actual content */}
          <div className={toggleRolePermMutation.isPending ? "pointer-events-none select-none opacity-50" : ""}>
            <div className="grid gap-6">
              <h3 className="text-lg font-semibold">Role Permissions Matrix</h3>
              {departments.map((dept) => (
                <div key={dept.id} className="border rounded-lg overflow-auto">
                  <div className="bg-gradient-to-r from-teal-200 to-purple-200 dark:from-teal-800 dark:to-purple-800 p-3 font-semibold flex justify-between items-center">
                    <span>{dept.fullName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDept(dept.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse overflow-auto">
                      <thead>
                        <tr>
                          <th className="border p-3 text-left font-semibold">Role</th>
                          {permissions
                            .filter((perm) => perm.name !== "MANAGE_PERMISSION")
                            .map((perm) => (
                              <th key={perm.id} className="border p-3 text-center font-semibold min-w-[120px]">
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-xs">{perm.name}</span>
                                  {has("MANAGE_PERMISSION") && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deletePermission(perm.id)}
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </th>
                            ))}
                          <th className="border p-3 text-center font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles
                          .filter((r) => r.deptId === dept.id)
                          .map((role, idx) => (
                            <tr
                              key={role.id}
                              className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
                            >
                              <td className="border p-3 font-medium">
                                <Badge className="bg-gradient-to-r from-teal-500 to-purple-500 text-white">
                                  {role.name}
                                </Badge>
                              </td>
                              {permissions
                                .filter((perm) => perm.name !== "MANAGE_PERMISSION")
                                .map((perm) => (
                                  <td key={perm.id} className="border p-3 text-center">
                                    <Checkbox
                                      checked={!!role.permissions.find((p) => p.permission.id === perm.id)}
                                      onCheckedChange={() => togglePermission(role.id, perm.id)}
                                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-purple-500"
                                    />
                                  </td>
                                ))}
                              <td className="border p-3 text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteRole(role.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
</TabsContent>

          

          

          <TabsContent value="database">
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-900 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-orange-700 dark:text-orange-300">Database Management</CardTitle>
                  <CardDescription>Manage database backups and integrity.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="backup-frequency">Daily Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="backup-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    Initiate Manual Backup Now
                  </Button>
                  <Separator />
                  <div className="grid gap-2">
                    <h3 className="font-medium">
                      Last Backup: <span className="text-primary">2025-01-22 10:30 AM</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">Next Scheduled Backup: 2025-01-23 03:00 AM</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

         
        </Tabs>
      </motion.div>
    </div>
  )
}
