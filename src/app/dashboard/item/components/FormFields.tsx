// boppJobCards.tsx
import { useState, useRef, useEffect } from "react"
import React from "react";
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar"
import { toast } from "sonner"
import ImageDropBox from "@/app/_components/imageDropBox"
import { Checkbox } from "@/app/_components/ui/checkbox"
import { Sheet, SheetContent,SheetDescription, SheetTrigger } from "@/app/_components/ui/sheet";
import {   SheetTitle } from "@/app/_components/ui/sheet"
import { Button } from "@/app/_components/ui/button"
import { AnyProfileCard } from "@/app/_components/anyProfileCard"
import { ComponentLoading } from "@/app/_components/component-loading2"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Input } from "@/app/_components/ui/input2"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/_components/ui/pagination"
// Shared types and props (if needed)
import {type BOPPItemForm, type YN,type SelectedCustomer} from "@/types/bopp"; // update the path based on your project
import { motion } from "framer-motion"
import { api } from "@/trpc/react"
import { Label } from "@/app/_components/ui/label"
type Props2 = {
  boppItem: BOPPItemForm;
  setBoppItem: React.Dispatch<React.SetStateAction<BOPPItemForm>>;
  getOptions: (fieldName: string) => string[];
  selectedCustomer: SelectedCustomer;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<SelectedCustomer>>;
};
type Props3 = {
  boppItem: BOPPItemForm;
  setBoppItem: React.Dispatch<React.SetStateAction<BOPPItemForm>>;
  getOptions: (fieldName: string) => string[];
  selectedCustomer: SelectedCustomer;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<SelectedCustomer>>;
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
};

type Props = {
  boppItem: BOPPItemForm;
  setBoppItem: React.Dispatch<React.SetStateAction<BOPPItemForm>>;
  getOptions: (fieldName: string) => string[];
  disabled?: boolean;
};
// 💡 Tailwind className constants
const containerClass = "w-[90%] space-y-1 border rounded-md p-2 bg-gray-50 dark:bg-gray-900";
const sectionHeadingClass = "text-lg font-semibold text-gray-700 dark:text-gray-100";
const inputClass = "w-full  border-gray-300 dark:border-gray-700";
const selectTriggerClass = "w-full bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-700";

//search, image and checkes
export const Search_Div = ({ boppItem, setBoppItem, getOptions, selectedCustomer,setSelectedCustomer }: Props2) => {
     const router = useRouter();
    const [searchTermCustomer, setSearchTermCustomer] = useState("");
    const [customerPage, setCustomerPage] = useState(1);
    const customerLimit = 5;
    const [isSearchBarFocused, setIsSearchBarFocused] = useState(false); // NEW
    
    const { data: customerData, isLoading: isSearchingCustomers } =
      api.user.searchCustomers_Item.useQuery({
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
    
    const searchRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setIsSearchBarFocused(false);
        }
      };
    
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    
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
  return (
     <>
     <motion.div variants={itemVariants} className="w-full max-w-md">
  <Label className="text-lg font-semibold text-gray-800 dark:text-white">
    Select a Customer to which the item will be added:
  </Label>

  {/* Search Input */}
  <div ref={searchRef} className="relative mt-2">
<div className="mt-2 flex items-center justify-between gap-2">
  {/* Search Field Container (takes full width minus button) */}
  <div className="relative flex-1">
    <Input
      type="search"
      placeholder="Search customers..."
      className="w-full rounded-md pl-10 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
      value={searchTermCustomer}
      onChange={(e) => handleCustomerSearch(e.target.value)}
      onFocus={() => setIsSearchBarFocused(true)}
    />

    {/* Search Icon */}
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
      </svg>
    </div>
  </div>

  {/* Form Option Edit Button (fixed width, separate from search) */}
  <a
  href="/dashboard/settings?tab=formOptions"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button
    className="ml-2 whitespace-nowrap bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-md"
  >
    Form Option Edit
  </Button>
</a>

</div>


  {/* Dropdown Suggestion Box */}
  <div className="relative w-full">
   {/* Dropdown Suggestion Box + Pagination Inside */}
{isSearchBarFocused && (
  <div className="absolute z-50 mt-2 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-[400px] overflow-y-auto">
    {isSearchingCustomers ? (
      <ComponentLoading message="Searching..." />
    ) : filteredCustomers.length > 0 ? (
      <>
        {/* Customers List */}
      {filteredCustomers.map((customer) => {
  const handleCustomerSelect = () => {
    console.log("Customer clicked:", customer);

    const selected = {
      userName: customer.name,
      userId: customer.id,
      customerId: customer.customerId,
      companyBilling: customer.companyBilling,
      brands: customer.brands,
      addresses: customer.addresses,
      totalItemsBOPP: customer.totalItemsBOPP,
      totalItemsPET: customer.totalItemsPET,
    };

    setSelectedCustomer(selected);

    setBoppItem((prev) => ({
      ...prev,
      userId: selected.userId,
      customerId: selected.customerId ?? "", // safety fallback
      userName: customer.name,
    }));

    setIsSearchBarFocused(false);
  };

  return (
    <div
      key={customer.id}
      className="flex items-start justify-between px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
    >
      {/* CLICKABLE AREA */}
      <div
        className="flex items-start flex-1 cursor-pointer"
        onClick={handleCustomerSelect}
      >
        <Avatar className="h-12 w-12 ring-2 ring-purple-500 ring-offset-2">
          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {customer.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="ml-4 flex-1 text-sm font-medium text-gray-800 dark:text-white space-y-0.5">
          <div>Name: {highlightText(customer.name, searchTermCustomer)}</div>
          <div>ID: {highlightText(customer.id, searchTermCustomer)}</div>
          <div>Phone: {highlightText(customer.phone, searchTermCustomer)}</div>
        </div>
      </div>

      {/* DROPDOWN MENU - NOT PART OF CLICKABLE */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 mt-1"
            onClick={(e) => e.stopPropagation()} // ✅ prevent interfering with click
          >
            <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <Sheet>
            <SheetTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // ✅ important
                }}
              >
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
  );
})}


        {/* Inline Pagination */}
        {totalCustomerPages > 1 && (
          
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
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
      </>
    ) : (
      <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">No customers found.</div>
    )}
  </div>
)}

  </div>
</div>

 <>
 </>
</motion.div>
     </>
  );
};

export const Image_Checkbox_AllFields = ({ boppItem, setBoppItem, getOptions, selectedCustomer,setSelectedCustomer,images,setImages }: Props3) => {
     const router = useRouter();
    const [searchTermCustomer, setSearchTermCustomer] = useState("");
    const [customerPage, setCustomerPage] = useState(1);
    const customerLimit = 5;
    const [isSearchBarFocused, setIsSearchBarFocused] = useState(false); // NEW
    
    const { data: customerData, isLoading: isSearchingCustomers } =
      api.user.searchCustomers_Item.useQuery({
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
    
    const searchRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setIsSearchBarFocused(false);
        }
      };
    
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    
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
  return (
     <>
      <div className="flex flex-col md:flex-row md:space-x-6">
           
           {/* LEFT SIDE: Select Fields (70%) */}
           <div className="md:w-[70%] w-full space-y-4">
     
       {/* USER INFO ROW */}
       <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">
       User Name:{" "}
       <span className="text-blue-600 dark:text-blue-400">
         {selectedCustomer.userName}
       </span>
     </h3>
     
     <h3 className="text-base font-semibold text-gray-800 dark:text-white">
       User ID:{" "}
       <span className="text-blue-600 dark:text-blue-400">
         {selectedCustomer.userId}
       </span>
     </h3>
     
       </div>
     
       {/* SELECTS IN A SINGLE ROW ON DESKTOP */}
       <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
         {/* Billing Name */}
         <div className="w-full md:w-1/3">
         {/* Item Name */}
     
           <Label className="mb-1 block">Company Billing Name</Label>
           <Select
             onValueChange={(value) =>
               setBoppItem((prev) => ({ ...prev, billingName: value }))
             }
           >
             <SelectTrigger className="w-full">
               <SelectValue placeholder="Select billing name" />
             </SelectTrigger>
             <SelectContent>
               {selectedCustomer.companyBilling.map((bill) => (
                 <SelectItem key={bill} value={bill}>
                   {bill}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
     
         {/* Brand */}
         <div className="w-full md:w-1/3">
           <Label className="mb-1 block">Brand</Label>
           <Select
             onValueChange={(value) =>
               setBoppItem((prev) => ({ ...prev, brand: value }))
             }
           >
             <SelectTrigger className="w-full">
               <SelectValue placeholder="Select brand" />
             </SelectTrigger>
             <SelectContent>
               {selectedCustomer.brands.map((brand) => (
                 <SelectItem key={brand} value={brand}>
                   {brand}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
     
         {/* Address */}
         <div className="w-full md:w-1/3">
           <Label className="mb-1 block">Address</Label>
           <Select
             onValueChange={(value) =>
               setBoppItem((prev) => ({ ...prev, address: value }))
             }
           >
             <SelectTrigger className="w-full">
               <SelectValue placeholder="Select address" />
             </SelectTrigger>
             <SelectContent>
               {selectedCustomer.addresses.map((addr) => (
                 <SelectItem key={addr} value={addr}>
                   {addr}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
     
       </div>
         {/* Row 1: Item Name + GMS */}
     <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
       <div className="w-full md:w-1/2">
         <Input
           type="text"
           label="Item Name"
           placeholder="Item Name"
           className={inputClass}
           value={boppItem.name || ""}
           onChange={(e) =>
             setBoppItem((prev) => ({ ...prev, name: e.target.value }))
           }
         />
       </div>
       <div className="w-full md:w-1/2">
         <Input
       type="text"
       label="GMS (Package Capacity)"
       placeholder="Enter GMS"
       className={inputClass}
       value={boppItem.GMS || ""}
       onChange={(e) =>
         setBoppItem((prev) => ({ ...prev, GMS: e.target.value }))
       }
     />
       </div>
     </div>
     
     {/* Row 2: Description + Banner */}
     <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-4">
       <div className="w-full md:w-1/2">
         <Input
           type="text"
           label="Description"
           placeholder="Description (optional)"
           className={inputClass}
           value={boppItem.description || ""}
           onChange={(e) =>
             setBoppItem((prev) => ({ ...prev, description: e.target.value }))
           }
         />
       </div>
       <div className="w-full md:w-1/2">
         <Input
           type="text"
           label="Banner"
           placeholder="Banner for Image"
           className={inputClass}
           value={boppItem.banner || ""}
           onChange={(e) =>
             setBoppItem((prev) => ({ ...prev, banner: e.target.value }))
           }
         />
       </div>
     </div>
     
     
     
       <ImageDropBox images={images} setImages={setImages} />
     
     </div>
     
     
           {/* RIGHT SIDE: Checkboxes (30%) */}
           <div className="sm:w-[30%] w-full mt-6 md:mt-0 space-y-3">
             <Label className="mb-2 block font-semibold">Process Required:</Label>
     
             {/* Printing */}
             <div className="flex items-center space-x-2">
               <Checkbox
                 checked={boppItem.printingCheck}
                 onCheckedChange={(checked) =>
                   setBoppItem((prev) => ({ ...prev, printingCheck: !!checked }))
                 }
                 className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-purple-500"
               />
               <span>Printing</span>
             </div>
     
             {/* Inspection 1 */}
             <div className="flex items-center space-x-2">
               <Checkbox
                 checked={boppItem.inspection1Check}
                 onCheckedChange={(checked) =>
                   setBoppItem((prev) => ({ ...prev, inspection1Check: !!checked }))
                 }
                 className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-purple-500"
               />
               <span>Inspection 1</span>
             </div>
     
             {/* Lamination */}
             <div className="flex items-center space-x-2">
               <Checkbox
                 checked={boppItem.laminationCheck}
                 onCheckedChange={(checked) =>
                   setBoppItem((prev) => ({ ...prev, laminationCheck: !!checked }))
                 }
                 className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-purple-500"
               />
               <span>Lamination</span>
             </div>
     
             {/* Inspection 2 */}
             <div className="flex items-center space-x-2">
               <Checkbox
                 checked={boppItem.inspection2Check}
                 onCheckedChange={(checked) =>
                   setBoppItem((prev) => ({ ...prev, inspection2Check: !!checked }))
                 }
                 className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-purple-500"
               />
               <span>Inspection 2</span>
             </div>
     
             {/* Slitting */}
             <div className="flex items-center space-x-2">
               <Checkbox
                 checked={boppItem.slittingCheck}
                 onCheckedChange={(checked) =>
                   setBoppItem((prev) => ({ ...prev, slittingCheck: !!checked }))
                 }
                 className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-purple-500"
               />
               <span>Slitting</span>
             </div>
     
             {/* Fabric Lamination */}
             <div className="flex items-center space-x-2">
               <Checkbox
                 checked={boppItem.fabricLaminationCheck}
                 onCheckedChange={(checked) =>
                   setBoppItem((prev) => ({ ...prev, fabricLaminationCheck: !!checked }))
                 }
                 className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-purple-500"
               />
               <span>Fabric Lamination</span>
             </div>
     
             {/* Cutting & Stitching */}
             <div className="flex items-center space-x-2">
               <Checkbox
                 checked={boppItem.cuttingAndStitchingCheck}
                 onCheckedChange={(checked) =>
                   setBoppItem((prev) => ({ ...prev, cuttingAndStitchingCheck: !!checked }))
                 }
                 className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-purple-500"
               />
               <span>Cutting & Stitching</span>
             </div>
           </div>
         </div>
               {/* All Job Description Cards*/}
         <div className="w-full overflow-x-auto">
       <table className="hidden md:table w-full border text-sm text-left text-gray-700 dark:text-gray-200">
         
        <tbody className="bg-white dark:bg-gray-900">
       <tr>
         <td className="align-middle p-1" rowSpan={2}>{boppItem.printingCheck && <div className="flex h-full w-full items-center justify-center"><PrintingCard boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} /></div>}</td>
         <td className="align-middle p-1">{boppItem.inspection1Check && <div className="flex h-full w-full items-center justify-center"><Inspection1Card boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} /></div>}</td>
       </tr>
       <tr>
         <td className="align-middle p-1">{boppItem.laminationCheck && <div className="flex h-full w-full items-center justify-center"><LaminationCard boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} /></div>}</td>
       </tr>
       <tr>
         <td className="align-middle p-1">{boppItem.inspection2Check && <div className="flex h-full w-full items-center justify-center"><Inspection2Card boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} /></div>}</td>
         <td className="align-middle p-1">{boppItem.slittingCheck && <div className="flex h-full w-full items-center justify-center"><SlittingCard boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} /></div>}</td>
       </tr>
       <tr>
         <td className="align-middle p-1">{boppItem.fabricLaminationCheck && <div className="flex h-full w-full items-center justify-center"><FabricLaminationCard boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} /></div>}</td>
         <td className="align-middle p-1">{boppItem.cuttingAndStitchingCheck && <div className="flex h-full w-full items-center justify-center"><CuttingAndStitchingCard boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} /></div>}</td>
       </tr>
     </tbody>
     
       </table>
     
       {/* Mobile View */}
       <div className="md:hidden space-y-4">
         {boppItem.printingCheck && <PrintingCard  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions}/>}
         {boppItem.inspection1Check && <Inspection1Card  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions}/>}
         {boppItem.laminationCheck && <LaminationCard  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions}/>}
         {boppItem.inspection2Check && <Inspection2Card  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions}/>}
         {boppItem.slittingCheck && <SlittingCard  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions}/>}
         {boppItem.fabricLaminationCheck && <FabricLaminationCard  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions}/>}
         {boppItem.cuttingAndStitchingCheck && <CuttingAndStitchingCard  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions}/>}
       </div>
     </div>
     </>
  );
};


// 1. Printing Card
export const PrintingCard = ({ boppItem, setBoppItem, getOptions, disabled = false }: Props) => {
  return (
     <div className={containerClass}>
    <h2 className={sectionHeadingClass}>Printing</h2>

    {/* Size x Mic */}
    <Input
      type="text"
      label="Size x Mic"
      placeholder="Size x Mic"
      className={inputClass}
      value={boppItem.printing_SizexMic || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          printing_SizexMic: e.target.value,
        }))
      }
      disabled={ disabled }
    />

    {/* Material Type */}
{/* Material Type */}
<Select
  value={boppItem.printing_MaterialType || ""}
  onValueChange={(val: string) =>
    setBoppItem((prev) => ({
      ...prev,
      printing_MaterialType: val === "__none__" ? "" : val,
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Select Material Type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">-- None --</SelectItem>
    {getOptions("BOPP_Printing_MaterialType").map((opt) => (
      <SelectItem key={opt} value={opt}>
        {opt}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

{/* Cylinder */}
<Select
  value={boppItem.printing_Cylinder || ""}
  onValueChange={(val: string) =>
    setBoppItem((prev) => ({
      ...prev,
      printing_Cylinder: val === "__none__" ? "" : val,
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Select Cylinder" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">-- None --</SelectItem>
    {["Old", "New"].map((opt) => (
      <SelectItem key={opt} value={opt}>
        {opt}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

{/* Cylinder Direction */}
<Select
  value={boppItem.printing_CylinderDirection || ""}
  onValueChange={(val: string) =>
    setBoppItem((prev) => ({
      ...prev,
      printing_CylinderDirection: val === "__none__" ? "" : val,
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Select Cylinder Direction" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">-- None --</SelectItem>
    {["Reverse", "Straight"].map((opt) => (
      <SelectItem key={opt} value={opt}>
        {opt}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

{/* Number of Colours */}
<Select
  value={boppItem.printing_NoOfColours?.toString() || ""}
  onValueChange={(val: string) =>
    setBoppItem((prev) => ({
      ...prev,
      printing_NoOfColours: val === "__none__" ? 0 : parseInt(val),
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Select Number of Colours" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">-- None --</SelectItem>
    {Array.from({ length: 10 }, (_, i) => (
      <SelectItem key={i} value={i.toString()}>
        {i}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


    {/* Colour Names */}
    <Input
      type="text"
      label="Colour Names (comma separated)"
      placeholder="Colour Names (comma separated)"
      className={inputClass}
      value={boppItem.printing_Colours || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          printing_Colours: e.target.value,
        }))
      }
      disabled={ disabled }
    />

    {/* Printing Remark */}
    <Input
      type="text"
      label="Printing Remark (optional)"
      placeholder="Remarks (optional)"
      className={inputClass}
      value={boppItem.printing_Remarks || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          printing_Remarks: e.target.value,
        }))
      }
      disabled={ disabled }
    />
  </div>
  );
};

// 2. Inspection 1 Card
export const Inspection1Card = ({ boppItem, setBoppItem,disabled = false }: Props) => {
  return (
    <div className={containerClass}>
    <h2 className={sectionHeadingClass}>Inspection 1</h2>

    {/* Remark Field */}
    <Input
      type="text"
      label="Inspection 1 Remark (optional)"
      className={inputClass}
      value={boppItem.inspection1_Remarks || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          inspection1_Remarks: e.target.value,
        }))
      }
      disabled={ disabled }
    />
  </div>
  );
};

// 3. Lamination Card
export const LaminationCard = ({ boppItem, setBoppItem, getOptions,disabled = false }: Props) => {
  return (
   <div className={containerClass}>
    <h2 className={sectionHeadingClass}>Lamination</h2>

    {/* Size x Mic */}
    <Input
      type="text"
      label="Size x Mic"
      placeholder="Size x Mic"
      className={inputClass}
      value={boppItem.lamination_SizexMic || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          lamination_SizexMic: e.target.value,
        }))
      }
      disabled={ disabled }
    />

    {/* Lamination Type (from form options) */}
   <Select
  value={boppItem.lamination_Type || ""}
  onValueChange={(val: string) =>
    setBoppItem((prev) => ({
      ...prev,
      lamination_Type: val === "__none__" ? "" : val,
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Select Lamination Type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">-- None --</SelectItem>
    {getOptions("BOPP_Lamination_Type").map((opt) => (
      <SelectItem key={opt} value={opt}>
        {opt}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


    {/* Lamination Remark */}
    <Input
      type="text"
      label="Lamination Remark (optional)"
      placeholder="Lamination Remark (optional)"
      className={inputClass}
      value={boppItem.lamination_Remarks || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          lamination_Remarks: e.target.value,
        }))
      }
      disabled={ disabled }
    />
  </div>
  );
};

// 4. Inspection 2 Card
export const Inspection2Card = ({ boppItem, setBoppItem,disabled = false }: Props) => {
  return (
    <div className={containerClass}>
    <h2 className={sectionHeadingClass}>Inspection 2</h2>

    <Input
      type="text"
      label="Inspection 2 Remark (optional)"
      placeholder="Inspection 2 Remark (optional)"
      className={inputClass}
      value={boppItem.inspection2_Remarks || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          inspection2_Remarks: e.target.value,
        }))
      }
      disabled={ disabled }
    />
  </div>
  );
};

// 5. Slitting Card
export const SlittingCard = ({ boppItem, setBoppItem,disabled = false }: Props) => {
  return (
    <div className={containerClass}>
    <h2 className={sectionHeadingClass}>Slitting</h2>

    <Input
      type="text"
      label="Slitting Remark (optional)"
      placeholder="Slitting Remark (optional)"
      className={inputClass}
      value={boppItem.slitting_Remarks || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          slitting_Remarks: e.target.value,
        }))
      }
      disabled={ disabled }
    />
  </div>
  );
};

// 6. Fabric Lamination Card
export const FabricLaminationCard = ({ boppItem, setBoppItem, getOptions, disabled = false }: Props) => {
  return (
   <div className={containerClass}>
       <h2 className={sectionHeadingClass}>Fabric Lamination</h2>
   
       {/* Size */}
       <Input
         type="text"
         label="Size"
         placeholder="Size"
         className={inputClass}
         value={boppItem.fabricLamination_Size || ""}
         onChange={(e) =>
           setBoppItem((prev) => ({
             ...prev,
             fabricLamination_Size: e.target.value,
           }))
         }
         disabled={ disabled }
       />
   
      {/* Material Type */}
<Select
  value={boppItem.fabricLamination_MaterialType || ""}
  onValueChange={(val) =>
    setBoppItem((prev) => ({
      ...prev,
      fabricLamination_MaterialType: val === "__none__" ? "" : val,
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Select Material Type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">-- None --</SelectItem>
    {getOptions("BOPP_Fabric_Lamination_MaterialTypes").map((opt) => (
      <SelectItem key={opt} value={opt}>
        {opt}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

{/* Sides */}
<Select
  value={boppItem.fabricLamination_Sides || ""}
  onValueChange={(val) =>
    setBoppItem((prev) => ({
      ...prev,
      fabricLamination_Sides: val === "__none__" ? "" : val,
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Select Sides" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">-- None --</SelectItem>
    {getOptions("BOPP_Fabric_Lamination_Sides").map((opt) => (
      <SelectItem key={opt} value={opt}>
        {opt}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

{/* Trimming */}
<Select
  value={boppItem.fabricLamination_Trimming || ""}
  onValueChange={(val) =>
    setBoppItem((prev) => ({
      ...prev,
      fabricLamination_Trimming: val === "__none__" ? undefined : (val as YN),
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Trimming" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">-- None --</SelectItem>
    <SelectItem value="YES">Yes</SelectItem>
    <SelectItem value="NO">No</SelectItem>
  </SelectContent>
</Select>


   
       {/* Remark */}
       <Input
         type="text"
         label="Fabric Lamination Remark (optional)"
         placeholder="Fabric Lamination Remark (optional)"
         className={inputClass}
         value={boppItem.fabricLamination_Remarks || ""}
         onChange={(e) =>
           setBoppItem((prev) => ({
             ...prev,
             fabricLamination_Remarks: e.target.value,
           }))
         }
         disabled={ disabled }
       />
     </div>
  );
};

// 7. Cutting And Stitching Card
export const CuttingAndStitchingCard = ({ boppItem, setBoppItem, getOptions, disabled = false }: Props) => {
  return (
   <div className={containerClass}>
    <h2 className={sectionHeadingClass}>Cutting and Slitting</h2>
{/* Type */}
<Select
  value={boppItem.cuttingAndStitching_Type || ""}
  onValueChange={(val) =>
    setBoppItem((prev) => ({
      ...prev,
      cuttingAndStitching_Type: val === "__none__" ? "" : val,
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Cutting and stitching Type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">-- None --</SelectItem> {/* special marker */}
    {getOptions("BOPP_Cutting_Slitting_Type").map((opt) => (
      <SelectItem key={opt} value={opt}>
        {opt}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


   {/* Stitching */}
{/* Stitching */}
<Select
  value={boppItem.cuttingAndStitching_Stitching ?? ""}
  onValueChange={(val) =>
    setBoppItem((prev) => ({
      ...prev,
      cuttingAndStitching_Stitching: val === "__none__" ? undefined : (val as YN),
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Stitching" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">None</SelectItem>
    <SelectItem value="YES">Yes</SelectItem>
    <SelectItem value="NO">No</SelectItem>
  </SelectContent>
</Select>

{/* Perforation */}
<Select
  value={boppItem.cuttingAndStitching_Perforation ?? ""}
  onValueChange={(val) =>
    setBoppItem((prev) => ({
      ...prev,
      cuttingAndStitching_Perforation: val === "__none__" ? undefined : (val as YN),
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Perforation" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">None</SelectItem>
    <SelectItem value="YES">Yes</SelectItem>
    <SelectItem value="NO">No</SelectItem>
  </SelectContent>
</Select>



    {/* Thread Colour */}
    <Input
      type="text"
      label="Thread Colour"
      placeholder="Thread Colour"
      className={inputClass}
      value={boppItem.cuttingAndStitching_ThreadColour || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          cuttingAndStitching_ThreadColour: e.target.value,
        }))
      }
      disabled={ disabled }
    />

    {/* Handle Type */}
   <Select
  value={boppItem.cuttingAndStitching_HandleType }
  onValueChange={(val) =>
    setBoppItem((prev) => ({
      ...prev,
      cuttingAndStitching_HandleType: val === "__none__" ? "" : val,
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Handle Type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">-- None --</SelectItem>
    {getOptions("BOPP_Cutting_Slitting_HandleTypes").map((opt) => (
      <SelectItem key={opt} value={opt}>
        {opt}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


    {/* Handle Colour */}
    <Input
      type="text"
      label="Handle Colour"
      placeholder="Handle Colour"
      className={inputClass}
      value={boppItem.cuttingAndStitching_HandleColour || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          cuttingAndStitching_HandleColour: e.target.value,
        }))
      }
      disabled={ disabled }
    />

    {/* Packing */}
<Select
  value={boppItem.cuttingAndStitching_Packing ?? ""}
  onValueChange={(val) =>
    setBoppItem((prev) => ({
      ...prev,
      cuttingAndStitching_Packing: val === "__none__" ? undefined : (val as YN),
    }))
  }
>
  <SelectTrigger className={selectTriggerClass} disabled={ disabled }>
    <SelectValue placeholder="Packing" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">None</SelectItem>
    <SelectItem value="YES">Yes</SelectItem>
    <SelectItem value="NO">No</SelectItem>
  </SelectContent>
</Select>



    {/* Remark */}
    <Input
      type="text"
      label="Cutting and Slitting Remark (optional)"
      placeholder="Cutting and Slitting Remark (optional)"
      className={inputClass}
      value={boppItem.cuttingAndStitching_Remarks || ""}
      onChange={(e) =>
        setBoppItem((prev) => ({
          ...prev,
          cuttingAndStitching_Remarks: e.target.value,
        }))
      }
      disabled={ disabled }
    />
  </div>
  );
};
