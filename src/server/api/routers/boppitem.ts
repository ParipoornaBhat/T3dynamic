import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { permissionMiddleware } from "@/server/api/middleware/permissions";
import { v2 as cloudinary } from "cloudinary";
import type { YN } from "@/types/bopp";
const searchItemsInput = z.object({
  search: z.string().optional(),
  type: z.enum(["BOPP", "PET"]).optional(), // Which model to query
  finish: z.string().optional(), // Optional future support
  sortBy: z.enum(["name", "customer", "date"]),
  sortDirection: z.enum(["asc", "desc"]),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const boppItemRouter = createTRPCRouter({
  create: protectedProcedure
  //.use(permissionMiddleware)
  .input(
    z.object({
      name: z.string().min(1),
      type: z.string().default("BOPP").optional(),
      description: z.string().optional(),
      billingName: z.string().optional(),
      brand: z.string().optional(),
      address: z.string().optional(),
      GMS: z.string().optional(),

      printingCheck: z.boolean(),
      inspection1Check: z.boolean(),
      laminationCheck: z.boolean(),
      inspection2Check: z.boolean(),
      slittingCheck: z.boolean(),
      fabricLaminationCheck: z.boolean(),
      cuttingAndStitchingCheck: z.boolean(),

      printing_SizexMic: z.string().optional(),
      printing_MaterialType: z.string().optional(),
      printing_Cylinder: z.string().optional(),
      printing_CylinderDirection: z.string().optional(),
      printing_NoOfColours: z.number().optional(),
      printing_Colours: z.string().optional(),
      printing_Remarks: z.string().optional(),

      inspection1_Remarks: z.string().optional(),
      lamination_SizexMic: z.string().optional(),
      lamination_Type: z.string().optional(),
      lamination_Remarks: z.string().optional(),
      inspection2_Remarks: z.string().optional(),
      slitting_Remarks: z.string().optional(),

      fabricLamination_Size: z.string().optional(),
      fabricLamination_MaterialType: z.string().optional(),
      fabricLamination_Sides: z.string().optional(),
      fabricLamination_Trimming: z.enum(["YES", "NO"]).optional(),
      fabricLamination_Remarks: z.string().optional(),

      cuttingAndStitching_Type: z.string().optional(),
      cuttingAndStitching_Stitching: z.enum(["YES", "NO"]).optional(),
      cuttingAndStitching_Perforation: z.enum(["YES", "NO"]).optional(),
      cuttingAndStitching_ThreadColour: z.string().optional(),
      cuttingAndStitching_HandleType: z.string().optional(),
      cuttingAndStitching_HandleColour: z.string().optional(),
      cuttingAndStitching_Packing: z.enum(["YES", "NO"]).optional(),
      cuttingAndStitching_Remarks: z.string().optional(),

      documentUrl: z.array(z.string()).default([]),
      itemImagesUrls: z.array(z.string()).default([]),

      userId: z.string(),
      userName: z.string(),
      customerId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
  const { customerId } = input;
    console.log("Creating BOPP item with input:", input);
  const customer = await ctx.db.customer.findUnique({
    where: { id: customerId },
    select: { totalItemsBOPP: true },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const newCount = (customer.totalItemsBOPP ?? 0) + 1;
  const itemId = `BOPP-${String(newCount).padStart(3, "0")}-${input.userId}`;

  // 1. Create the item

  const newItem = await ctx.db.bOPPItem.create({
    data: {
      ...input,
      id: itemId,
    },
  });

  // 2. Update the customer count
  await ctx.db.customer.update({
    where: { id: customerId },
    data: {
      totalItemsBOPP: newCount,
    },
  });
  console.log("image url",newItem.itemImagesUrls);
  
  console.log("document url",newItem);
  // 4. Return the final item (with document URL)
  return {
    newItem
  };
}),



searchItems: protectedProcedure
  .input(searchItemsInput)
  .query(async ({ ctx, input }) => {
    const {
      search,
      type = "BOPP",
      sortBy,
      sortDirection,
      page,
      limit,
    } = input;

    const whereClause: any = {};

    if (search?.trim()) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { userName: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;

    if (type === "PET") {
      const totalCount = await ctx.db.pETItem.count({ where: whereClause });

      const items = await ctx.db.pETItem.findMany({
        where: whereClause,
        orderBy:
          sortBy === "customer"
            ? { userName:sortDirection  }
            : sortBy === "date"
            ? { createdAt: sortDirection }
            : { name: sortDirection },
        skip,
        take: limit,
        include: { customer: true },
      });

      return {
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          description: item.description ?? "",
          imageUrl: item.itemImagesUrls?.[0] ?? null,
          printing_CylinderDirection: item.printing_CylinderDirection ?? "",
          customerName: item.userName,
          banner: item.banner ?? null,
          createdDate: item.createdAt.toLocaleDateString("en-IN"),
        })),
        totalPages: Math.ceil(totalCount / limit),
      };
    } else {
      const totalCount = await ctx.db.bOPPItem.count({ where: whereClause });

      const items = await ctx.db.bOPPItem.findMany({
        where: whereClause,
        orderBy:
          sortBy === "customer"
            ? { userName: sortDirection  }
            : sortBy === "date"
            ? { createdAt: sortDirection }
            : { name: sortDirection },
        skip,
        take: limit,
        include: { customer: true },
      });

      return {
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          description: item.description ?? "",
          banner: item.banner ?? null,
          printing_CylinderDirection: item.printing_CylinderDirection ?? "",
          imageUrl: item.itemImagesUrls?.[0] ?? null,
          customerName: item.userName,
          createdDate: item.createdAt.toLocaleDateString("en-IN"),
        })),
        totalPages: Math.ceil(totalCount / limit),
      };
    }
  }),


delete: protectedProcedure
  .input(z.object({ itemId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { itemId } = input;

    const item = await ctx.db.bOPPItem.findUnique({
      where: { id: itemId },
      select: { customerId: true, itemImagesUrls: true },
    });

    if (!item) throw new Error("Item not found");

    const customer = await ctx.db.customer.findUnique({
      where: { id: item.customerId },
      select: { totalItemsBOPP: true },
    });

    if (!customer) throw new Error("Customer not found");

    const currentNumber = parseInt(itemId.split("-")[1] || "0", 10);
    const latestNumber = customer.totalItemsBOPP ?? 0;

    if (currentNumber !== latestNumber) {
      throw new Error(
        `Only the latest item can be deleted (BOPP-${String(latestNumber).padStart(3, "0")})`
      );
    }

    // 🧹 Step 1: Delete images from Cloudinary
    if (item.itemImagesUrls && item.itemImagesUrls.length > 0) {
      const publicIds = item.itemImagesUrls
        .map((url) => {
          const match = url.match(/\/bopp-items\/([^./]+)(?:\.[a-z]+)?$/);
          return match ? `bopp-items/${match[1]}` : null;
        })
        .filter((id): id is string => !!id);

      if (publicIds.length > 0) {
        try {
          await cloudinary.api.delete_resources(publicIds);
        } catch (err) {
          console.error("⚠️ Error deleting Cloudinary images:", err);
          // You can choose to throw here or log and continue
        }
      }
    }

    // Step 2: Delete the item
    await ctx.db.bOPPItem.delete({
      where: { id: itemId },
    });

    // Step 3: Decrement count
    await ctx.db.customer.update({
      where: { id: item.customerId },
      data: {
        totalItemsBOPP: latestNumber - 1,
      },
    });

    return { success: true, message: `Item ${itemId} deleted successfully` };
  }),

getAnyBoppItemDetail: protectedProcedure
  .input(
    z.object({
      itemId: z.string().min(1),
    })
  )
  .query(async ({ ctx, input }) => {
    const { itemId } = input

    const item = await ctx.db.bOPPItem.findUnique({
      where: { id: itemId },
    })

    if (!item) throw new Error("Item not found")

   return {
  id: item.id,
  name: item.name,
  type: item.type ?? "BOPP",
  banner: item.banner ?? null,
  description: item.description ?? "",
  billingName: item.billingName ?? "",
  brand: item.brand ?? "",
  address: item.address ?? "",
  GMS: item.GMS ?? "",

  printingCheck: item.printingCheck ?? false,
  inspection1Check: item.inspection1Check ?? false,
  laminationCheck: item.laminationCheck ?? false,
  inspection2Check: item.inspection2Check ?? false,
  slittingCheck: item.slittingCheck ?? false,
  fabricLaminationCheck: item.fabricLaminationCheck ?? false,
  cuttingAndStitchingCheck: item.cuttingAndStitchingCheck ?? false,

  printing_SizexMic: item.printing_SizexMic ?? "",
  printing_MaterialType: item.printing_MaterialType ?? "",
  printing_Cylinder: item.printing_Cylinder ?? "",
  printing_CylinderDirection: item.printing_CylinderDirection ?? "",
  printing_NoOfColours: item.printing_NoOfColours ?? 0,
  printing_Colours: item.printing_Colours ?? "",
  printing_Remarks: item.printing_Remarks ?? "",

  inspection1_Remarks: item.inspection1_Remarks ?? "",

  lamination_SizexMic: item.lamination_SizexMic ?? "",
  lamination_Type: item.lamination_Type ?? "",
  lamination_Remarks: item.lamination_Remarks ?? "",

  inspection2_Remarks: item.inspection2_Remarks ?? "",

  slitting_Remarks: item.slitting_Remarks ?? "",

  fabricLamination_Size: item.fabricLamination_Size ?? "",
  fabricLamination_MaterialType: item.fabricLamination_MaterialType ?? "",
  fabricLamination_Sides: item.fabricLamination_Sides ?? "",
  fabricLamination_Trimming: item.fabricLamination_Trimming as YN ?? undefined,
  fabricLamination_Remarks: item.fabricLamination_Remarks ?? "",

  cuttingAndStitching_Type: item.cuttingAndStitching_Type ?? "",
  cuttingAndStitching_Stitching: item.cuttingAndStitching_Stitching as YN ?? undefined,
  cuttingAndStitching_Perforation: item.cuttingAndStitching_Perforation as YN ?? undefined,
  cuttingAndStitching_ThreadColour: item.cuttingAndStitching_ThreadColour ?? "",
  cuttingAndStitching_HandleType: item.cuttingAndStitching_HandleType ?? "",
  cuttingAndStitching_HandleColour: item.cuttingAndStitching_HandleColour ?? "",
  cuttingAndStitching_Packing: item.cuttingAndStitching_Packing as YN ?? undefined,
  cuttingAndStitching_Remarks: item.cuttingAndStitching_Remarks ?? "",

  documentUrl: item.documentUrl ?? [],
  itemImagesUrls: item.itemImagesUrls ?? [],

  createdAt: item.createdAt,
  updatedAt: item.updatedAt,

  userName: item.userName ?? "",
  userId: item.userId ?? "",
  customerId: item.customerId ?? "",
}


  }),

    // Get single item details
  getAnyBoppItemDetail2: protectedProcedure
    .input(z.object({ itemId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { itemId } = input;
      const item = await ctx.db.bOPPItem.findUnique({ where: { id: itemId } });
      if (!item) throw new Error("Item not found");
      return {
        id: item.id,
        name: item.name,
        banner: item.banner ?? "",
        type: item.type ?? "BOPP",
        description: item.description ?? "",
        billingName: item.billingName ?? "",
        brand: item.brand ?? "",
        address: item.address ?? "",
        GMS: item.GMS ?? "",

        printingCheck: item.printingCheck ?? true,
        inspection1Check: item.inspection1Check ?? true,
        laminationCheck: item.laminationCheck ?? true,
        inspection2Check: item.inspection2Check ?? true,
        slittingCheck: item.slittingCheck ?? true,
        fabricLaminationCheck: item.fabricLaminationCheck ?? true,
        cuttingAndStitchingCheck: item.cuttingAndStitchingCheck ?? true,

        printing_SizexMic: item.printing_SizexMic ?? "",
        printing_MaterialType: item.printing_MaterialType ?? "",
        printing_Cylinder: item.printing_Cylinder ?? "",
        printing_CylinderDirection: item.printing_CylinderDirection ?? "",
        printing_NoOfColours: item.printing_NoOfColours ?? undefined,
        printing_Colours: item.printing_Colours ?? "",
        printing_Remarks: item.printing_Remarks ?? "",

        inspection1_Remarks: item.inspection1_Remarks ?? "",

        lamination_SizexMic: item.lamination_SizexMic ?? "",
        lamination_Type: item.lamination_Type ?? "",
        lamination_Remarks: item.lamination_Remarks ?? "",

        inspection2_Remarks: item.inspection2_Remarks ?? "",

        slitting_Remarks: item.slitting_Remarks ?? "",

        fabricLamination_Size: item.fabricLamination_Size ?? "",
        fabricLamination_MaterialType: item.fabricLamination_MaterialType ?? "",
        fabricLamination_Sides: item.fabricLamination_Sides ?? "",
        fabricLamination_Trimming: item.fabricLamination_Trimming as YN ?? undefined,
        fabricLamination_Remarks: item.fabricLamination_Remarks ?? "",

        cuttingAndStitching_Type: item.cuttingAndStitching_Type ?? "",
        cuttingAndStitching_Stitching: item.cuttingAndStitching_Stitching as YN ?? undefined,
        cuttingAndStitching_Perforation: item.cuttingAndStitching_Perforation as YN ?? undefined,
        cuttingAndStitching_ThreadColour: item.cuttingAndStitching_ThreadColour ?? "",
        cuttingAndStitching_HandleType: item.cuttingAndStitching_HandleType ?? "",
        cuttingAndStitching_HandleColour: item.cuttingAndStitching_HandleColour ?? "",
        cuttingAndStitching_Packing: item.cuttingAndStitching_Packing as YN ?? undefined,
        cuttingAndStitching_Remarks: item.cuttingAndStitching_Remarks ?? "",

        documentUrl: item.documentUrl ?? [],
        itemImagesUrls: item.itemImagesUrls ?? [],

        userName: item.userName ?? "",
        userId: item.userId ?? "",
        customerId: item.customerId ?? "",
      };
    }),

  // Save edited item
  saveAnyBoppItemDetail: protectedProcedure
    .input(z.object({
      itemId: z.string(),
      data: z.any(), // Use zod type matching your form if available
    }))
    .mutation(async ({ ctx, input }) => {
      const { itemId, data } = input;

      // Handle image changes:
      // Compare existing vs new images
      const existingItem = await ctx.db.bOPPItem.findUnique({ where: { id: itemId } });
      if (!existingItem) throw new Error("Item not found for update");

      const removedCloudImages = existingItem.itemImagesUrls.filter(
        (url) => !data.itemImagesUrls.includes(url)
      );

      const addedFiles = data.itemImagesUrls.filter(
        (url: string) => !existingItem.itemImagesUrls.includes(url)
      );

      // Optional: remove deleted images from Cloudinary here if needed

      const updated = await ctx.db.bOPPItem.update({
        where: { id: itemId },
        data,
      });

      return { updated, addedFiles, removedCloudImages };
    }),

});
