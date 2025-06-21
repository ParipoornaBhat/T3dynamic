import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { permissionMiddleware } from "@/server/api/middleware/permissions";


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
        cuttingAndStitching_Stiching: z.enum(["YES", "NO"]).optional(),
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
      const newItem = await ctx.db.bOPPItem.create({
        data: {
          ...input,
        },
      });
      return newItem;
    }),
});
