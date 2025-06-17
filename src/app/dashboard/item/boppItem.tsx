"use client";
import { useState, useEffect } from "react"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { motion } from "framer-motion"
import { api } from "@/trpc/react"
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Sheet, SheetContent,SheetDescription, SheetTrigger } from "@/app/_components/ui/sheet";
import {   SheetTitle } from "@/app/_components/ui/sheet"
import { Button } from "@/app/_components/ui/button"
import { AnyProfileCard } from "@/app/_components/anyProfileCard"
import { useSession } from "next-auth/react"
import { ComponentLoading } from "@/app/_components/component-loading2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/_components/ui/pagination"
import { toast } from "sonner"
const BOPPItem = () => {


const [searchTermCustomer, setSearchTermCustomer] = useState("");
const [customerPage, setCustomerPage] = useState(1);
const customerLimit = 10;

const { data: customerData, isLoading: isSearchingCustomers } =
  api.user.searchCustomers.useQuery({
    search: searchTermCustomer,
    page: customerPage,
    limit: customerLimit,
  });

const filteredCustomers = customerData?.profiles ?? [];
const totalCustomerPages = customerData?.totalPages ?? 1;

const handleCustomerSearch = (value: string) => {
  setSearchTermCustomer(value);
  setCustomerPage(1);
};
function highlightText(text: string, search: string) {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, "ig");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span
        key={index}
        className="bg-yellow-300 dark:bg-yellow-100 text-black rounded whitespace-pre"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}



 const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (<>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-auto rounded-lg shadow-xl border border-white/10 dark:border-white/10 bg-transparent bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <Card className="lg:pb-14 shadow-xl border border-white/10 dark:border-white/10 bg-transparent">
        <CardHeader className="flex flex-col items-center gap-3">
  <motion.div
    className="relative"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    
  </motion.div>

  <div className="text-center space-y-1">
    <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
      
    </CardTitle>
    <CardDescription className="text-lg"></CardDescription>
  </div>
</CardHeader>

<CardContent className="grid gap-6 px-8 pb-10 pt-4 text-base">
  {/* Select customer */}
<motion.div variants={itemVariants} className="w-full max-w-md">
  <Label className="text-lg font-semibold text-gray-800 dark:text-white">
    Select a Customer to which the item will be added:
  </Label>

  {/* Search Input */}
  <div className="relative mt-2">
    <Input
      type="search"
      placeholder="Search customers..."
      className="w-full rounded-md pl-10 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
      value={searchTermCustomer}
      onChange={(e) => handleCustomerSearch(e.target.value)}
    />
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
           stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z"/>
      </svg>
    </div>
  </div>

  {/* Dropdown Suggestion Box */}
  <div className="relative w-full">
    {isSearchingCustomers ? (
      <ComponentLoading message="Searching..." />
    ) : (
      searchTermCustomer.trim() !== "" && filteredCustomers.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-[350px] overflow-y-auto">
          {filteredCustomers.slice(0, 5).map((customer) => (
            <div
              key={customer.id}
              className="flex items-start justify-between px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-12 w-12 ring-2 ring-purple-500 ring-offset-2">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {customer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Info */}
              <div className="ml-4 flex-1 text-sm font-medium text-gray-800 dark:text-white space-y-0.5">
                <div>Name: {highlightText(customer.name, searchTermCustomer)}</div>
                <div>ID: {highlightText(customer.id, searchTermCustomer)}</div>
                <div>Phone: {highlightText(customer.phone, searchTermCustomer)}</div>
              </div>

              {/* 3-dot menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2 mt-1">
                    <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <Sheet>
                    <SheetTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Profile
                      </DropdownMenuItem>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="lg:mt-14 w-full sm:max-w-md lg:max-w-sm rounded-sm bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 shadow-xl overflow-y-auto"
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
          ))}
        </div>
      )
    )}
  </div>

  {/* Pagination */}
  {filteredCustomers.length > 5 && (
    <div className="mt-4">
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
    </div>
  )}
</motion.div>


 

  <hr className="mx-auto w-[80%] border-t border-gray-300 dark:border-gray-700" />

  

  {/* EMPLOYEE PERMISSIONS */}
  

  {/* NOTIFICATIONS */}
  <motion.div
    variants={itemVariants}
    className="space-y-4 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40"
  >

    
  </motion.div>
   <hr className="mx-auto w-[80%] border-t border-gray-300 dark:border-gray-700" />


  <motion.div variants={itemVariants}>

  </motion.div>
</CardContent>


      </Card>
    </motion.div>
  </>)
}

export default BOPPItem