"use client"
import BOPPItemDownloadWrapper from "./boppDoc"
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/_components/ui/pagination"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { PlusCircle, Search, Filter, SortAsc, Upload } from "lucide-react"
import { Sheet, SheetContent,SheetDescription, SheetTrigger } from "@/app/_components/ui/sheet";
import {   SheetTitle } from "@/app/_components/ui/sheet"
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import { api } from "@/trpc/react"

import { Label } from "@/app/_components/ui/label"
import { Input } from "@/app/_components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select"
import { Checkbox } from "@/app/_components/ui/checkbox"
import { Textarea } from "@/app/_components/ui/textarea"
import Image from "next/image"
import { Badge } from "@/app/_components/ui/badge"
import { ItemOrderingModal } from "@/app/_components/item-ordering-modal"
import { ComponentLoading } from "@/app/_components/component-loading"
import { motion } from "framer-motion"
import BOPPItem from "./boppItem"
import {type BOPPItemForm,type YN, type SelectedCustomer} from "@/types/bopp"
import { toast } from "sonner"
export default function ItemManagementPage() {
  const utils = api.useUtils();
 // 1. Declare your strict union types
type ItemType = "BOPP" | "PET" | "All";
type SortField = "name" | "customer" | "date";

// 2. Setup state with correct types
const [searchTerm, setSearchTerm] = useState("");
const [filterType, setFilterType] = useState<ItemType>("All");
const [filterFinish, setFilterFinish] = useState("All");
const [sortBy, setSortBy] = useState<SortField>("name");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
const [itemPage, setItemPage] = useState(1);
const itemLimit = 10;

// 3. Safely extract selected type for query input
const selectedType: "BOPP" | "PET" | undefined =
  filterType === "BOPP" || filterType === "PET" ? filterType : undefined;

// 4. API query with properly typed arguments
const { data: itemData, isLoading: isSearching } = api.boppItem.searchItems.useQuery({
  search: searchTerm,
  type: selectedType,
  sortBy,
  sortDirection,
  page: itemPage,
  limit: itemLimit,
});


const sortedItems = itemData?.items ?? [];
const totalItemPages = itemData?.totalPages ?? 1;
const handleSearch = (value: string) => {
  setSearchTerm(value);
  setItemPage(1);
};



const handleTypeChange = (val: string) => {
  if (["BOPP", "PET", "All"].includes(val)) {
    setFilterType(val as ItemType);
    setItemPage(1);
  }
};

const handleSortByChange = (val: string) => {
  if (["name", "customer", "date"].includes(val)) {
    setSortBy(val as SortField);
    setItemPage(1);
  }
};

const toggleSortDirection = () => {
  setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
};


  const [selectedItem, setSelectedItem] = useState<BOPPItemForm | null>(null)


 const deleteBoppItemMutation = api.boppItem.delete.useMutation({
  onSuccess: () => {
    toast.success("Item deleted successfully");
    // Optional: refetch your list or remove item from local state
        utils.boppItem.searchItems.invalidate();
  },
  onError: (err) => {
    toast.error(err.message || "Failed to delete item");
  },
});

const handleDelete = (itemId: string) => {
  if (confirm(`Are you sure you want to delete item ${itemId}?`)) {
    deleteBoppItemMutation.mutate({ itemId });
  }
};

const [downloadId, setDownloadId] = useState<string | null>(null)


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
          Item Management
        </motion.h1>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900 shadow-xl">
            <CardHeader>
              <CardTitle className="text-teal-700 dark:text-teal-300">Manage Product Items</CardTitle>
              <CardDescription>Add and manage BOPP and PET items with advanced search and filtering.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Search and Filter Controls */}
              <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search items by name, customer, or description..."
                      className="w-full rounded-lg bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-teal-900 pl-8 border-2 focus:border-primary transition-all duration-300"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <Dialog>
  <DialogTrigger asChild>
    <Button
      size="sm"
      onSelect={(e) => e.preventDefault()}
      className="h-10 gap-1 bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow transition-transform duration-200 hover:scale-[1.03] hover:shadow-md"
    >
      <PlusCircle className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add BOPP Item</span>
    </Button>
  </DialogTrigger>

  <DialogContent
    className="w-full h-full sm:max-w-[95vw] md:max-w-[80vw] max-h-[90vh] overflow-y-auto bg-gradient-to-b from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 p-4 sm:rounded-xl"
  >
    <DialogTitle className="sr-only">Add BOPP Item</DialogTitle>
    <DialogDescription id="sheet-description" className="sr-only">
      View and manage your profile details.
    </DialogDescription>
     
    <BOPPItem />
  </DialogContent>
</Dialog>
<div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-3">
                {/* Type Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterType} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-[120px] bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      <SelectItem value="BOPP">BOPP</SelectItem>
                      <SelectItem value="PET">PET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                

                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={handleSortByChange}>
                    <SelectTrigger className="w-[120px] bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Direction Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSortDirection}
                  className="hover:bg-gradient-to-r hover:from-teal-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                >
                  {sortDirection === "asc" ? "↑" : "↓"}
                </Button>
              </div>
                 
                </div>

                {/* Filter and Sort Controls */}
              

           

              </div>

              {isSearching ? (
                <ComponentLoading message="Searching items..." />
              ) : itemData?.items.length === 0 ? (
  <div className="w-full text-center text-sm text-muted-foreground py-10">
    No items found.
  </div>
) : (
<div className="flex flex-wrap gap-3">
  {itemData?.items.map((item, index) => (
    <motion.div
      key={item.id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
      className="w-full sm:w-[48%] xl:w-[24%] max-w-sm"
    >
      <Card className="relative overflow-hidden group cursor-pointer bg-gradient-to-br from-white to-teal-50 dark:from-gray-800 dark:to-teal-900 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative w-full h-[13rem] bg-muted flex items-center justify-center overflow-hidden">
          <Image
            src={item.imageUrl!}
            alt={item.name}
            width={300}
            height={400}
            className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
          />

          <Badge className="absolute bottom-2 left-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            {item.type}
          </Badge>

          {item.banner && (
            <div className="absolute bottom-2 right-2 flex flex-col items-end space-y-1">
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium leading-none">
                {item.banner}
              </Badge>
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium leading-none">
                {item.printing_CylinderDirection}
              </Badge>
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium leading-none">
                CylinderDirection: {item.printing_CylinderDirection}
              </Badge>
            </div>
          )}
        </div>

        {/* Header */}
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0 space-y-1">
  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate whitespace-nowrap">
    {item.name}
  </CardTitle>
  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
    <span className="font-semibold">Item ID:</span> {item.id}
  </p>
  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
    <span className="font-semibold">Item Name:</span> {item.name}
  </p>
  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
    <span className="font-semibold">Customer:</span> {item.customerName}
  </p>
</div>


            {/* 3-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                  className="p-0 ml-2"
                >
                  <MoreVertical className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <DropdownMenuItem asChild>
  <div className="w-full cursor-pointer" onClick={() => setDownloadId(item.id)}>
Download Pdf
  </div>
</DropdownMenuItem>

                <DropdownMenuItem
  onClick={() => handleDelete(item.id)}
  className="w-full cursor-pointer text-red-600 dark:text-red-400"
>
  Delete Item
</DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-4 pt-0">
{downloadId && <BOPPItemDownloadWrapper itemId={downloadId} />}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Created: {item.createdDate}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  ))}
  <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setItemPage((p) => Math.max(1, p - 1))}
        className={itemPage === 1 ? "opacity-50 pointer-events-none" : ""}
      />
    </PaginationItem>

    {Array.from({ length: totalItemPages }, (_, i) => (
      <PaginationItem key={i}>
        <PaginationLink
          isActive={i + 1 === itemPage}
          onClick={() => setItemPage(i + 1)}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        onClick={() => setItemPage((p) => Math.min(p + 1, totalItemPages))}
        className={itemPage === totalItemPages ? "opacity-50 pointer-events-none" : ""}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>

</div>


              )}

              {/*selectedItem && <ItemOrderingModal item={selectedItem} onClose={() => setSelectedItem(null)} />*/}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
