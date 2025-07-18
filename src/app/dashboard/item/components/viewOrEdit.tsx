
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {DownloadPDFButton} from "@/app/dashboard/item/components/boppDoc"
import { api } from "@/trpc/react";
import { type BOPPItemForm, type SelectedCustomer } from "@/types/bopp";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { toast } from "sonner";
import {
  Search_Div,
  Image_Checkbox_AllFields,
} from "@/app/dashboard/item/components/VECompo";
import { Component, Pencil, X } from "lucide-react";
import { ComponentLoading } from "@/app/_components/component-loading";



const ItemViewEdit = ({ itemId }: { itemId: string }) => {
 const { data: defaultBOPPItem, isLoading } = api.boppItem.getAnyBoppItemDetail2.useQuery({ itemId });

    // Initialize empty item structure
const emptyBoppItem: BOPPItemForm = {
  id: "",
  name: "",
  banner: "",
  type: "BOPP", // Default value
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
  printing_NoOfColours: undefined,
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
  fabricLamination_Trimming: undefined,
  fabricLamination_Remarks: "",

  cuttingAndStitching_Type: "",
  cuttingAndStitching_Stitching: undefined,
  cuttingAndStitching_Perforation: undefined,
  cuttingAndStitching_ThreadColour: "",
  cuttingAndStitching_HandleType: "",
  cuttingAndStitching_HandleColour: "",
  cuttingAndStitching_Packing: undefined,
  cuttingAndStitching_Remarks: "",

  documentUrl: [],
  itemImagesUrls: [],

  userName: "",
  userId: "",
  customerId: "",
};
    const [boppItem, setBoppItem] = useState<BOPPItemForm>(emptyBoppItem);
    const [originalItem, setOriginalItem] = useState<BOPPItemForm>(emptyBoppItem);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer>({
    userId: "",
    userName: "",
    customerId: "",
    companyBilling: [],
    brands: [],
    addresses: [],
    totalItemsBOPP: 0,
    totalItemsPET: 0,
  });
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
// Once data arrives, override it
useEffect(() => {
  if (defaultBOPPItem) {
    const cleaned = normalizeBoppItem(defaultBOPPItem);
    setBoppItem(cleaned);
    setOriginalItem(cleaned);
    setExistingImageUrls(cleaned.itemImagesUrls);
  }
}, [defaultBOPPItem]);


  const [editMode, setEditMode] = useState(false); //new: toggle edit
  const [confirming, setConfirming] = useState(false); //new: confirm save step



  const [images, setImages] = useState<File[]>([]); //new: track new uploads

  const { data: formOptions } = api.formField.getAll.useQuery();
  const getOptions = (fieldName: string) => {
    return formOptions?.find((f) => f.name === fieldName)?.options || [];
  };

  useEffect(() => {
    if (defaultBOPPItem && !boppItem) {
      setBoppItem(defaultBOPPItem);
      setOriginalItem(defaultBOPPItem);
      setExistingImageUrls(defaultBOPPItem.itemImagesUrls);
    }
  }, [defaultBOPPItem]);

  const handleToggleEdit = () => {
    if (editMode) {
      setBoppItem(originalItem);
      setImages([]);
      setExistingImageUrls(originalItem?.itemImagesUrls || []);
    }
    setEditMode(!editMode);
    setConfirming(false);
  };

const getChangedFields = () => {
  if (!originalItem || !boppItem) return { changed: [], removedImages: [], addedImages: [], orderChanges: [] };

  const changed: { field: string; oldValue: any; newValue: any }[] = [];

  for (const key in originalItem) {
    if (key === "itemImagesUrls") continue; // ✅ skip full array diff here

    const origVal = (originalItem as any)[key];
    const newVal = (boppItem as any)[key];

    if (JSON.stringify(origVal) !== JSON.stringify(newVal)) {
      changed.push({
        field: key,
        oldValue: origVal,
        newValue: newVal,
      });
    }
  }

  const extractNameFromUrl = (url: string) =>
    url.split("/").pop() || url; // ✅ retain .avif extension

  const removedImages = originalItem.itemImagesUrls
    .filter((url) => !boppItem.itemImagesUrls.includes(url))
    .map((url) => `${extractNameFromUrl(url)} removed`);

  const addedImages: string[] = boppItem.itemImagesUrls
    .map((url, idx) => {
      if (!originalItem.itemImagesUrls.includes(url)) {
        return `${extractNameFromUrl(url)} added at position ${idx + 1}`;
      }
      return null;
    })
    .filter(Boolean) as string[];

  const orderChanges: string[] = [];
  originalItem.itemImagesUrls.forEach((url) => {
    const newIndex = boppItem.itemImagesUrls.indexOf(url);
    const oldIndex = originalItem.itemImagesUrls.indexOf(url);
    if (newIndex !== -1 && newIndex !== oldIndex) {
      orderChanges.push(
        `${extractNameFromUrl(url)} moved from position ${oldIndex + 1} to ${newIndex + 1}`
      );
    }
  });

  images.forEach((file) => {
    addedImages.push(`${file.name} added`);
  });

  return { changed, removedImages, addedImages, orderChanges };
};




const normalizeBoppItem = (input: Partial<BOPPItemForm>): BOPPItemForm => {
  const result = { ...emptyBoppItem };

  for (const key in emptyBoppItem) {
    const value = (input as any)[key];
    // If backend returned null, replace with undefined
    (result as any)[key] = value === null ? undefined : value ?? (emptyBoppItem as any)[key];
  }

  return result;
};

const saveMutation = api.boppItem.saveAnyBoppItemDetail.useMutation({
  onMutate: () => {
    toast.loading("Saving changes...", { id: "save-toast" });
  },
  onSuccess: (data) => {
    toast.success("Changes saved successfully.", { id: "save-toast" });

    const cleaned = normalizeBoppItem(data.updated as any);
    
    setOriginalItem(cleaned);
    setBoppItem(cleaned);
    setEditMode(false);
    setConfirming(false);
    setImages([]);
    setExistingImageUrls(cleaned.itemImagesUrls);
  },
  onError: (error) => {
    console.error("Mutation error:", error);
    toast.error("Failed to save changes.", { id: "save-toast" });
  },
});
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
const handleConfirmSave = async () => {
  if (!boppItem || !originalItem) return;

  const isValid = validateBoppItem(boppItem);
  if (!isValid) return;

  try {
    const itemId = boppItem.id;
    let newUploadedUrls: string[] = [];

    // 1️⃣ Show loading toast for deletion
    const deleteToastId = toast.loading("Deleting removed images from Cloudinary...");

    // Identify removed images
    const removedImages = originalItem.itemImagesUrls.filter(
      (url) => !boppItem.itemImagesUrls.includes(url)
    );

    // Extract publicId from each URL assuming the format: https://.../upload/v.../<publicId>.jpg
    const extractPublicId = (url: string) => {
      const parts = url.split("/");
      const filename = parts[parts.length - 1];
      return filename?.split(".")[0] || "";
    };

    const removedPublicIds = removedImages.map(extractPublicId).filter(Boolean);

    if (removedPublicIds.length > 0) {
      const deleteRes = await fetch("/api/uploadImages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicIds: removedPublicIds }),
      });

      if (!deleteRes.ok) {
        toast.dismiss(deleteToastId);
        toast.error("❌ Failed to delete old images");
        return;
      }

      toast.success("✅ Old images deleted", { id: deleteToastId });
    } else {
      toast.dismiss(deleteToastId);
    }

    // 2️⃣ Upload new images if any
    if (images.length > 0) {
      const uploadToastId = toast.loading("Uploading new images...");

      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));

      const uploadRes = await fetch(`/api/uploadImages?itemId=${itemId}`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        toast.dismiss(uploadToastId);
        toast.error("❌ Image upload failed");
        return;
      }

      const data = await uploadRes.json();
      newUploadedUrls = data.urls;

      toast.success("✅ New images uploaded", { id: uploadToastId });
    }

    // 3️⃣ Save updated item
    const finalItemImages = [...boppItem.itemImagesUrls, ...newUploadedUrls];

    const finalPayload = {
      ...boppItem,
      itemImagesUrls: finalItemImages,
    };

    const saveToastId = toast.loading("Saving item...");

    await saveMutation.mutateAsync({ itemId, data: finalPayload });

    toast.success("✅ Item saved!", { id: saveToastId });
  } catch (err) {
    console.error("Save error", err);
    toast.error("❌ Error saving item");
  }
};








  const { changed, removedImages, addedImages, orderChanges } = getChangedFields();




    if (isLoading ) return <ComponentLoading message="Loading item details..." />;


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full rounded-lg shadow-xl border border-white/10 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <Card>
        <CardContent className="h-full flex flex-col gap-6 px-4 pb-10 pt-4 text-base">
            <div className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-black/10 flex justify-between items-center py-2 px-2 border-b shadow-sm">
                <h2 className="text-xl font-semibold">View/Edit BOPP Item</h2>
                <div className="flex gap-2">
                <DownloadPDFButton itemId={itemId} menu={false} />
                {!editMode ? (
                    <Button variant="outline" onClick={handleToggleEdit}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={handleToggleEdit}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                )}
                </div>
            </div>
            <Search_Div
            boppItem={boppItem}
            setBoppItem={setBoppItem}
            getOptions={getOptions}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            disabled={!editMode} //new: toggle inputs
            defaultSelectedCustomer={defaultSelectedCustomer}
          />

          <Image_Checkbox_AllFields
            boppItem={boppItem}
            setBoppItem={setBoppItem}
            getOptions={getOptions}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            images={images}
            setImages={setImages}
            existingImageUrls={existingImageUrls}
            setExistingImageUrls={setExistingImageUrls}
            disabled={!editMode} //new: toggle image inputs
          />


          {editMode && (
            <div className="flex justify-center mt-6">
              {!confirming ? (
                <Button onClick={() => setConfirming(true)}>
                  Save Changes
                </Button>
              ) : (
               <div className="text-center space-y-4">
  <div className="text-sm">
    <strong>Changes:</strong>
    <ul className="text-left">
      {changed.map((f) => (
        <li key={f.field}>
          <span className="font-medium">{f.field}:</span>{" "}
          <span className="line-through text-red-500">{String(f.oldValue)}</span>{" "}
          <span className="text-green-600">→ {String(f.newValue)}</span>
        </li>
      ))}

      {/* Only show if image changes exist */}
      {[...removedImages, ...addedImages, ...orderChanges].length > 0 && (
        <>
          <li className="mt-2 font-medium">Image Changes:</li>
          {removedImages.map((line, i) => (
            <li key={`removed-${i}`} className="text-red-500">{line}</li>
          ))}
          {addedImages.map((line, i) => (
            <li key={`added-${i}`} className="text-green-600">{line}</li>
          ))}
          {orderChanges.map((line, i) => (
            <li key={`moved-${i}`} className="text-yellow-600">{line}</li>
          ))}
        </>
      )}
    </ul>
  </div>
  <div className="flex gap-4 justify-center">
    <Button onClick={handleConfirmSave}>Confirm Save</Button>
    <Button variant="outline" onClick={() => setConfirming(false)}>Cancel</Button>
  </div>
</div>

              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ItemViewEdit;
