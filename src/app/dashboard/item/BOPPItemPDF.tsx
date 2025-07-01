"use client"
import { useEffect } from "react"
import { Button } from "@/app/_components/ui/button"
import { Download } from "lucide-react"

import type { BOPPItemForm } from "@/types/bopp"

interface BOPPItemPDFProps {
  itemData: BOPPItemForm
}

export function BOPPItemPDF({ itemData }: BOPPItemPDFProps) {
    useEffect(() => {
    const generatePDF = () => {
      const printWindow = window.open("", "_blank")
      if (!printWindow) return

   const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BOPP Item Specification - ${itemData.id}</title>
      <style>
          @page { 
              size: A4; 
              margin: 15mm;
          }
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          body { 
              font-family: Arial, sans-serif; 
              font-size: 10px;
              line-height: 1.2;
              color: #000;
          }
          .container {
              width: 100%;
              max-width: 180mm;
              margin: 0 auto;
              border: 2px solid #000;
              padding: 8px;
          }
          .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px solid #000;
          }
          .logo-section {
              display: flex;
              align-items: center;
              font-weight: bold;
              font-size: 16px;
          }
          .logo {
              width: 30px;
              height: 30px;
              background: #333;
              margin-right: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
          }
          .gms-section {
              text-align: center;
              border: 1px solid #000;
              padding: 8px;
              background: #f0f0f0;
              min-width: 120px;
          }
          .gms-title {
              font-size: 9px;
              font-weight: bold;
              margin-bottom: 4px;
          }
          .gms-value {
              font-size: 14px;
              font-weight: bold;
          }
          .main-content {
              display: flex;
              margin-bottom: 10px;
          }
          .left-section {
              flex: 2;
              margin-right: 8px;
          }
          .right-section {
              flex: 1;
              border: 1px solid #000;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 120px;
              background: #f9f9f9;
          }
          .info-table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #000;
          }
          .info-table td {
              border: 1px solid #000;
              padding: 4px 6px;
              vertical-align: top;
          }
          .info-table .label {
              background: #f0f0f0;
              font-weight: bold;
              width: 25%;
              font-size: 9px;
          }
          .info-table .value {
              font-size: 9px;
          }
          .job-title {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin: 12px 0 8px 0;
              text-decoration: underline;
          }
          .job-sections {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
          }
          .job-section {
              border: 1px solid #000;
          }
          .section-header {
              background: #e0e0e0;
              padding: 4px 6px;
              font-weight: bold;
              font-size: 10px;
              text-align: center;
              border-bottom: 1px solid #000;
          }
          .section-content {
              padding: 4px;
          }
          .field-row {
              display: flex;
              margin-bottom: 2px;
              font-size: 8px;
          }
          .field-label {
              background: #f5f5f5;
              padding: 2px 4px;
              border: 1px solid #ccc;
              font-weight: bold;
              min-width: 60px;
              font-size: 7px;
          }
          .field-value {
              padding: 2px 4px;
              border: 1px solid #ccc;
              flex: 1;
              font-size: 7px;
          }
          .remarks {
              margin-top: 4px;
              font-size: 7px;
          }
          .remarks-label {
              font-weight: bold;
              display: inline;
          }
          .full-width {
              grid-column: 1 / -1;
          }
          .image-placeholder {
              color: #666;
              font-size: 12px;
              text-align: center;
          }
          .small-section {
              margin-bottom: 4px;
          }
          .small-section .section-header {
              font-size: 9px;
              padding: 2px 4px;
          }
          .small-section .section-content {
              padding: 2px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <!-- Header -->
          <div class="header">
              <div class="logo-section">

<div class="logo-wrapper">
  <img src="/t_light.png" alt="Logo" class="logo-image" />
</div>
              </div>
              <div class="gms-section">
                  <div class="gms-title">GMS (PACKAGE<br>CAPACITY)</div>
                  <div class="gms-value">${itemData.GMS}</div>
              </div>
          </div>

          <!-- Main Content -->
          <div class="main-content" style="display: flex; margin-bottom: 10px;">
  <!-- Left Section -->
  <div class="left-section" style="flex: 2; margin-right: 8px; min-width: 0;">
    <table class="info-table" style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
      <tr>
        <td class="label" style="background: #f0f0f0; font-weight: bold; width: 25%; font-size: 9px; border: 1px solid #000; padding: 4px 6px;">Item Name</td>
        <td class="value" style="font-size: 9px; border: 1px solid #000; padding: 4px 6px;">${itemData.name}</td>
      </tr>
      <tr>
        <td class="label" style="background: #f0f0f0; font-weight: bold; font-size: 9px; border: 1px solid #000; padding: 4px 6px;">Item Id</td>
        <td class="value" style="font-size: 9px; border: 1px solid #000; padding: 4px 6px;">${itemData.id}</td>
      </tr>
      <tr>
        <td class="label" style="background: #f0f0f0; font-weight: bold; font-size: 9px; border: 1px solid #000; padding: 4px 6px;">Type</td>
        <td class="value" style="font-size: 9px; border: 1px solid #000; padding: 4px 6px;">BOPP</td>
      </tr>
      <tr>
        <td class="label" style="background: #f0f0f0; font-weight: bold; font-size: 9px; border: 1px solid #000; padding: 4px 6px;">Description</td>
        <td class="value" style="font-size: 9px; border: 1px solid #000; padding: 4px 6px;">
          ${itemData.description}<br />
          <small>Created At: ${itemData.createdAt}</small><br />
          <small>Updated At: ${itemData.updatedAt}</small>
        </td>
      </tr>
      <tr>
        <td class="label" style="background: #f0f0f0; font-weight: bold; font-size: 9px; border: 1px solid #000; padding: 4px 6px;">Customer Name</td>
        <td class="value" style="font-size: 9px; border: 1px solid #000; padding: 4px 6px;">${itemData.billingName}</td>
      </tr>
      <tr>
        <td class="label" style="background: #f0f0f0; font-weight: bold; font-size: 9px; border: 1px solid #000; padding: 4px 6px;">Brand Name</td>
        <td class="value" style="font-size: 9px; border: 1px solid #000; padding: 4px 6px;">${itemData.brand}</td>
      </tr>
      <tr>
        <td class="label" style="background: #f0f0f0; font-weight: bold; font-size: 9px; border: 1px solid #000; padding: 4px 6px;">Address</td>
        <td class="value" style="font-size: 9px; border: 1px solid #000; padding: 4px 6px;">${itemData.address}</td>
      </tr>
    </table>
  </div>

  <!-- Right Section (Image) -->
 <div class="right-section" style="flex: 1; display: flex; align-items: center; justify-content: center; border: 1px solid #000; background: #f9f9f9;">
    ${
      itemData.itemImagesUrls.length > 0
        ? `<img src="${itemData.itemImagesUrls[0]}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`
        : `<div class="image-placeholder" style="color: #666; font-size: 12px; text-align: center;">[Image]</div>`
    }
  </div>
</div>


          <!-- Job Description -->
          <div class="job-title">JOB DESCRIPTION</div>

          <!-- Job Sections Grid -->
          <div class="job-sections">
              <!-- Printing Department -->
              <div class="job-section">
                  <div class="section-header">PRINTING DEPARTMENT (PRT)</div>
                  <div class="section-content">
                      <div class="field-row">
                          <div class="field-label">SizexMic</div>
                          <div class="field-value">${itemData.printing_SizexMic}</div>
                      </div>
                      <div class="field-row">
                          <div class="field-label">Material Type</div>
                          <div class="field-value">${itemData.printing_MaterialType}</div>
                      </div>
                      <div class="field-row">
                          <div class="field-label">Cylinder</div>
                          <div class="field-value">${itemData.printing_Cylinder}</div>
                      </div>
                      <div class="field-row">
                          <div class="field-label">Cylinder Direction</div>
                          <div class="field-value">${itemData.printing_CylinderDirection}</div>
                      </div>
                      <div class="field-row">
                          <div class="field-label">No. Of Colour</div>
                          <div class="field-value">${itemData.printing_NoOfColours}</div>
                      </div>
                      <div class="field-row">
                          <div class="field-label">Colours Name</div>
                          <div class="field-value">${itemData.printing_Colours}</div>
                      </div>
                      <div class="remarks">
                          <span class="remarks-label">Remarks:</span> ${itemData.printing_Remarks}
                      </div>
                  </div>
              </div>

              <!-- Inspection 1 & Lamination -->
              <div class="job-section">
                  <div class="small-section">
                      <div class="section-header">INSPECTION 1:</div>
                      <div class="section-content">
                          <div class="remarks">
                              <span class="remarks-label">Remarks:</span> ${itemData.inspection1_Remarks}
                          </div>
                      </div>
                  </div>
                  <div class="small-section">
                      <div class="section-header">LAMINATION (LAM):</div>
                      <div class="section-content">
                          <div class="field-row">
                              <div class="field-label">SizexMic</div>
                              <div class="field-value">${itemData.lamination_SizexMic}</div>
                          </div>
                          <div class="field-row">
                              <div class="field-label">Lamination Type</div>
                              <div class="field-value">${itemData.lamination_Type}</div>
                          </div>
                          <div class="remarks">
                              <span class="remarks-label">Remarks:</span> ${itemData.lamination_Remarks}
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Inspection 2 & Fabric Lamination -->
              <div class="job-section">
                  <div class="small-section">
                      <div class="section-header">INSPECTION 2:</div>
                      <div class="section-content">
                          <div class="remarks">
                              <span class="remarks-label">Remarks:</span> ${itemData.inspection2_Remarks}
                          </div>
                      </div>
                  </div>
                  <div class="small-section">
                      <div class="section-header">FABRIC LAMINATION</div>
                      <div class="section-content">
                          <div class="field-row">
                              <div class="field-label">Size</div>
                              <div class="field-value">${itemData.fabricLamination_Size}</div>
                          </div>
                          <div class="field-row">
                              <div class="field-label">Material type</div>
                              <div class="field-value">${itemData.fabricLamination_MaterialType}</div>
                          </div>
                          <div class="field-row">
                              <div class="field-label">Sides</div>
                              <div class="field-value">${itemData.fabricLamination_Sides}</div>
                          </div>
                          <div class="field-row">
                              <div class="field-label">Trimming</div>
                              <div class="field-value">${itemData.fabricLamination_Trimming}</div>
                          </div>
                          <div class="remarks">
                              <span class="remarks-label">Remarks:</span> ${itemData.fabricLamination_Remarks}
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Slitting & Cutting and Stitching -->
              <div class="job-section">
                  <div class="small-section">
                      <div class="section-header">SLITTING:</div>
                      <div class="section-content">
                          <div class="remarks">
                              <span class="remarks-label">Remarks:</span> ${itemData.slitting_Remarks}
                          </div>
                      </div>
                  </div>
                  <div class="small-section">
                      <div class="section-header">CUTTING AND STITCHING</div>
                      <div class="section-content">
                          <div class="field-row">
                              <div class="field-label">Type</div>
                              <div class="field-value">${itemData.cuttingAndStitching_Type}</div>
                          </div>
                          <div class="field-row">
                              <div class="field-label">Stitching</div>
                              <div class="field-value">${itemData.cuttingAndStitching_Stitching}</div>
                          </div>
                          <div class="field-row">
                              <div class="field-label">Perforation</div>
                              <div class="field-value">${itemData.cuttingAndStitching_Perforation}</div>
                          </div>
                          <div class="field-row">
                              <div class="field-label">Thread colour</div>
                              <div class="field-value">${itemData.cuttingAndStitching_ThreadColour}</div>
                          </div>
                          <div class="field-row">
                              <div class="field-label">Handle Type</div>
                              <div class="field-value">${itemData.cuttingAndStitching_HandleType}</div>
                          </div>
                          <div class="field-row">
                              <div class="field-label">Handle Colour</div>
                              <div class="field-value">${itemData.cuttingAndStitching_HandleColour}</div>
                          </div>
                          <div class="field-row">
                              <div class="field-label">Packing</div>
                              <div class="field-value">${itemData.cuttingAndStitching_Packing}</div>
                          </div>
                          <div class="remarks">
                              <span class="remarks-label">Remarks:</span> ${itemData.cuttingAndStitching_Remarks}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </body>
  </html>
  `


      printWindow.document.write(htmlContent)
      printWindow.document.close()

      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }

    generatePDF()
  }, [itemData])

  return null 
  
}
