"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/app/_components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Users,
  Settings,
  LogOut,
  Plus,
  Eye,
  Bell,
  Search,
  User,
  ChevronDown,
  Home,
  Package as Item,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "Users", url: "/dashboard/alluser", icon: Users },
  { title: "Items", url: "/dashboard/item", icon: Plus },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

/* -------------------------------------------------------------------------- */
/*   OUTER WRAPPER – provides context first, then renders the inner layout    */
/* -------------------------------------------------------------------------- */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 

  return (
    <SidebarProvider>
      <Suspense fallback={<div>Loading…</div>}>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </Suspense>
    </SidebarProvider>
  );
}

/* -------------------------------------------------------------------------- */
/*                            INNER LAYOUT                                    */
/* -------------------------------------------------------------------------- */

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { open, setOpen, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) setOpen(false);
  };
 const { data: session } = useSession()
  const role = session?.user.role
  const perms = session?.user.permissions ?? []
  const has = (perm: string) => perms.includes(perm)

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* ──────────────── SIDEBAR ──────────────── */}
      <Sidebar className="bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* header */}
        <SidebarHeader className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-1">
              <Image
                src="/d_l2.png"
                alt="Logo"
                width={180}
                height={32}
                className="h-12 w-auto"
                priority
              />
            
             
  <span
  className={cn(
    "ml-3 inline-block overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out",
    open || isMobile
      ? "max-w-[200px] opacity-100 delay-300"
      : "max-w-0 opacity-0 delay-0"
  )}
>
  Dynamic Packaging
</span>



          </div>
        </SidebarHeader>

        {/* content */}
        <SidebarContent className="p-4">
       <div className="mb-2">
  <Button
    asChild
    className="w-full justify-center bg-purple-600 hover:bg-purple-700"
  >
    <Link href="/dashboard/products/new" onClick={handleLinkClick}
          className="flex items-center">           {/* keep content in a flex row */}
      <Plus className="h-4 w-4 flex-shrink-0" />

      <span
        className={cn(
          "inline overflow-hidden whitespace-nowrap",
          "transition-all duration-500 ease-in-out",
          open || isMobile                     // ⬅ sidebar state
            ? "ml-3 max-w-[200px] opacity-100 delay-300"
            : " ml-0 max-w-0    opacity-0   delay-0"
        )}
      >
        Add New Product
      </span>
    </Link>
  </Button>
</div>


          <SidebarGroup>
            
              <SidebarGroupLabel
 className={cn(
    "ml-3 inline-block overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out",
    open || isMobile
      ? "max-w-[200px] opacity-100 delay-300"
      : "max-w-0 opacity-0 delay-0"   )}           >
               
                Main Menu
              </SidebarGroupLabel>
            

            <SidebarGroupContent>
              <SidebarMenu>
                
                  <SidebarMenuItem key="Overview">
                    <Link href={"/dashboard"} onClick={handleLinkClick} className="block">
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard"}                      
                        >
                        {/* the Link is the child because we passed asChild above */}
                       <span className="flex items-center w-full px-3 py-2">
                        <Home className="h-5 w-5 flex-shrink-0" />
                          <span className={cn("inline overflow-hidden whitespace-nowrap","transition-all duration-500 ease-in-out",
                            open || isMobile                     // ⬅ sidebar state
                              ? "ml-3 max-w-[200px] opacity-100 delay-300"
                              : " ml-0 max-w-0    opacity-0   delay-0")}>
                            Overview
                          </span></span></SidebarMenuButton></Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem key="Items">
                    <Link href={"/dashboard/item"} onClick={handleLinkClick} className="block">
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/item"}                      
                        >
                        {/* the Link is the child because we passed asChild above */}
                       <span className="flex items-center w-full px-3 py-2">
                        <Item className="h-5 w-5 flex-shrink-0" />
                          <span className={cn("inline overflow-hidden whitespace-nowrap","transition-all duration-500 ease-in-out",
                            open || isMobile                     // ⬅ sidebar state
                              ? "ml-3 max-w-[200px] opacity-100 delay-300"
                              : " ml-0 max-w-0    opacity-0   delay-0")}>
                            Item Management
                          </span></span></SidebarMenuButton></Link>
                  </SidebarMenuItem>

                                {(has("MANAGE_CUSTOMER") || has("MANAGE_EMPLOYEE")) &&
                  <SidebarMenuItem key="Users">
                    <Link href={ "/dashboard/alluser"} onClick={handleLinkClick} className="block">
                      <SidebarMenuButton asChild isActive={pathname ==="/dashboard/alluser"}                      
                        >
                        {/* the Link is the child because we passed asChild above */}
                       <span className="flex items-center w-full px-3 py-2">
                        <Users className="h-5 w-5 flex-shrink-0" />
                          <span className={cn("inline overflow-hidden whitespace-nowrap","transition-all duration-500 ease-in-out",
                            open || isMobile                     // ⬅ sidebar state
                              ? "ml-3 max-w-[200px] opacity-100 delay-300"
                              : " ml-0 max-w-0    opacity-0   delay-0")}>
                            Users
                          </span></span></SidebarMenuButton></Link>
                          
                  </SidebarMenuItem>}

                  {(has("MANAGE_ROLE") || has("MANAGE_PERMISSIONS")) &&
                  <SidebarMenuItem key="Settings">
                    <Link href={"/dashboard/settings"} onClick={handleLinkClick} className="block">
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}                      
                        >
                        {/* the Link is the child because we passed asChild above */}
                       <span className="flex items-center w-full px-3 py-2">
                        <Settings className="h-5 w-5 flex-shrink-0" />
                          <span className={cn("inline overflow-hidden whitespace-nowrap","transition-all duration-500 ease-in-out",
                            open || isMobile                     // ⬅ sidebar state
                              ? "ml-3 max-w-[200px] opacity-100 delay-300"
                              : " ml-0 max-w-0    opacity-0   delay-0")}>
                            Settings
                          </span></span></SidebarMenuButton></Link>
                  </SidebarMenuItem>}


              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* footer */}
        <SidebarFooter className="">
  
        </SidebarFooter>
      </Sidebar>

      {/* ──────────────── MAIN PANEL ──────────────── */}
      <div className="flex-1 flex flex-col transition-all">
        {/* top bar */}
        <header className="border-b border-gray-200 p-4 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />

              
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              <Button variant="outline" size="icon" asChild>
                <Link href="/" target="_blank">
                  <Eye className="h-5 w-5" />
                </Link>
              </Button>

              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-700 font-medium">Store Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* main content */}
        <main className="w-full max-w-screen overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  {children}
</main>


        {/* footer */}
        <footer className="bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 px-6 py-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            © 2024 NaturalCurls Admin Portal. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
