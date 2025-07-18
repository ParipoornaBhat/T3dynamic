// boppJobCards.tsx
import { useState, useRef, useEffect, use } from "react"
import React from "react";
import { MoreVertical, Search ,SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar"
import { toast } from "sonner"
import ImageDropBox from "@/app/_components/imageDropBox2"
import { Checkbox } from "@/app/_components/ui/checkbox"
import { Sheet, SheetContent,SheetDescription, SheetTrigger } from "@/app/_components/ui/sheet";
import {   SheetTitle } from "@/app/_components/ui/sheet"
import { Button } from "@/app/_components/ui/button"
import { AnyProfileCard } from "@/app/_components/anyProfileCard"
import { ComponentLoading } from "@/app/_components/component-loading2"
import { PrintingCard,Inspection1Card, LaminationCard, Inspection2Card, SlittingCard, FabricLaminationCard, CuttingAndStitchingCard } from "@/app/dashboard/item/components/FormFields"
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
  disabled?: boolean; // added for editMode/viewMode handling
  defaultSelectedCustomer: SelectedCustomer;
};
type Props3 = {
  boppItem: BOPPItemForm;
  setBoppItem: React.Dispatch<React.SetStateAction<BOPPItemForm>>;
  getOptions: (fieldName: string) => string[];
  selectedCustomer: SelectedCustomer;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<SelectedCustomer>>;
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImageUrls: string[]; // required in your current component
  setExistingImageUrls: React.Dispatch<React.SetStateAction<string[]>>; // required
  disabled?: boolean; // added for editMode/viewMode handling
};

// 💡 Tailwind className constants
const containerClass = "w-[90%] space-y-1 border rounded-md p-2 bg-gray-50 dark:bg-gray-900";
const sectionHeadingClass = "text-lg font-semibold text-gray-700 dark:text-gray-100";
const inputClass = "w-full  border-gray-300 dark:border-gray-700";
const selectTriggerClass = "w-full bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-700";

//search, image and checkes
export const Search_Div = ({
  boppItem,
  setBoppItem,
  getOptions,
  selectedCustomer,
  setSelectedCustomer,
  disabled,
}: Props2) => {
  const router = useRouter();
  const [searchTermCustomer, setSearchTermCustomer] = useState("");
  const [customerPage, setCustomerPage] = useState(1);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const customerLimit = 5;

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
useEffect(() => {
  if (!boppItem.userId) return;

  // Trigger search
  setSearchTermCustomer(boppItem.userId);
  setCustomerPage(1);

  // Wait for profiles to come and match the customer
  const matchedCustomer = customerData?.profiles.find(
    (c) => c.id === boppItem.userId
  );

if (matchedCustomer) { 
  setSelectedCustomer({
    userId: matchedCustomer.id,
    userName: matchedCustomer.name,
    customerId: matchedCustomer.customerId,
    companyBilling: matchedCustomer.companyBilling,
    brands: matchedCustomer.brands,
    addresses: matchedCustomer.addresses,
    totalItemsBOPP: matchedCustomer.totalItemsBOPP,
    totalItemsPET: matchedCustomer.totalItemsPET,
  });
  setIsSearchBarFocused(false);
}
  
}, [boppItem.userId, customerData]);


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

  useEffect(() => {
    if (boppItem.userId) {
      handleCustomerSearch(boppItem.userId);
    }
  }, [boppItem.userId]);
useEffect(() => {
    if(boppItem.userId && !isSearchingCustomers ) {
      
    }
},[boppItem.userId, isSearchingCustomers]);
  const highlightText = (text: string, search: string) => {
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
  };
  
  const defaultSelectedCustomer: SelectedCustomer = {
    userName: "",
    userId: "",
    customerId: "",
    companyBilling: [],
    brands: [],
    addresses: [],
    totalItemsBOPP: 0,
    totalItemsPET: 0,
  };
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
const [changeEnabled, setChangeEnabled] = useState(false);
  const itemVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }
  return (
    <motion.div
      variants={itemVariants}
      className="w-full max-w-md"
    >
      <Label className="text-lg font-semibold text-gray-800 dark:text-white">
      </Label>

      {/* Change Button for Edit Mode */}
      

      {/* Search Input */}
      <div ref={searchRef} className="relative mt-2">
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              name="customerSearch"
              placeholder="Search customers..."
              className="w-full rounded-md pl-10 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              value={searchTermCustomer}
              onChange={(e) => handleCustomerSearch(e.target.value)}
              onFocus={() => setIsSearchBarFocused(true)}
              disabled={true}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
              </svg>
            </div>
          </div>

          {/* Form Option Edit Button */}
          <a href="/dashboard/settings?tab=formOptions" target="_blank" rel="noopener noreferrer">
            <Button className="ml-2 whitespace-nowrap bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-md" disabled={true}>
              Form Option Edit
            </Button>
          </a>
          
        </div>

        {/* Dropdown Suggestion Box */}
        <div className="relative w-full">
          {isSearchBarFocused && (
            <div className="absolute z-50 mt-2 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-[400px] overflow-y-auto">
              {isSearchingCustomers ? (
                <ComponentLoading message="Searching..." />
              ) : filteredCustomers.length > 0 ? (
                <>
                  {filteredCustomers.map((customer) => {
                    const handleCustomerSelect = () => {
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
                        customerId: selected.customerId ?? "",
                        userName: customer.name,
                      }));

                      setIsSearchBarFocused(false);
                    };

                    return (
                      <div
                        key={customer.id}
                        className="flex items-start justify-between px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
                      >
                        <div className="flex items-start flex-1 cursor-pointer" onClick={handleCustomerSelect}>
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

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 mt-1"
                              onClick={(e) => e.stopPropagation()}
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
                                    e.stopPropagation();
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
                                <SheetDescription className="sr-only">
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

                  {/* Pagination */}
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
                <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  No customers found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};




export const Image_Checkbox_AllFields = ({
  boppItem,
  setBoppItem,
  getOptions,
  selectedCustomer,
  setSelectedCustomer,
  images,
  setImages,
  existingImageUrls,
  setExistingImageUrls,
  disabled, // ✅ new prop
}: Props3 & { disabled?: boolean }) => {
  return (<>
    <div className="flex flex-col md:flex-row md:space-x-6">
      {/* LEFT */}
      <div className="md:w-[70%] w-full space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
          <h3 className="text-base font-semibold">User Name: <span className="text-blue-600">{selectedCustomer.userName}</span></h3>
          <h3 className="text-base font-semibold">User ID: <span className="text-blue-600">{selectedCustomer.userId}</span></h3>
           <h3 className="text-base font-semibold">Item ID: <span className="text-blue-600">{boppItem.id}</span></h3>

        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
         {/* Billing Name */}
            <Select
            disabled={disabled}
            value={boppItem.billingName || ""}
            onValueChange={(value) =>
                setBoppItem((prev) => ({
                ...prev,
                billingName: value === "__none__" ? "" : value,
                }))
            }
            >
            <SelectTrigger>
                <SelectValue placeholder="Billing Name" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="__none__">-- None --</SelectItem>
                {selectedCustomer.companyBilling.map((bill) => (
                <SelectItem key={bill} value={bill}>
                    {bill}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>

            {/* Brand */}
            <Select
            disabled={disabled}
            value={boppItem.brand || ""}
            onValueChange={(value) =>
                setBoppItem((prev) => ({
                ...prev,
                brand: value === "__none__" ? "" : value,
                }))
            }
            >
            <SelectTrigger>
                <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="__none__">-- None --</SelectItem>
                {selectedCustomer.brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                    {brand}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>

            {/* Address */}
            <Select
            disabled={disabled}
            value={boppItem.address || ""}
            onValueChange={(value) =>
                setBoppItem((prev) => ({
                ...prev,
                address: value === "__none__" ? "" : value,
                }))
            }>
            <SelectTrigger>
                <SelectValue placeholder="Address" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="__none__">-- None --</SelectItem>
                {selectedCustomer.addresses.map((addr) => (
                <SelectItem key={addr} value={addr}>
                    {addr}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>

        </div>

        {/* Item name + GMS */}
        <Input
            label="Item Name"
          placeholder="Item Name"
          value={boppItem.name || ""}
          disabled={disabled}
          onChange={(e) => setBoppItem((prev) => ({ ...prev, name: e.target.value }))}
        />
        <Input
            label="GMS"
          placeholder="GMS"
          value={boppItem.GMS || ""}
          disabled={disabled}
          onChange={(e) => setBoppItem((prev) => ({ ...prev, GMS: e.target.value }))}
        />

        {/* Description + Banner */}
        <Input
            label="Description"
          placeholder="Description"
          value={boppItem.description || ""}
          disabled={disabled}
          onChange={(e) => setBoppItem((prev) => ({ ...prev, description: e.target.value }))}
        />
        <Input
            label="Banner"
          placeholder="Banner"
          value={boppItem.banner || ""}
          disabled={disabled}
          onChange={(e) => setBoppItem((prev) => ({ ...prev, banner: e.target.value }))}
        />

        <ImageDropBox
          images={images}
          setImages={setImages}
          existingImageUrls={existingImageUrls}
          setExistingImageUrls={setExistingImageUrls}
          disabled={disabled} // ✅ passed
          boppItem={boppItem}
          setBoppItem={setBoppItem}
        />
      </div>

      {/* RIGHT */}
      <div className="sm:w-[30%] w-full mt-6 md:mt-0 space-y-3">
        <Label className="mb-2 block font-semibold">Process Required:</Label>
        {[
          ["printingCheck", "Printing"],
          ["inspection1Check", "Inspection 1"],
          ["laminationCheck", "Lamination"],
          ["inspection2Check", "Inspection 2"],
          ["slittingCheck", "Slitting"],
          ["fabricLaminationCheck", "Fabric Lamination"],
          ["cuttingAndStitchingCheck", "Cutting & Stitching"]
        ].map(([key, label]) => (
          <div className="flex items-center space-x-2" key={key}>
            <Checkbox
              checked={!!boppItem[key as keyof BOPPItemForm]}
              disabled={disabled} // ✅ added
              onCheckedChange={(checked) =>
                setBoppItem((prev) => ({ ...prev, [key as keyof BOPPItemForm]: !!checked }))
              }
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
    {/* Job Description Cards */}
    <div className="w-full overflow-x-auto">
           <table className="hidden md:table w-full border text-sm text-left text-gray-700 dark:text-gray-200">
             
            <tbody className="bg-white dark:bg-gray-900">
           <tr>
             <td className=" p-1" rowSpan={2}>{boppItem.printingCheck && <div className="flex h-full w-full items-center justify-center"><PrintingCard boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/></div>}</td>
             <td className=" p-1">{boppItem.inspection1Check && <div className="flex h-full w-full items-center justify-center"><Inspection1Card boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/></div>}</td>
           </tr>
           <tr>
             <td className=" p-1">{boppItem.laminationCheck && <div className="flex h-full w-full items-center justify-center"><LaminationCard boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/></div>}</td>
           </tr>
           <tr>
             <td className="p-1">{boppItem.inspection2Check && <div className="flex h-full w-full items-center justify-center"><Inspection2Card boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/></div>}</td>
             <td className="p-1">{boppItem.slittingCheck && <div className="flex h-full w-full items-center justify-center"><SlittingCard boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/></div>}</td>
           </tr>
           <tr>
             <td className="p-1">{boppItem.fabricLaminationCheck && <div className="flex h-full w-full items-center justify-center"><FabricLaminationCard boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/></div>}</td>
             <td className="p-1">{boppItem.cuttingAndStitchingCheck && <div className="flex h-full w-full items-center justify-center"><CuttingAndStitchingCard boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/></div>}</td>
           </tr>
         </tbody>
         
           </table>

           {/* Mobile View */}
           <div className="md:hidden space-y-4">
             {boppItem.printingCheck && <PrintingCard  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/>}
             {boppItem.inspection1Check && <Inspection1Card  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/>}
             {boppItem.laminationCheck && <LaminationCard  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/>}
             {boppItem.inspection2Check && <Inspection2Card  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/>}
             {boppItem.slittingCheck && <SlittingCard  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/>}
             {boppItem.fabricLaminationCheck && <FabricLaminationCard  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} disabled={disabled}/>}
             {boppItem.cuttingAndStitchingCheck && <CuttingAndStitchingCard  boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions}/>}
           </div>
         </div>
  </>);
};



