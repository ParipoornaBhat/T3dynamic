"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { PlusCircle, Search, Filter, SortAsc, Upload } from "lucide-react"
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
                        className="gap-1 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New Item</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900">
                      <DialogHeader>
                        <DialogTitle className="text-teal-700 dark:text-teal-300">Add New Item</DialogTitle>
                        <DialogDescription>
                          Select a user or copy an existing item to create a new one.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="user-search" className="text-right">
                            To Which User
                          </Label>
                          <Input
                            id="user-search"
                            placeholder="Search customer by ID or Name..."
                            className="col-span-3 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="copy-item" className="text-right">
                            Copy From Item
                          </Label>
                          <Input
                            id="copy-item"
                            placeholder="Enter existing Item ID to copy"
                            className="col-span-3 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900 dark:to-pink-900"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground col-span-4 text-center">OR</p>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="item-type" className="text-right">
                            Item Type
                          </Label>
                          <Select>
                            <SelectTrigger id="item-type" className="col-span-3">
                              <SelectValue placeholder="Select item type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bopp">BOPP</SelectItem>
                              <SelectItem value="pet">PET</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Dynamic Form based on Item Type (BOPP/PET) */}
                        <div className="col-span-4 grid gap-4 border p-4 rounded-md bg-gradient-to-br from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900">
                          <h3 className="text-lg font-semibold">Item Details (BOPP Example)</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="item-id">Item ID</Label>
                              <Input id="item-id" defaultValue="AUTO-GENERATED" disabled />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="customer-name">Customer Name</Label>
                              <Input id="customer-name" placeholder="Customer Name" />
                            </div>
                            <div className="grid gap-2 col-span-2">
                              <Label htmlFor="item-image">Item Image</Label>
                              <div className="flex items-center gap-2">
                                <Input id="item-image" type="file" className="flex-1" />
                                <Button variant="outline" size="icon">
                                  <Upload className="h-4 w-4" />
                                  <span className="sr-only">Upload Image</span>
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label>Job Checkboxes</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="job-printing" />
                                <Label htmlFor="job-printing">Printing</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="job-inspection1" />
                                <Label htmlFor="job-inspection1">Inspection 1</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="job-lamination" />
                                <Label htmlFor="job-lamination">Lamination</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="job-inspection2" />
                                <Label htmlFor="job-inspection2">Inspection 2</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="job-slitting" />
                                <Label htmlFor="job-slitting">Slitting</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="job-fabric-lamination" />
                                <Label htmlFor="job-fabric-lamination">Fabric Lamination</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="job-cutting-slitting" />
                                <Label htmlFor="job-cutting-slitting">Cutting and Slitting</Label>
                              </div>
                            </div>
                          </div>

                          {/* Printing Job Details */}
                          <div className="grid gap-2 border p-3 rounded-md bg-gradient-to-r from-teal-100 to-purple-100 dark:from-teal-800 dark:to-purple-800">
                            <h4 className="font-medium">Printing Job</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="print-size-mic">Size x Mic</Label>
                                <Input id="print-size-mic" placeholder="e.g., 100x20" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="print-material-type">Material Type</Label>
                                <Select>
                                  <SelectTrigger id="print-material-type">
                                    <SelectValue placeholder="Select material" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="matte">Matte</SelectItem>
                                    <SelectItem value="plain">Plain</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="print-cylinder">Cylinder</Label>
                                <Select>
                                  <SelectTrigger id="print-cylinder">
                                    <SelectValue placeholder="Select cylinder type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="old">Old</SelectItem>
                                    <SelectItem value="new">New</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="print-cylinder-location">Cylinder Location</Label>
                                <Input id="print-cylinder-location" placeholder="Location" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="print-num-colors">Number of Colors</Label>
                                <Input id="print-num-colors" type="number" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="print-cylinder-direction">Cylinder Direction</Label>
                                <Select>
                                  <SelectTrigger id="print-cylinder-direction">
                                    <SelectValue placeholder="Select direction" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="straight">Straight</SelectItem>
                                    <SelectItem value="reverse">Reverse</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="print-qty-pack-size">Quantity Pack Size (Q.Pack size)</Label>
                                <Input id="print-qty-pack-size" type="number" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="print-output">Output (Q.Pack size * 100)</Label>
                                <Input id="print-output" disabled value="Calculated Automatically" />
                              </div>
                              <div className="grid gap-2 col-span-2">
                                <Label htmlFor="print-remarks">Remarks (Optional)</Label>
                                <Textarea id="print-remarks" placeholder="Any additional remarks for printing" />
                              </div>
                            </div>
                          </div>

                          {/* Inspection 1 Job Details */}
                          <div className="grid gap-2 border p-3 rounded-md bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-800 dark:to-pink-800">
                            <h4 className="font-medium">Inspection 1</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="inspection1-yes-no" />
                                <Label htmlFor="inspection1-yes-no">Yes/No</Label>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="inspection1-roll-direction">Roll Direction (Optional)</Label>
                                <Input id="inspection1-roll-direction" placeholder="Roll direction" />
                              </div>
                              <div className="grid gap-2 col-span-2">
                                <Label htmlFor="inspection1-remarks">Remarks (Optional)</Label>
                                <Textarea
                                  id="inspection1-remarks"
                                  placeholder="Any additional remarks for inspection 1"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Lamination Job Details */}
                          <div className="grid gap-2 border p-3 rounded-md bg-gradient-to-r from-purple-100 to-teal-100 dark:from-purple-800 dark:to-teal-800">
                            <h4 className="font-medium">Lamination</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="lamination-size-mat">Size x Material</Label>
                                <Input id="lamination-size-mat" placeholder="e.g., 100x20" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="lamination-type">Type</Label>
                                <Input id="lamination-type" placeholder="Lamination type" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="lamination-quantity">Quantity</Label>
                                <Input id="lamination-quantity" type="number" />
                              </div>
                              <div className="grid gap-2 col-span-2">
                                <Label htmlFor="lamination-remarks">Remarks (Optional)</Label>
                                <Textarea id="lamination-remarks" placeholder="Any additional remarks for lamination" />
                              </div>
                            </div>
                          </div>

                          {/* Inspection 2 Job Details (BOPP only) */}
                          <div className="grid gap-2 border p-3 rounded-md bg-gradient-to-r from-teal-100 to-orange-100 dark:from-teal-800 dark:to-orange-800">
                            <h4 className="font-medium">Inspection 2</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="inspection2-yes-no" />
                                <Label htmlFor="inspection2-yes-no">Yes/No</Label>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="inspection2-roll-direction">Roll Direction (Optional)</Label>
                                <Input id="inspection2-roll-direction" placeholder="Roll direction" />
                              </div>
                              <div className="grid gap-2 col-span-2">
                                <Label htmlFor="inspection2-remarks">Remarks (Optional)</Label>
                                <Textarea
                                  id="inspection2-remarks"
                                  placeholder="Any additional remarks for inspection 2"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Slitting Job Details */}
                          <div className="grid gap-2 border p-3 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-800 dark:to-purple-800">
                            <h4 className="font-medium">Slitting</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="slitting-yes-no" />
                                <Label htmlFor="slitting-yes-no">Yes/No</Label>
                              </div>
                              <div className="grid gap-2 col-span-2">
                                <Label htmlFor="slitting-remarks">Remarks (Optional)</Label>
                                <Textarea id="slitting-remarks" placeholder="Any additional remarks for slitting" />
                              </div>
                            </div>
                          </div>

                          {/* Fabric Lamination Job Details */}
                          <div className="grid gap-2 border p-3 rounded-md bg-gradient-to-r from-orange-100 to-teal-100 dark:from-orange-800 dark:to-teal-800">
                            <h4 className="font-medium">Fabric Lamination</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="fabric-lam-size">Size</Label>
                                <Input id="fabric-lam-size" placeholder="Size" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="fabric-lam-material-type">Material Type</Label>
                                <Input id="fabric-lam-material-type" placeholder="Material type" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="fabric-lam-side">Single/Double Side</Label>
                                <Select>
                                  <SelectTrigger id="fabric-lam-side">
                                    <SelectValue placeholder="Select side" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="single">Single</SelectItem>
                                    <SelectItem value="double">Double</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="fabric-lam-trimming" />
                                <Label htmlFor="fabric-lam-trimming">Trimming (Yes/No)</Label>
                              </div>
                            </div>
                          </div>

                          {/* Cutting and Slitting Job Details */}
                          <div className="grid gap-2 border p-3 rounded-md bg-gradient-to-r from-teal-100 to-purple-100 dark:from-teal-800 dark:to-purple-800">
                            <h4 className="font-medium">Cutting and Slitting</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="cut-slit-type">Type</Label>
                                <Select>
                                  <SelectTrigger id="cut-slit-type">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="regular">Regular</SelectItem>
                                    <SelectItem value="gusset">Gusset</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="cut-slit-stitching" />
                                <Label htmlFor="cut-slit-stitching">Stitching (Y/N)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="cut-slit-perforation" />
                                <Label htmlFor="cut-slit-perforation">Perforation (Y/N)</Label>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="cut-slit-thread-color">Thread Color</Label>
                                <Input id="cut-slit-thread-color" placeholder="Thread color" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="cut-slit-handle-type">Handles Type</Label>
                                <Input id="cut-slit-handle-type" placeholder="Handle type" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="cut-slit-handle-colors">Handle Colors</Label>
                                <Input id="cut-slit-handle-colors" placeholder="Handle colors" />
                              </div>
                              <div className="grid gap-2 col-span-2">
                                <Label htmlFor="cut-slit-packing">Packing</Label>
                                <Textarea id="cut-slit-packing" placeholder="Packing details" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white"
                      >
                        Save Item
                      </Button>
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
