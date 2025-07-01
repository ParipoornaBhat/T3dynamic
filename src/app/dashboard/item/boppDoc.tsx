"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "@/trpc/react"
import { BOPPItemPDF } from "./BOPPItemPDF"
import { ComponentLoading } from "@/app/_components/component-loading2"
import type { BOPPItemForm } from "@/types/bopp"

interface BOPPItemDownloadWrapperProps {
  itemId: string
}

export default function BOPPItemDownloadWrapper({ itemId }: BOPPItemDownloadWrapperProps) {
  const [itemData, setItemData] = useState<BOPPItemForm | null>(null)

  const { data, isLoading, error } = api.boppItem.getAnyBoppItem.useQuery(
    { itemId },
    { enabled: true } // ✅ always enabled — fetch on mount
  )

  useEffect(() => {
    if (error) toast.error(`Failed to fetch item: ${error.message}`)
  }, [error])

  useEffect(() => {
    if (data) setItemData(data as BOPPItemForm)
  }, [data])

  if (isLoading) return <ComponentLoading message="Loading BOPP item..." />
  if (itemData) return <BOPPItemPDF itemData={itemData} />

  return null
}
