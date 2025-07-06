"use client"

import { DropdownMenuItem } from "@/app/_components/ui/dropdown-menu"
import { toast } from "sonner"
import { api } from "@/trpc/react"
import type { BOPPItemForm } from "@/types/bopp"
import { useEffect } from "react"

interface Props {
  itemId: string
}

export function DownloadPDFButton({ itemId }: Props) {
  const { refetch } = api.boppItem.getAnyBoppItem.useQuery(
    { itemId },
    { enabled: false }
  )

  const handleDownload = async () => {
    const result = await refetch()

    if (result.error || !result.data) {
      toast.error(`Failed to fetch item: ${result.error?.message || "Unknown error"}`)
      return
    }

    const itemData = result.data as BOPPItemForm

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups for this site.")
      return
    }

    const htmlContent = generatePDFHTML(itemData)
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  return (
    <DropdownMenuItem onClick={handleDownload} className="w-full cursor-pointer">
      Download PDF
    </DropdownMenuItem>
  )
}
function generatePDFHTML(itemData: BOPPItemForm): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BOPP Item Specification - ${itemData.id}</title>
<style>
@page { size: A4; margin: 15mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #000; }
.container { width: 100%; max-width: 180mm; margin: 0 auto; border: 2px solid #000; padding: 6px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding-bottom: 2px; border-bottom: 1px solid #000; }
.logo-section { display: flex; align-items: center; font-weight: bold; font-size: 19px; }
.gms-section { text-align: center; border: 1px solid #000; padding: 4px; background: #f0f0f0; min-width: 120px; }
.gms-title { font-size: 12px; font-weight: bold; margin-bottom: 2px; }
.gms-value { font-size: 17px; font-weight: bold; }
.main-content { display: flex; margin-bottom: 6px; }
.left-section { flex: 2; margin-right: 6px; }
.right-section { flex: 1; border: 1px solid #000; background: #f9f9f9; display: flex; align-items: center; justify-content: center; padding: 0; overflow: hidden; }
.right-section img { max-height: 100%; max-width: 100%; object-fit: contain; height: auto; width: auto; }
.image-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; font-size: 15px; color: #666; text-align: center; }
.info-table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
.info-table td { border: 1px solid #000; padding: 2px 4px; vertical-align: top; }
.label { background: #f0f0f0; font-weight: bold; width: 25%; font-size: 12px; }
.value { font-size: 12px; font-weight: bold; }
.job-title { text-align: center; font-size: 21px; font-weight: bold; margin: 8px 0; text-decoration: underline; }
.job-sections { display: flex; flex-direction: column; gap: 6px; }
.job-row { display: flex; gap: 6px; }
.job-row > .job-section { flex: 1; }
.job-section { border: 1px solid #000; }
.section-header { background: #e0e0e0; padding: 2px; font-weight: bold; font-size: 13px; text-align: center; border-bottom: 1px solid #000; }
.section-content { padding: 2px; }
.field-row { display: flex; margin-bottom: 2px; font-size: 11px; }
.field-label { background: #f5f5f5; padding: 1px 2px; border: 1px solid #ccc; font-weight: bold; font-size: 10px; flex: 0 0 120px; }
.field-value { padding: 1px 2px; border: 1px solid #ccc; flex: 1; font-size: 11px; font-weight: bold; }
.remarks { margin-top: 2px; font-size: 10px; }
.remarks-label { font-weight: bold; display: inline; }
.small-section { margin-bottom: 3px; }
.small-section .section-header { font-size: 12px; padding: 1px 2px; }
.small-section .section-content { padding: 1px; }
</style>




</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-section">
        <div class="logo-wrapper">
          <img src="/d_l.png" alt="Logo" style="width: auto; height: 80px; object-fit: contain;" />
        </div>
      </div>
      <div class="gms-section">
        <div class="gms-title">GMS (PACKAGE<br>CAPACITY)</div>
        <div class="gms-value">${itemData.GMS}</div>
      </div>
    </div>

    <div class="main-content">
  <div class="left-section">
    <table class="info-table">
      <tr><td class="label">Item Name</td><td class="value">${itemData.name}</td></tr>
      <tr><td class="label">Item Id</td><td class="value">${itemData.id}</td></tr>
      <tr><td class="label">Type</td><td class="value">BOPP</td></tr>
<tr>
  <td class="label">Description</td>
  <td class="value">
    ${itemData.description}<br />
    <small>
      Created At: ${itemData.createdAt
        ? new Date(itemData.createdAt).toLocaleString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          })
        : "N/A"}
    </small><br />
    <small>
      Updated At: ${itemData.updatedAt
        ? new Date(itemData.updatedAt).toLocaleString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          })
        : "N/A"}
    </small>
  </td>
</tr>
      <tr><td class="label">Customer Name</td><td class="value">${itemData.billingName}</td></tr>
      <tr><td class="label">Brand Name</td><td class="value">${itemData.brand}</td></tr>
      <tr><td class="label">Address</td><td class="value">${itemData.address}</td></tr>
    </table>
  </div>
  <div class="right-section">
    ${
      itemData.itemImagesUrls.length > 0
        ? `<img src="${itemData.itemImagesUrls[0]}" />`
        : `<div class="image-placeholder">[Image]</div>`
    }
  </div>
</div>


    <div class="job-title">JOB DESCRIPTION</div>
    <div class="job-sections">
      <!-- Row 1 -->
      <div class="job-row">
        ${generateSection("PRINTING DEPARTMENT (PRT)", [
          { label: "SizexMic", value: itemData.printing_SizexMic ?? "" },
          { label: "Material Type", value: itemData.printing_MaterialType ?? "" },
          { label: "Cylinder", value: itemData.printing_Cylinder ?? "" },
          { label: "Cylinder Direction", value: itemData.printing_CylinderDirection ?? "" },
          { label: "No. Of Colour", value: itemData.printing_NoOfColours?.toString() ?? "" },
          { label: "Colours Name", value: itemData.printing_Colours ?? "" },
        ], itemData.printing_Remarks)}

        <div class="job-section">
          <div class="small-section">
            <div class="section-header">INSPECTION 1</div>
            <div class="section-content">
              <div class="remarks"><span class="remarks-label">Remarks:</span> ${itemData.inspection1_Remarks || ""}</div>
            </div>
          </div>
          <div class="small-section">
            <div class="section-header">LAMINATION (LAM)</div>
            <div class="section-content">
              ${generateFieldRows([
                { label: "SizexMic", value: itemData.lamination_SizexMic ?? "" },
                { label: "Lamination Type", value: itemData.lamination_Type ?? "" }
              ])}
              <div class="remarks"><span class="remarks-label">Remarks:</span> ${itemData.lamination_Remarks || ""}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="job-row">
        ${generateSmallSection("SLITTING", itemData.slitting_Remarks)}
        ${generateSmallSection("INSPECTION 2", itemData.inspection2_Remarks)}
      </div>

      <!-- Row 3 -->
      <div class="job-row">
        ${generateSection("FABRIC LAMINATION", [
          { label: "Size", value: itemData.fabricLamination_Size ?? "" },
          { label: "Material type", value: itemData.fabricLamination_MaterialType ?? "" },
          { label: "Sides", value: itemData.fabricLamination_Sides ?? "" },
          { label: "Trimming", value: itemData.fabricLamination_Trimming ?? "" }
        ], itemData.fabricLamination_Remarks)}

        ${generateSection("CUTTING AND STITCHING", [
          { label: "Type", value: itemData.cuttingAndStitching_Type ?? "" },
          { label: "Stitching", value: itemData.cuttingAndStitching_Stitching ?? "" },
          { label: "Perforation", value: itemData.cuttingAndStitching_Perforation ?? "" },
          { label: "Thread colour", value: itemData.cuttingAndStitching_ThreadColour ?? "" },
          { label: "Handle Type", value: itemData.cuttingAndStitching_HandleType ?? "" },
          { label: "Handle Colour", value: itemData.cuttingAndStitching_HandleColour ?? "" },
          { label: "Packing", value: itemData.cuttingAndStitching_Packing ?? "" }
        ], itemData.cuttingAndStitching_Remarks)}
      </div>
    </div>
  </div>
  <script>
  window.addEventListener("load", function () {
    const table = document.querySelector(".left-section .info-table");
    const right = document.querySelector(".right-section");
    if (table && right) {
      const tableHeight = table.offsetHeight;
      right.style.maxHeight = tableHeight + "px";
    }
  });
</script>



</body>
</html>`;
}

function generateSection(
  title: string,
  fields: { label: string; value: string }[],
  remarks?: string
) {
  return `
    <div class="job-section">
      <div class="section-header">${title}</div>
      <div class="section-content">
        ${generateFieldRows(fields)}
        <div class="remarks"><span class="remarks-label">Remarks:</span> ${remarks || ""}</div>
      </div>
    </div>`;
}

function generateSmallSection(title: string, remarks?: string) {
  return `
    <div class="job-section">
      <div class="small-section">
        <div class="section-header">${title}</div>
        <div class="section-content">
          <div class="remarks"><span class="remarks-label">Remarks:</span> ${remarks || ""}</div>
        </div>
      </div>
    </div>`;
}

function generateFieldRows(fields: { label: string; value: string }[]) {
  return fields
    .map(
      (f) => `
        <div class="field-row">
          <div class="field-label">${f.label}</div>
          <div class="field-value">${f.value}</div>
        </div>`
    )
    .join("");
}
