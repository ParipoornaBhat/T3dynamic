"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { ProfileCard } from "@/app/_components/profile-card"
import { Input } from "@/app/_components/ui/input"
import { Button } from "@/app/_components/ui/button"
import { Search, PlusCircle } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { ComponentLoading } from "@/app/_components/component-loading"
import { motion } from "framer-motion"
import { toast } from "sonner"
type User = {
  id: string
  name: string
  email: string
  role: string
  type: "Employee" | "Customer" | "Agent"
  avatar?: string
}

export default function AdminDashboardPage() {
  const [searchTermEmployee, setSearchTermEmployee] = useState("")
  const [searchTermCustomer, setSearchTermCustomer] = useState("")
  const [isSearchingEmployees, setIsSearchingEmployees] = useState(false)
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false)

  const users: User[] = [
    {
      id: "user-1",
      name: "Alice Smith",
      email: "alice@example.com",
      role: "Admin",
      type: "Employee",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "user-2",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Order Management",
      type: "Employee",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "user-3",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Printing Team",
      type: "Employee",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "user-4",
      name: "David Lee",
      email: "david@example.com",
      role: "Agent",
      type: "Agent",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "user-5",
      name: "Eve Davis",
      email: "eve@example.com",
      role: "Customer",
      type: "Customer",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "user-6",
      name: "Frank White",
      email: "frank@example.com",
      role: "Order Management",
      type: "Employee",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "user-7",
      name: "Grace Taylor",
      email: "grace@example.com",
      role: "Agent",
      type: "Agent",
      avatar: "/placeholder-user.jpg",
    },
  ]

  const handleEmployeeSearch = (value: string) => {
    setSearchTermEmployee(value)
    setIsSearchingEmployees(true)
    setTimeout(() => setIsSearchingEmployees(false), 500)
  }

  const handleCustomerSearch = (value: string) => {
    setSearchTermCustomer(value)
    setIsSearchingCustomers(true)
    setTimeout(() => setIsSearchingCustomers(false), 500)
  }

  const filteredEmployees = users.filter(
    (user) =>
      user.type === "Employee" &&
      (user.name.toLowerCase().includes(searchTermEmployee.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTermEmployee.toLowerCase())),
  )

  const filteredCustomers = users.filter(
    (user) =>
      (user.type === "Customer" || user.type === "Agent") &&
      (user.name.toLowerCase().includes(searchTermCustomer.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTermCustomer.toLowerCase())),
  )

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
        className="flex flex-col gap-6 p-4 md:p-6"
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

        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-teal-100 to-purple-100 dark:from-teal-800 dark:to-purple-800">
            <TabsTrigger
              value="employees"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Employee Management
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Customer Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-teal-700 dark:text-teal-300">Employee Accounts</CardTitle>
                  <CardDescription>Manage employee accounts and roles.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search employees..."
                        className="w-full rounded-lg bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 pl-8 md:w-[200px] lg:w-[336px] border-2 focus:border-primary transition-all duration-300"
                        value={searchTermEmployee}
                        onChange={(e) => handleEmployeeSearch(e.target.value)}
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="h-8 gap-1 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Register Employee</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900">
                        <DialogHeader>
                          <DialogTitle className="text-teal-700 dark:text-teal-300">Register New Employee</DialogTitle>
                          <DialogDescription>Fill in the details to register a new employee.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employee-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="employee-name"
                              placeholder="John Doe"
                              className="col-span-3 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employee-email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="employee-email"
                              type="email"
                              placeholder="john@example.com"
                              className="col-span-3 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employee-role" className="text-right">
                              Role
                            </Label>
                            <Select>
                              <SelectTrigger id="employee-role" className="col-span-3">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="order-management">Order Management Team</SelectItem>
                                <SelectItem value="printing-team">Printing Team</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employee-password" className="text-right">
                              Password
                            </Label>
                            <Input
                              id="employee-password"
                              type="password"
                              className="col-span-3 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900 dark:to-pink-900"
                            />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white"
                        >
                          Register Employee
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {isSearchingEmployees ? (
                    <ComponentLoading message="Searching employees..." />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredEmployees.map((employee, index) => (
                        <Dialog key={employee.id}>
                          <DialogTrigger asChild>
                            <motion.div
                              variants={cardVariants}
                              initial="hidden"
                              animate="visible"
                              whileHover="hover"
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className="cursor-pointer bg-gradient-to-br from-white to-teal-50 dark:from-gray-800 dark:to-teal-900 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center p-4">
                                <Avatar className="h-16 w-16 mb-2 ring-2 ring-teal-500 ring-offset-2">
                                  <AvatarImage src={employee.avatar || "/placeholder-user.jpg"} alt={employee.name} />
                                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-purple-500 text-white">
                                    {employee.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg">{employee.name}</CardTitle>
                                <CardDescription>{employee.role}</CardDescription>
                                <p className="text-sm text-muted-foreground">{employee.email}</p>
                              </Card>
                            </motion.div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900">
                            <DialogHeader>
                              <DialogTitle className="text-teal-700 dark:text-teal-300">
                                Edit Employee Profile
                              </DialogTitle>
                              <DialogDescription>Make changes to the employee's profile here.</DialogDescription>
                            </DialogHeader>
                            <ProfileCard />
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  )}

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="customers">
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-purple-700 dark:text-purple-300">Customer & Agent Accounts</CardTitle>
                  <CardDescription>Manage customer and agent accounts.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search customers..."
                        className="w-full rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 pl-8 md:w-[200px] lg:w-[336px] border-2 focus:border-primary transition-all duration-300"
                        value={searchTermCustomer}
                        onChange={(e) => handleCustomerSearch(e.target.value)}
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="h-8 gap-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Register Customer</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900">
                        <DialogHeader>
                          <DialogTitle className="text-purple-700 dark:text-purple-300">
                            Register New Customer
                          </DialogTitle>
                          <DialogDescription>
                            Fill in the details to register a new customer or agent.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customer-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="customer-name"
                              placeholder="Jane Doe"
                              className="col-span-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customer-email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="customer-email"
                              type="email"
                              placeholder="jane@example.com"
                              className="col-span-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customer-type" className="text-right">
                              Type
                            </Label>
                            <Select>
                              <SelectTrigger id="customer-type" className="col-span-3">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="agent">Agent</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customer-company" className="text-right">
                              Company (Optional)
                            </Label>
                            <Input
                              id="customer-company"
                              placeholder="Acme Corp"
                              className="col-span-3 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900 dark:to-pink-900"
                            />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
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
                        <Dialog key={customer.id}>
                          <DialogTrigger asChild>
                            <motion.div
                              variants={cardVariants}
                              initial="hidden"
                              animate="visible"
                              whileHover="hover"
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className="cursor-pointer bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center p-4">
                                <Avatar className="h-16 w-16 mb-2 ring-2 ring-purple-500 ring-offset-2">
                                  <AvatarImage src={customer.avatar || "/placeholder-user.jpg"} alt={customer.name} />
                                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    {customer.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg">{customer.name}</CardTitle>
                                <CardDescription>{customer.role}</CardDescription>
                                <p className="text-sm text-muted-foreground">{customer.email}</p>
                              </Card>
                            </motion.div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900">
                            <DialogHeader>
                              <DialogTitle className="text-purple-700 dark:text-purple-300">
                                Edit Customer Profile
                              </DialogTitle>
                              <DialogDescription>Make changes to the customer's profile here.</DialogDescription>
                            </DialogHeader>
                            <ProfileCard />
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  )}

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
