
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { signOut } from "next-auth/react"
import { User} from "lucide-react"
import { FaHome, FaInfoCircle, FaBoxOpen, FaHistory, FaTachometerAlt } from "react-icons/fa";
import { HiOutlineLogin } from "react-icons/hi";
import { ProfileCard } from "./profile-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Sheet, SheetContent,SheetDescription, SheetTrigger } from "@/app/_components/ui/sheet";
import {  SheetHeader, SheetTitle } from "@/app/_components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { ModeToggle } from "@/app/_components/ui/mode-toggle";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdMenu } from "react-icons/io";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react"
import { useScrollDirection } from "@/app/_components/other/use-scroll-direction"; // Custom hook to detect scroll direction
import { useTheme } from "next-themes";
import { useEffect, useState } from "react"


  

export function Navbar() {

  const { data: session } = useSession()
  const role = session?.user.role
  const perms = session?.user.permissions ?? []
  const has = (perm: string) => perms.includes(perm)

const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

 const { theme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check the theme only after the component mounts on the client
    setIsDark(theme === 'dark' || resolvedTheme === 'dark');
  }, [theme, resolvedTheme]);

  //const logoSrc = isDark ? "/t_dark.png" : "/t_light.png";
  const logoSrc = isDark ? "/d_l.png" : "/d_l.png";

const [open, setOpen] = useState(false);
useEffect(() => {
    console.log(open);
  }, [open]);//when ever opened or closed


  const scrollDirection = useScrollDirection();

  

  return (
  <header
    className={cn(
      "sticky top-0 z-50 w-full border-b bg-white px-4 transition-all duration-300 backdrop-blur-md",
      "bg-gradient-to-r from-gray-150 via-white-150 to-gray-150 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
      "border-gray-700 dark:border-gray-700",
      scrollDirection === "down" && "-translate-y-full",
      scrollDirection === "up" && "translate-y-0",
      scrollDirection === "none" && "translate-y-0"
    )}
  >
    <div className="max-w-screen-xl mx-auto">
<div className="flex items-center justify-between py-1 px-4">
        {/* Logo */}
       <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
      <Image
        src={logoSrc}
        alt="Dynamic Packaging Logo"
        width={180}
        height={32}
        priority  
        className="h-10 sm:h-10 md:h-12 w-auto transition-all duration-300"
      />
    </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
            About
          </Link>
          {session && (
            <>
            
            { role == "CUSTOMER" && <>
              <Link href="/orderitems" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
                Order-Items
              </Link>
              <Link href="/orderhistory" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
                Order-History
              </Link>
            </>}
          { role !== "CUSTOMER" && <>
              <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
                Dashboard
              </Link>
              <Link href="/orderitems" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
                Order
              </Link>
</>
              }
              <Link href="/notifications" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
                Notifications
              </Link>

            </>
          )}
        </nav>

      

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          {session ? (
            <>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
                    <User className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  
                <Sheet>
  <SheetTrigger asChild>
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Profile</DropdownMenuItem>
  </SheetTrigger>

  <SheetContent
    side="right"
    className="lg:mt-14 w-full sm:max-w-md lg:max-w-sm lg:max-h-sm sm:max-h-sm rounded-sm bg-gradient-to-b from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 shadow-xl lg:pr-1 lg:pl-1 lg:pb-1 lg:pt-1 lg:rounded-lg overflow-y-auto"
  >
    {/* ✅ Visually hidden accessible title */}
    <SheetTitle className="sr-only">User Profile</SheetTitle>
            <SheetDescription id="sheet-description" className="sr-only">
    View and manage your profile details.
  </SheetDescription>
    <ProfileCard />
  </SheetContent>
</Sheet>



            {role==="CUSTOMER" && <>
                  <DropdownMenuItem onClick={() => setOpen(false)}>
                    <Link href="/orderhistory">My Orders</Link>
                  </DropdownMenuItem>
            </>}
              {role!=="CUSTOMER" && <>
                  <DropdownMenuItem onClick={() => setOpen(false)}>
                    <Link href="/dashboard">{role==="ADMIN" && <>Admin</>} Dashboard</Link>
                  </DropdownMenuItem>
                  </>}
                  <DropdownMenuItem onClick={() => setOpen(false)}>
                    <Link href="/notifications">Notifications</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpen(false)}>
                 <button
                  onClick={async () => {
                    await signOut({ redirect: false }); // Wait for next-auth sign out
                    setOpen(false);

                    // Set a 5-second flash success cookie
                    document.cookie = [
                      "flash_success=You are signed out successfully.",
                      "max-age=5",
                      "path=/",
                    ].join("; ");

                    window.location.href = "/"; // Redirect to home
                  }}
                  className="w-full text-left"
                >
                  Sign Out
                </button>


                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="hidden lg:inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors
              bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 hover:text-black
              dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <FaCircleUser className="h-5 w-5" />
              Login
            </Link>
          )}

          {/* Theme toggle */}
          

          {/* Mobile Menu */}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <IoMdMenu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-gradient-to-b from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900"
        >
          <SheetHeader>
            
      <SheetTitle>
        <VisuallyHidden>Navigation Menu</VisuallyHidden>
      </SheetTitle>
    </SheetHeader>
          <nav className="grid gap-6 text-lg font-medium">
  <Link href="/" onClick={handleClose} className="flex items-center gap-2 text-lg font-semibold">
      <Image
        src={logoSrc}
        alt="Dynamic Packaging Logo"
        width={180}
        height={32}
        className="h-10 sm:h-10 md:h-12 w-auto transition-all duration-300"
      />
    <span className="sr-only">Dynamic Packaging</span>
  </Link>

  <Link href="/" onClick={handleClose}  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
    <FaHome className="h-5 w-5" />
    Home
  </Link>

  <Link href="/about" onClick={handleClose}  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
    <FaInfoCircle className="h-5 w-5" />
    About
  </Link>

  {session ? (
    <>
      <Link href="/orderitems" onClick={handleClose}  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
        <FaBoxOpen className="h-5 w-5" />
        Order
      </Link>

      <Link href="/orderhistory" onClick={handleClose}  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
        <FaHistory className="h-5 w-5" />
        Order History
      </Link>

      <Link href="/dashboard" onClick={handleClose}  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
        <FaTachometerAlt className="h-5 w-5" />
        Dashboard
      </Link>
       <button
        onClick={async () => {
          await signOut({ redirect: false }); // Wait for next-auth sign out
          setOpen(false);

          // Set a 5-second flash success cookie
          document.cookie = [
            "flash_success=You are signed out successfully.",
            "max-age=5",
            "path=/",
          ].join("; ");

          window.location.href = "/"; // Redirect to home
        }}
        className="w-full text-left"
      >
        Sign Out
    </button>
    </>
  ) : (
    <Link href="/auth/signin" onClick={handleClose}  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400">
      <HiOutlineLogin className="h-5 w-5" />
      Login
    </Link>
  )}
</nav>
        </SheetContent>
      </Sheet>
        </div>
      </div>
     
    </div>
  </header>
);

}
