"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Input } from "@/app/_components/ui/input"
import { Textarea } from "@/app/_components/ui/textarea"
import { Button } from "@/app/_components/ui/button"
import { Search, PlusCircle } from "lucide-react"
import { MoreVertical } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/_components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import { Label } from "@/app/_components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar"
import { ComponentLoading } from "@/app/_components/component-loading2"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { api } from "@/trpc/react"
import { useSession } from "next-auth/react"
import { AnyProfileCard } from "@/app/_components/anyProfileCard"
import {  X, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
 
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Sheet, SheetContent,SheetDescription, SheetTrigger } from "@/app/_components/ui/sheet";
import {   SheetTitle } from "@/app/_components/ui/sheet"

type CustomerSortOption =
  | "name-asc"
  | "name-desc"
  | "email-asc"
  | "email-desc"
  | "createdAt-asc"
  | "createdAt-desc"
  | undefined;
type EmployeeSortOption = "name-asc" | "name-desc" | "email-asc" | "email-desc" | "createdAt-asc"
  | "createdAt-desc" | undefined;

export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const perms = session?.user.permissions ?? []
  const has = (perm: string) => perms.includes(perm)


   const utils = api.useUtils();
 const [searchTermEmployee, setSearchTermEmployee] = useState("")
  const [filterEmployeeRole, setFilterEmployeeRole] = useState("")
  const [employeeSort, setEmployeeSort] = useState<EmployeeSortOption>("name-asc"); // or undefined if you want no default
  const [employeePage, setEmployeePage] = useState(1)
  const [filterEmployeeDept, setFilterEmployeeDept] = useState("");

  const employeeLimit = 10

  const { data: allRoles = [] } = api.role.getAllRoles.useQuery()
  const { data: allDepts = [] } = api.dept.getAllDept.useQuery()

  const { data: employeeData, isLoading: isSearchingEmployees } =
    api.user.searchEmployees.useQuery({
      search: searchTermEmployee,
      role: filterEmployeeRole === "ALL" ? undefined : filterEmployeeRole,
      dept: filterEmployeeDept === "ALL" ? undefined : filterEmployeeDept,
      sort: employeeSort,
      page: employeePage,
      limit: employeeLimit,
    })

  const filteredEmployees = employeeData?.profiles ?? []
  const totalEmployeePages = employeeData?.totalPages ?? 1

  const handleEmployeeSearch = (value: string) => {
    setSearchTermEmployee(value)
    setEmployeePage(1)
  }

const [searchTermCustomer, setSearchTermCustomer] = useState("");
const [filterCustomerRole,] = useState(""); // if needed later

const [customerSort, setCustomerSort] = useState<CustomerSortOption>("name-asc");
const [customerPage, setCustomerPage] = useState(1);
const customerLimit = 10;

const { data: customerData, isLoading: isSearchingCustomers } =
  api.user.searchCustomers.useQuery({
    search: searchTermCustomer,
    role: filterCustomerRole || undefined, // safe if your endpoint supports it
    sort: customerSort,
    page: customerPage,
    limit: customerLimit,
  });

const filteredCustomers = customerData?.profiles ?? [];
const totalCustomerPages = customerData?.totalPages ?? 1;
const filteredRoles = filterEmployeeDept
  ? allRoles.filter((role) => role.dept?.id === filterEmployeeDept)
  : allRoles;

const handleCustomerSearch = (value: string) => {
  setSearchTermCustomer(value);
  setCustomerPage(1);
};



//register employee
const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [deptId, setDeptId] = useState<string | undefined>(undefined);
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const filteredRoles2 = deptId
    ? allRoles.filter((role) => role.dept.id === deptId)
    : allRoles;
   useEffect(() => {
    if (roleId && !deptId) {
      const selectedRole = allRoles.find((role) => role.id === roleId);
      if (selectedRole?.dept?.id) setDeptId(selectedRole.dept.id);
    }
  }, [roleId,allRoles, deptId]);
   const signUpEmployeeMutation = api.user.registerEmployee.useMutation({
    onSuccess: (data) => {
      toast.success(`Employee "${data.name}" registered successfully!`);

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setDeptId(undefined);
      setRoleId(undefined);

      utils.user.invalidate(); // Invalidate cache if needed
    },
    onError: (err) => {
      toast.error(err.message || "Error registering employee.");
    },
  });
  const handleRegisterEmployee = () => {
    if (!name || !email || !phone || !password || !roleId || !deptId) {
      toast.error("All fields are required.");
      return;
    }

    signUpEmployeeMutation.mutate({
      name,
      email,
      phone,
      password,
      roleId,
      deptId,
    });
  };
/// register customer
 const [companyBilling, setCompanyBilling] = useState([""]);
  const [brands, setBrands] = useState([""]);
  const [addresses, setAddresses] = useState([""]);

  const signUpCustomerMutation = api.user.registerCustomer.useMutation({
    onSuccess: (data) => {
      toast.success(`Customer "${data.name}" registered successfully!`);

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setCompanyBilling([""]);
      setBrands([""]);
      setAddresses([""]);

      utils.user.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Error registering customer.");
    },
  });

  const handleRegisterCustomer = () => {
    if (!name || !email || !phone) {
      toast.error("Name, email, and phone are required.");
      return;
    }

    if (
      companyBilling.some((c) => !c) ||
      brands.some((b) => !b) ||
      addresses.some((a) => !a)
    ) {
      toast.error("All fields in lists must be filled.");
      return;
    }

    signUpCustomerMutation.mutate({
      name,
      email,
      phone,
      password: phone, // password same as phone
      companyBilling,
      brands,
      addresses,
    });
  };

const handleArrayChange = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleAddItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, ""]);
  };

  const handleRemoveItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const TitleWithAdd = ({
    title,
    onAdd,
  }: {
    title: string;
    onAdd: () => void;
  }) => (
    <div className="flex items-center justify-left">
      <Label className="text-sm font-semibold">{title}</Label>
      <Button
        variant="ghost"
        size="icon"
        onClick={onAdd}
        className="w-6 h-6 text-sky-600 dark:text-sky-300"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );


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
  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
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
          Admin Dashboard
        </motion.h1>

<Tabs
  defaultValue={has("MANAGE_EMPLOYEE") ? "employees" : has("MANAGE_CUSTOMER") ? "customers" : undefined}
  className="w-full"
>
            <TabsList className="grid w-auto grid-cols-2 bg-gradient-to-r from-teal-100 to-purple-100 dark:from-teal-800 dark:to-purple-800">
             {has("MANAGE_EMPLOYEE") && (
            <TabsTrigger
              value="employees"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              
              Employee 
            </TabsTrigger>
            )}
                    {has("MANAGE_CUSTOMER") && (
            <TabsTrigger
              value="customers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Customer 
            </TabsTrigger>
            )}
          </TabsList>
                    

           {has("MANAGE_EMPLOYEE") && (
    <TabsContent value="employees">
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900 shadow-xl">
          <CardHeader>
            <CardTitle className="text-teal-700 dark:text-teal-300">
              Employee Accounts
            </CardTitle>
            <CardDescription>Manage employee accounts and roles.</CardDescription>
          </CardHeader>

      <CardContent className="grid gap-4">
  <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-3">
    {/* 1️⃣ Search */}
    <div className="relative w-full md:w-[240px] lg:w-[280px]">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search employees..."
        className="pl-8 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 border-2 focus:border-primary w-full"
        value={searchTermEmployee}
        onChange={(e) => handleEmployeeSearch(e.target.value)}
      />
    </div>
<div className="flex flex-row gap-1 sm:gap-2 md:flex-row ">
    {/* 2️⃣ Role */}
    <Select
      value={filterEmployeeRole}
      onValueChange={(selectedRole) => {
        setFilterEmployeeRole(selectedRole);
        const selected = allRoles.find((r) => r.name === selectedRole);
        if (selected?.dept?.id && (filterEmployeeDept === "ALL" || !filterEmployeeDept)) {
          setFilterEmployeeDept(selected.dept.id);
        }
        setEmployeePage(1);
      }}
    >
      <SelectTrigger className="w-auto md:w-auto">
        <SelectValue placeholder="Filter by role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All</SelectItem>
        {(filterEmployeeDept === "ALL" || !filterEmployeeDept ? allRoles : filteredRoles)
          .filter((role) => role.name !== "CUSTOMER")
          .map((role) => (
            <SelectItem key={role.name} value={role.name}>
              {role.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>

    {/* 3️⃣ Department */}
    <Select
      value={filterEmployeeDept}
      onValueChange={(selectedDeptId) => {
        setFilterEmployeeDept(selectedDeptId);
        const valid = allRoles.find(
          (r) => r.name === filterEmployeeRole && r.dept?.id === selectedDeptId
        );
        if (!valid) setFilterEmployeeRole("ALL");
        setEmployeePage(1);
      }}
    >
      <SelectTrigger className="w-auto md:w-auto">
        <SelectValue placeholder="Filter by department" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All</SelectItem>
        {allDepts
          .filter((dept) => dept.name !== "CUS")
          .map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.fullName} ({dept.name})
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
</div>
<div className="flex flex-row gap-1 sm:gap-2 md:flex-row md:items-center">

    {/* 4️⃣ Sort */}
    <Select
      value={employeeSort}
      onValueChange={(v) => {
        setEmployeeSort(v as EmployeeSortOption);
        setEmployeePage(1);
      }}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name-asc">Name ↑</SelectItem>
        <SelectItem value="name-desc">Name ↓</SelectItem>
        <SelectItem value="email-asc">Email ↑</SelectItem>
        <SelectItem value="email-desc">Email ↓</SelectItem>
        <SelectItem value="createdAt-asc">New → Old</SelectItem>
        <SelectItem value="createdAt-desc">Old → New</SelectItem>
      </SelectContent>
    </Select>
              {/* Register Employee Button */}
              <Dialog>
      <DialogTrigger asChild>
         <Button
      size="sm"
      className="h-10 gap-1 bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow transition-transform duration-200 hover:scale-[1.03] hover:shadow-md"
    >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Register Employee
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900">
        <DialogHeader>
          <DialogTitle className="text-teal-700 dark:text-teal-300">
            Register New Employee
          </DialogTitle>
          <DialogDescription>
            Fill in the details to register a new employee.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee-name" className="text-right">
              Name
            </Label>
            <Input
              id="employee-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="col-span-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900"
            />
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee-email" className="text-right">
              Email
            </Label>
            <Input
              id="employee-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="col-span-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900"
            />
          </div>

          {/* Phone */}
          {/* Phone (also used as password) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee-phone" className="text-right">
              Phone 
            </Label>
            <Input
              id="employee-phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPassword(e.target.value); // ← Set password same as phone
              }}
              placeholder="XXXXX XXXXX"
              className="col-span-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900"
            />
          </div>

              <div>(Phone number also used as password)</div>
          {/* Department */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee-dept" className="text-right">
              Department
            </Label>
            <Select value={deptId} onValueChange={setDeptId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
  {allDepts
    .filter((dept) => dept.name !== "CUS")
    .map((dept) => (
      <SelectItem key={dept.id} value={dept.id}>
        {dept.fullName} ({dept.name})
      </SelectItem>
    ))}
</SelectContent>

            </Select>
          </div>

          {/* Role */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee-role" className="text-right">
              Role
            </Label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
             <SelectContent>
  {filteredRoles2
    .filter((role) => role.name !== "CUSTOMER")
    .map((role) => (
      <SelectItem key={role.id} value={role.id}>
        {role.name} ({role.dept.name})
      </SelectItem>
    ))}
</SelectContent>

            </Select>
          </div>
        </div>

        <Button
          onClick={handleRegisterEmployee}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          Register Employee
        </Button>
      </DialogContent>
    </Dialog>
    </div>
            </div>

            {/* Employee Cards */}
            {isSearchingEmployees ? (
              <>
              <ComponentLoading message="Searching employees..." />
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee, index) => (
                 <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                key={employee.id}
              >
                <Card className="cursor-pointer bg-gradient-to-br from-white to-teal-50 dark:from-gray-800 dark:to-teal-900 shadow-lg hover:shadow-xl transition-all duration-300 p-4">
                  <div className="flex items-center justify-between">
                    {/* Left: Avatar */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 ring-2 ring-teal-500 ring-offset-2">
                        <AvatarFallback className="bg-gradient-to-r from-teal-500 to-purple-500 text-white">
                          {employee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Right: Details */}
                      <div className="flex flex-col">
                          <CardTitle className="text-lg">{employee.name}</CardTitle>
                          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {employee.id}</p>
                        
                        <CardDescription>
                          {typeof employee.role === "string"
                            ? employee.role
                            : `${employee.role.name} - ${employee.role.dept.name}`}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                        <p className="text-sm text-muted-foreground">{employee.phone}</p>
                      </div>
                    </div>

                    {/* 3-Dot Dropdown with Sheet */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                        <Sheet>
                          <SheetTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Profile</DropdownMenuItem>
                          </SheetTrigger>
                          <SheetContent
                            side="right"
                            className="lg:mt-14 w-full sm:max-w-md lg:max-w-sm lg:max-h-sm sm:max-h-sm rounded-sm bg-gradient-to-b from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 shadow-xl lg:pr-1 lg:pl-1 lg:pb-1 lg:pt-1 lg:rounded-lg overflow-y-auto"
                          >
                            <SheetTitle className="sr-only">User Profile</SheetTitle>
                            <SheetDescription id="sheet-description" className="sr-only">
                              View and manage your profile details.
                            </SheetDescription>
                            <AnyProfileCard userId={employee.id} />
                          </SheetContent>
                        </Sheet>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              </motion.div>

                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setEmployeePage((p) => Math.max(1, p - 1))}
                    className={
                      employeePage === 1 ? "opacity-50 pointer-events-none" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalEmployeePages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === employeePage}
                      onClick={() => setEmployeePage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setEmployeePage((p) => Math.min(p + 1, totalEmployeePages))
                    }
                    className={
                      employeePage === totalEmployeePages
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </motion.div>
    </TabsContent>)}

                    {has("MANAGE_CUSTOMER") && (

          <TabsContent value="customers">
  <motion.div variants={itemVariants}>
    <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900 shadow-xl">
      <CardHeader>
        <CardTitle className="text-purple-700 dark:text-purple-300">Customer & Agent Accounts</CardTitle>
        <CardDescription>Manage customer and agent accounts.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px] md:flex-none md:w-[336px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="w-full rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 pl-8 md:w-[200px] lg:w-[336px] border-2 focus:border-primary transition-all duration-300"
              value={searchTermCustomer}
              onChange={(e) => handleCustomerSearch(e.target.value)}
            />
          </div>

          {/* Sort dropdown like employee sort */}
          <Select
            value={customerSort}
            onValueChange={(v) => {
              setCustomerSort(v as CustomerSortOption);
              setCustomerPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name ↑</SelectItem>
              <SelectItem value="name-desc">Name ↓</SelectItem>
              <SelectItem value="email-asc">Email ↑</SelectItem>
              <SelectItem value="email-desc">Email ↓</SelectItem>
              <SelectItem value="createdAt-asc">New → Old</SelectItem>
              <SelectItem value="createdAt-desc">Old → New</SelectItem>
            </SelectContent>
          </Select>
           <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
className="h-10 gap-1 bg-gradient-to-r from-purple-500 to-orange-600 text-white shadow transition-transform duration-200 hover:scale-[1.03] hover:shadow-md"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Register Customer
          </span>
        </Button>
      </DialogTrigger>

<DialogContent
  className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-sky-50 dark:from-gray-900 dark:to-sky-900"
>
        <DialogHeader>
          <DialogTitle className="text-sky-700 dark:text-sky-300">
            Register New Customer
          </DialogTitle>
          <DialogDescription>
            Provide the customer's details. You can edit them later from the dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer-name" className="text-right">
              Name
            </Label>
            <Input
              id="customer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alice Smith"
              className="col-span-3 bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900 dark:to-sky-900"
            />
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer-email" className="text-right">
              Email
            </Label>
            <Input
              id="customer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@example.com"
              className="col-span-3 bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900 dark:to-sky-900"
            />
          </div>

          {/* Phone */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer-phone" className="text-right">
              Phone
            </Label>
            <Input
              id="customer-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91XXXXXXXXXX"
              className="col-span-3 bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900 dark:to-sky-900"
            />
          </div>

          {/* Company Billing */}
       {/* Company Billing Names */}
<TitleWithAdd title="Company Billing Name(s)" onAdd={() => handleAddItem(setCompanyBilling)} />
{companyBilling.map((value, i) => (
  <div key={i} className="flex flex-wrap gap-2 items-start">
    <span className="mt-2 font-medium text-muted-foreground">{i + 1}.</span>
    <Textarea
      value={value}
      onChange={(e) => handleArrayChange(i, e.target.value, setCompanyBilling)}
      className="flex-1 min-w-[200px] bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900 dark:to-sky-900"
      placeholder="Enter company billing name"
      rows={2}
    />
    {companyBilling.length > 1 && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveItem(i, setCompanyBilling)}
        className="rounded-xlg border border-red-400 hover:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-red-600 dark:hover:border-gray-400 text-destructive"
      >
<X className="w-4 h-4 text-muted-foreground dark:text-white" />
      </Button>
    )}
  </div>
))}

{/* Brands */}
<TitleWithAdd title="Brands" onAdd={() => handleAddItem(setBrands)} />
{brands.map((value, i) => (
  <div key={i} className="flex flex-wrap gap-2 items-start">
    <span className="mt-2 font-medium text-muted-foreground">{i + 1}.</span>
    <Textarea
      value={value}
      onChange={(e) => handleArrayChange(i, e.target.value, setBrands)}
      className="flex-1 min-w-[200px] bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900 dark:to-sky-900"
      placeholder="Enter brand name"
      rows={2}
    />
    {brands.length > 1 && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveItem(i, setBrands)}
        className="rounded-xlg border border-red-400 hover:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-red-600 dark:hover:border-gray-400 text-destructive"
      >
<X className="w-4 h-4 text-muted-foreground dark:text-white" />
      </Button>
    )}
  </div>
))}

{/* Addresses */}
<TitleWithAdd title="Addresses" onAdd={() => handleAddItem(setAddresses)} />
{addresses.map((value, i) => (
  <div key={i} className="flex flex-wrap gap-2 items-start">
    <span className="mt-2 font-medium text-muted-foreground">{i + 1}.</span>
    <Textarea
      value={value}
      onChange={(e) => handleArrayChange(i, e.target.value, setAddresses)}
      className="flex-1 min-w-[200px] bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900 dark:to-sky-900"
      placeholder="Enter address"
      rows={2}
    />
    {addresses.length > 1 && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveItem(i, setAddresses)}
        className="rounded-xlg border border-red-400 hover:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-red-600 dark:hover:border-gray-400 text-destructive"
      >
<X className="w-4 h-4 text-muted-foreground dark:text-white" />
      </Button>
    )}
  </div>
))}

        </div>

        <Button
          onClick={handleRegisterCustomer}
          className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white"
        >
          Register Customer
        </Button>
      </DialogContent>
    </Dialog>
        </div>

        {isSearchingCustomers ? (
          <ComponentLoading message="Searching customers..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {filteredCustomers.map((customer, index) => (
    <motion.div
      key={customer.id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
    >
      <Card className="cursor-pointer bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900 shadow-lg hover:shadow-xl transition-all duration-300 p-4">
        <div className="flex items-center justify-between">
          {/* Left: Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-2 ring-purple-500 ring-offset-2">
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {customer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Right: Details */}
            <div className="flex flex-col">
              <CardTitle className="text-lg">{customer.name}</CardTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400">ID: {customer.id}</p>
              <CardDescription>{customer.role}</CardDescription>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
          </div>

          {/* 3-dot Dropdown with Sheet */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <Sheet>
                <SheetTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Profile</DropdownMenuItem>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="lg:mt-14 w-full sm:max-w-md lg:max-w-sm lg:max-h-sm sm:max-h-sm rounded-sm bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 shadow-xl lg:pr-1 lg:pl-1 lg:pb-1 lg:pt-1 lg:rounded-lg overflow-y-auto"
                >
                  <SheetTitle className="sr-only">Customer Profile</SheetTitle>
                  <SheetDescription id="sheet-description" className="sr-only">
                    View and manage customer details.
                  </SheetDescription>
                  <AnyProfileCard userId={customer.id} />
                </SheetContent>
              </Sheet>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  ))}
</div>

        )}

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCustomerPage((p) => Math.max(1, p - 1))}
                className={customerPage === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalCustomerPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={i + 1 === customerPage}
                  onClick={() => setCustomerPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCustomerPage((p) => Math.min(p + 1, totalCustomerPages))}
                className={customerPage === totalCustomerPages ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  </motion.div>
</TabsContent>
                    )}
        </Tabs>
      </motion.div>
    </div>
  )
}
