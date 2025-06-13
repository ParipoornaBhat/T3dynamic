"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group"
import Image from "next/image"
import { Badge } from "@/app/_components/ui/badge"
import { Textarea } from "@/app/_components/ui/textarea"
import { useRouter } from "next/navigation"

type Item = {
  id: string
  name: string
  type: "BOPP" | "PET"
  finish: "Matte" | "Glossy" | "Plain"
  imageUrl: string
  customerName: string
  description: string
}

interface ItemOrderingModalProps {
  item: Item | null
  onClose: () => void
}

export function ItemOrderingModal({ item, onClose }: ItemOrderingModalProps) {
  const [orderType, setOrderType] = useState<"bags" | "kg">("bags")
  const [quantity, setQuantity] = useState<number>(1)
  const [remarks, setRemarks] = useState<string>("")
  const router = useRouter()

  if (!item) return null

  const handleAddToCart = () => {
    // In a real app, you'd add this to a global cart state or send to an API
    console.log("Adding to cart:", {
      itemId: item.id,
      itemName: item.name,
      orderType,
      quantity,
      remarks,
    })
    alert(`Added ${quantity} ${orderType} of ${item.name} to cart!`)
    onClose()
    // Optionally navigate to cart page
    // router.push('/cart');
  }

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{item.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">Place an order for this item.</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[300px] h-[300px] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.name}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-semibold">
                {item.type}
              </Badge>
              {item.finish !== "Plain" && (
                <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm font-semibold">
                  {item.finish} Finish
                </Badge>
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">Customer: {item.customerName}</p>
              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="order-type">Order By:</Label>
              <RadioGroup
                defaultValue="bags"
                value={orderType}
                onValueChange={(value: "bags" | "kg") => setOrderType(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bags" id="order-bags" />
                  <Label htmlFor="order-bags">Number of Bags</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kg" id="order-kg" />
                  <Label htmlFor="order-kg">Output in KG</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Order Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                placeholder="Enter quantity"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                placeholder="Any specific instructions or details for this order."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <Button onClick={handleAddToCart} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Add to Cart
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
