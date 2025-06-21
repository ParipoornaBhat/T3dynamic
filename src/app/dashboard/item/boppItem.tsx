"use client";
import { useState } from "react"
import { motion } from "framer-motion"
import { api } from "@/trpc/react"
import {type BOPPItemForm, type YN,type SelectedCustomer} from "@/types/bopp"; // update the path based on your project
import { Button } from "@/app/_components/ui/button"

import { Card, CardContent } from "@/app/_components/ui/card"
import { toast } from "sonner"
import {
  Search_Div,
Image_Checkbox_AllFields,
} from "./FormFields";

const BOPPItem = () => {
  const defaultBOPPItem: BOPPItemForm = {
  id: "",
  name: "",
  banner:"",
  type: "BOPP",
  description: "",
  billingName: "",
  brand: "",
  address: "",
  GMS: "",

  printingCheck: true,
  inspection1Check: true,
  laminationCheck: true,
  inspection2Check: true,
  slittingCheck: true,
  fabricLaminationCheck: true,
  cuttingAndStitchingCheck: true,

  printing_SizexMic: "",
  printing_MaterialType: "",
  printing_Cylinder: "",
  printing_CylinderDirection: "",
  printing_NoOfColours: undefined, // Int?
  printing_Colours: "",
  printing_Remarks: "",

  inspection1_Remarks: "",

  lamination_SizexMic: "",
  lamination_Type: "",
  lamination_Remarks: "",

  inspection2_Remarks: "",

  slitting_Remarks: "",

  fabricLamination_Size: "",
  fabricLamination_MaterialType: "",
  fabricLamination_Sides: "",
  fabricLamination_Trimming: undefined, // YN?
  fabricLamination_Remarks: "",

  cuttingAndStitching_Type: "",
  cuttingAndStitching_Stitching: undefined, // YN?
  cuttingAndStitching_Perforation: undefined, // YN?
  cuttingAndStitching_ThreadColour: "",
  cuttingAndStitching_HandleType: "",
  cuttingAndStitching_HandleColour: "",
  cuttingAndStitching_Packing: undefined, // YN?
  cuttingAndStitching_Remarks: "",

  documentUrl: [],
  itemImagesUrls: [],

  userName:"",
  userId: "",
  customerId: "",
};
function validateBoppItem(item: BOPPItemForm): boolean {
  // Global required fields
  const requiredBaseFields: { key: keyof BOPPItemForm; label: string }[] = [
    { key: "name", label: "Item Name" },
    { key: "billingName", label: "Billing Name" },
    { key: "brand", label: "Brand" },
    { key: "address", label: "Address" },
    { key: "userId", label: "User ID" },
    { key: "userName", label: "User Name" },
    { key: "customerId", label: "Customer ID" },
  ];

  for (const { key, label } of requiredBaseFields) {
    const value = item[key];
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      toast.error(`${label} is required`);
      return false;
    }
  }

  // Conditional process sections
  const conditionalChecks = [
    {
      check: item.printingCheck,
      labelPrefix: "Printing",
      fields: [
        "printing_SizexMic",
        "printing_MaterialType",
        "printing_Cylinder",
        "printing_CylinderDirection",
        "printing_NoOfColours",
        "printing_Colours",
      ],
    },
    {
      check: item.laminationCheck,
      labelPrefix: "Lamination",
      fields: ["lamination_SizexMic", "lamination_Type"],
    },
    {
      check: item.cuttingAndStitchingCheck,
      labelPrefix: "Cutting & Stitching",
      fields: [
        "cuttingAndStitching_Type",
        "cuttingAndStitching_Stitching",
        "cuttingAndStitching_Perforation",
        "cuttingAndStitching_ThreadColour",
        "cuttingAndStitching_HandleType",
        "cuttingAndStitching_HandleColour",
        "cuttingAndStitching_Packing",
      ],
    },
    {
      check: item.fabricLaminationCheck,
      labelPrefix: "Fabric Lamination",
      fields: [
        "fabricLamination_Size",
        "fabricLamination_MaterialType",
        "fabricLamination_Sides",
        "fabricLamination_Trimming",
      ],
    },
    {
      check: item.inspection1Check,
      labelPrefix: "Inspection 1",
      fields: [], // only remarks = optional
    },
    {
      check: item.inspection2Check,
      labelPrefix: "Inspection 2",
      fields: [], // only remarks = optional
    },
    {
      check: item.slittingCheck,
      labelPrefix: "Slitting",
      fields: [], // only remarks = optional
    },
  ];

  for (const step of conditionalChecks) {
    if (!step.check) continue;

    for (const field of step.fields) {
      const value = (item as any)[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        const fieldName = field.replace(/_/g, " ");
        toast.error(`${step.labelPrefix}: ${fieldName} is required`);
        return false;
      }
    }
  }

  return true; // ✅ all good
}
const [boppItem, setBoppItem] = useState<BOPPItemForm>(defaultBOPPItem);
const defaultSelectedCustomer: SelectedCustomer = {
  userId: "",
  userName: "",
  customerId: "",
  companyBilling: [],
  brands: [],
  addresses: [],
  totalItemsBOPP: 0,
  totalItemsPET: 0,
};

const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer>(defaultSelectedCustomer);
  const [images, setImages] = useState<File[]>([]);
const { data: formOptions } = api.formField.getAll.useQuery();
const getOptions = (fieldName: string) => {
  return formOptions?.find((f) => f.name === fieldName)?.options || [];
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
const createBoppItem = api.boppItem.create.useMutation();

const handleSubmit = async () => {
  if (!validateBoppItem(boppItem)) return;
  try {
    // Ensure item ID exists (you can make this smarter if needed)
    const itemId = `ITM-${(selectedCustomer.totalItemsBOPP)+1}-${boppItem.userId}` || `ITM-${Date.now()}`;
    const updatedBoppItem = { ...boppItem, id: itemId };
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    const uploadRes = await fetch(`/api/uploadImages?itemId=${itemId}`, {
      method: "POST",
      body: formData,
    });

    const { urls } = await uploadRes.json();
    if (!uploadRes.ok) throw new Error("Image upload failed");

    // Save to DB
    await createBoppItem.mutateAsync({
      ...updatedBoppItem,
      itemImagesUrls: urls,
    });

    toast.success("Item created successfully!");
    setBoppItem(defaultBOPPItem);
    setImages([]);
    setSelectedCustomer(defaultSelectedCustomer);
  } catch (err) {
    toast.error("Error saving item. ");
    console.error(err);
  }
};

  return (<>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full rounded-lg shadow-xl border border-white/10 dark:border-white/10 bg-transparent bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <Card className="h-full  shadow-xl border border-white/10 dark:border-white/10 bg-transparent">
<CardContent className="h-full flex flex-col gap-6 px-4 pb-10 pt-4 text-base">
  {/* Select customer ,*/}
<Search_Div boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />
<motion.div variants={itemVariants} className="w-full ">
{selectedCustomer.userId && (
<div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
    {/* Responsive Row */}
   <Image_Checkbox_AllFields boppItem={boppItem} setBoppItem={setBoppItem} getOptions={getOptions} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} images={images} setImages={setImages}/>
  <hr className="mx-auto w-[80%] border-t border-gray-300 dark:border-gray-700" />
{/* save button*/}
<div className="w-full flex justify-center mt-6">
  <Button
    onClick={handleSubmit}
    className="px-6 py-2 rounded-md text-white font-medium shadow-md 
      bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
      hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700
      dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 
      dark:hover:from-blue-600 dark:hover:via-indigo-600 dark:hover:to-purple-600
      transition-all duration-300"
  >
    Save BOPP Item
  </Button>
</div>

   </div>
)}
</motion.div>
  <hr className="mx-auto w-[80%] border-t border-gray-300 dark:border-gray-700" />
</CardContent>
      </Card>
    </motion.div>
  </>)
}

export default BOPPItem