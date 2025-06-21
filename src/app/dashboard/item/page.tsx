"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { PlusCircle, Search, Filter, SortAsc, Upload } from "lucide-react"
import { Sheet, SheetContent,SheetDescription, SheetTrigger } from "@/app/_components/ui/sheet";
import {   SheetTitle } from "@/app/_components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
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
type Item = {
  id: string
  name: string
  type: "BOPP" | "PET"
  finish: "Matte" | "Glossy" | "Plain"
  imageUrl: string
  customerName: string
  description: string
  createdDate: string
  jobDetails: {
    printing?: {
      sizeMic: string
      materialType: string
      cylinder: string
      cylinderLocation: string
      numColors: number
      cylinderDirection: string
      qtyPackSize: number
      output: number
      remarks?: string
    }
    inspection1?: {
      required: boolean
      rollDirection?: string
      remarks?: string
    }
    lamination?: {
      sizeMat: string
      type: string
      quantity: number
      remarks?: string
    }
    inspection2?: {
      required: boolean
      rollDirection?: string
      remarks?: string
    }
    slitting?: {
      required: boolean
      remarks?: string
    }
    fabricLamination?: {
      size: string
      materialType: string
      side: "Single" | "Double"
      trimming: boolean
    }
    cuttingSlitting?: {
      type: "Regular" | "Gusset"
      stitching: boolean
      perforation: boolean
      threadColor: string
      handleType: string
      handleColors: string
      packing: string
    }
  }
}

const initialItems: Item[] = [
  {
    id: "ITEM001",
    name: "BOPP Packaging Film",
    type: "BOPP",
    finish: "Matte",
    imageUrl: "/placeholder.svg?height=200&width=200",
    customerName: "Acme Corp",
    description: "High-quality matte finish BOPP film for food packaging.",
    createdDate: "2024-01-15",
    jobDetails: {
      printing: {
        sizeMic: "100x20",
        materialType: "Matte",
        cylinder: "New",
        cylinderLocation: "Station A",
        numColors: 4,
        cylinderDirection: "Straight",
        qtyPackSize: 100550,
        output: 100000,
        remarks: "High quality print required",
      },
      inspection1: {
        required: true,
        rollDirection: "Forward",
        remarks: "Check for color consistency",
      },
      lamination: {
        sizeMat: "100x20",
        type: "Adhesive",
        quantity: 1000,
        remarks: "Standard lamination",
      },
    },
  },
  {
    id: "ITEM002",
    name: "PET Laminated Pouch",
    type: "PET",
    finish: "Glossy",
    imageUrl: "/placeholder.svg?height=200&width=200",
    customerName: "Beta Ltd",
    description: "Glossy PET laminated pouches for liquid products.",
    createdDate: "2024-01-20",
    jobDetails: {
      printing: {
        sizeMic: "200x30",
        materialType: "Glossy",
        cylinder: "Old",
        cylinderLocation: "Station B",
        numColors: 6,
        cylinderDirection: "Reverse",
        qtyPackSize: 500,
        output: 50000,
      },
      slitting: {
        required: true,
        remarks: "Precision cutting required",
      },
    },
  },
  {
    id: "ITEM003",
    name: "BOPP Plain Roll",
    type: "BOPP",
    finish: "Plain",
    imageUrl: "/placeholder.svg?height=200&width=200",
    customerName: "Gamma Inc",
    description: "Standard plain BOPP roll for general industrial use.",
    createdDate: "2024-01-10",
    jobDetails: {
      printing: {
        sizeMic: "50x10",
        materialType: "Plain",
        cylinder: "New",
        cylinderLocation: "Station C",
        numColors: 2,
        cylinderDirection: "Straight",
        qtyPackSize: 2000,
        output: 200000,
      },
    },
  },
]

export default function ItemManagementPage() {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"All" | "BOPP" | "PET">("All")
  const [filterFinish, setFilterFinish] = useState<"All" | "Matte" | "Glossy" | "Plain">("All")
  const [sortBy, setSortBy] = useState<"name" | "customer" | "date">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setIsSearching(true)
    setTimeout(() => setIsSearching(false), 500)
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "All" || item.type === filterType
    const matchesFinish = filterFinish === "All" || item.finish === filterFinish

    return matchesSearch && matchesType && matchesFinish
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "customer":
        comparison = a.customerName.localeCompare(b.customerName)
        break
      case "date":
        comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

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
                 
                </div>

                {/* Filter and Sort Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
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
                  <div className="flex items-center gap-2">
                    <Select value={filterFinish} onValueChange={(value: any) => setFilterFinish(value)}>
                      <SelectTrigger className="w-[120px] bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900 dark:to-pink-900">
                        <SelectValue placeholder="Finish" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Finishes</SelectItem>
                        <SelectItem value="Matte">Matte</SelectItem>
                        <SelectItem value="Glossy">Glossy</SelectItem>
                        <SelectItem value="Plain">Plain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4 text-muted-foreground" />
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    className="hover:bg-gradient-to-r hover:from-teal-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                  >
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>

              {isSearching ? (
                <ComponentLoading message="Searching items..." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="relative overflow-hidden group cursor-pointer bg-gradient-to-br from-white to-teal-50 dark:from-gray-800 dark:to-teal-900 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="relative w-full h-48 bg-muted flex items-center justify-center overflow-hidden">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                            {item.type}
                          </Badge>
                          {item.finish !== "Plain" && (
                            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                              {item.finish} Finish
                            </Badge>
                          )}
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg font-semibold truncate">{item.name}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            Customer: {item.customerName}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">Created: {item.createdDate}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {selectedItem && <ItemOrderingModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
