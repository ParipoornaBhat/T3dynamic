"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Badge } from "@/app/_components/ui/badge"
import { Button } from "@/app/_components/ui/button"
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  Eye,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"



const quickStats = [
  {
    title: "Today's Revenue",
    value: "$2,847",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Pending Orders",
    value: "12",
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    title: "Low Stock Items",
    value: "3",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "New Customers",
    value: "8",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    product: "Luxury Curly Lace Front",
    amount: "$299.99",
    status: "completed",
    time: "2h ago",
  },
  {
    id: "ORD-002",
    customer: "Maria Garcia",
    product: "Natural Curly Bob",
    amount: "$189.99",
    status: "processing",
    time: "4h ago",
  },
  {
    id: "ORD-003",
    customer: "Jessica Chen",
    product: "Long Curly Wig",
    amount: "$159.99",
    status: "shipped",
    time: "6h ago",
  },
]

const quickActions = [
  {
    title: "Add New Product",
    description: "Create a new product listing",
    href: "/admin/products/new",
    icon: Plus,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "View All Orders",
    description: "Manage customer orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Manage Products",
    description: "Edit existing products",
    href: "/admin/products",
    icon: Package,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Customer List",
    description: "View customer information",
    href: "/admin/customers",
    icon: Users,
    color: "bg-orange-500 hover:bg-orange-600",
  },
]

const lowStockAlerts = [
  {
    name: "Curly Lace Front - Black",
    stock: 3,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Natural Bob - Brown",
    stock: 5,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Long Curly - Blonde",
    stock: 2,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminOverview() {
  const getStatusBadge = (status: string) => {
    const config = {
      completed: { variant: "default" as const, icon: CheckCircle, text: "Completed" },
      processing: { variant: "secondary" as const, icon: Clock, text: "Processing" },
      shipped: { variant: "outline" as const, icon: Package, text: "Shipped" },
      pending: { variant: "destructive" as const, icon: XCircle, text: "Pending" },
    }

    const statusConfig = config[status as keyof typeof config]
    const Icon = statusConfig.icon

    return (
      <Badge variant={statusConfig.variant} className="gap-1 text-xs">
        <Icon className="h-3 w-3" />
        {statusConfig.text}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Simple Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Here's what's happening with NaturalCurls today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              View Store
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats - Simplified */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content - Simplified Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button key={action.title} variant="outline" className="w-full justify-start h-auto p-4" asChild>
                  <Link href={action.href}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-md ${action.color} flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer purchases</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/orders">
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{order.id}</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{order.customer}</p>
                  <p className="text-xs text-muted-foreground truncate">{order.product}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.amount}</p>
                  <p className="text-xs text-muted-foreground">{order.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Items that need restocking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockAlerts.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-amber-700">Only {item.stock} left in stock</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-3" asChild>
              <Link href="/admin/products?filter=low_stock">
                Manage Inventory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary - Simplified */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>This Month's Performance</CardTitle>
            <CardDescription>Key metrics overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$45,231</div>
                <p className="text-sm text-green-700">Total Revenue</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+20.1%</span>
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1,234</div>
                <p className="text-sm text-blue-700">Total Orders</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-600">+15.3%</span>
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">567</div>
                <p className="text-sm text-purple-700">Products</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-purple-600" />
                  <span className="text-xs text-purple-600">+5.2%</span>
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">2,345</div>
                <p className="text-sm text-orange-700">Customers</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-orange-600" />
                  <span className="text-xs text-orange-600">+12.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products This Week</CardTitle>
            <CardDescription>Best performing items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Luxury Curly Lace Front", sales: 124, rating: 4.9 },
              { name: "Natural Curly Bob", sales: 89, rating: 4.8 },
              { name: "Long Curly Wig", sales: 156, rating: 4.7 },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{product.sales} sales</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
