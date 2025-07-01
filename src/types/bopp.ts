export type YN = "YES" | "NO";

export type BOPPItemForm = {
  id: string;
  name: string;
  type: string;
  banner?: string;
  description?: string;
  billingName?: string;
  brand?: string;
  address?: string;
  GMS?: string;

  printingCheck: boolean;
  inspection1Check: boolean;
  laminationCheck: boolean;
  inspection2Check: boolean;
  slittingCheck: boolean;
  fabricLaminationCheck: boolean;
  cuttingAndStitchingCheck: boolean;

  printing_SizexMic?: string;
  printing_MaterialType?: string;
  printing_Cylinder?: string;
  printing_CylinderDirection?: string;
  printing_NoOfColours?: number;
  printing_Colours?: string;
  printing_Remarks?: string;

  inspection1_Remarks?: string;

  lamination_SizexMic?: string;
  lamination_Type?: string;
  lamination_Remarks?: string;

  inspection2_Remarks?: string;

  slitting_Remarks?: string;

  fabricLamination_Size?: string;
  fabricLamination_MaterialType?: string;
  fabricLamination_Sides?: string;
  fabricLamination_Trimming?: YN;
  fabricLamination_Remarks?: string;

  cuttingAndStitching_Type?: string;
  cuttingAndStitching_Stitching?: YN;
  cuttingAndStitching_Perforation?: YN;
  cuttingAndStitching_ThreadColour?: string;
  cuttingAndStitching_HandleType?: string;
  cuttingAndStitching_HandleColour?: string;
  cuttingAndStitching_Packing?: YN;
  cuttingAndStitching_Remarks?: string;

  documentUrl: string[];
  itemImagesUrls: string[];
  createdAt?: Date;
  updatedAt?: Date;

  userName: string;
  userId: string;
  customerId: string;
};

export type SelectedCustomer = {
  userName: string;
  userId: string;
  customerId: string;
  companyBilling: string[];
  brands: string[];
  addresses: string[];
  totalItemsBOPP: number;
  totalItemsPET: number;
};