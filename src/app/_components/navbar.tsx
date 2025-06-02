import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { ModeToggle } from "@/app/_components/ui/mode-toggle";
import { FaCircleUser, FaCartShopping } from "react-icons/fa6";
import { IoMdMenu } from "react-icons/io";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react"; // Import NextAuth's useSession hook
import { useScrollDirection } from "@/app/_components/other/use-scroll-direction"; // Custom hook to detect scroll direction

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession(); // Check session

  const scrollDirection = useScrollDirection();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    // Only show these links if a user is logged in
    ...(session
      ? [
          { name: "Admin Dashboard", href: "/admin/dashboard" },
          { name: "Item Dashboard", href: "/items" },
          { name: "Orders Management", href: "/orders" },
          { name: "Settings & Report", href: "/settings-report" },
          { name: "Tasks", href: "/tasks" },
        ]
      : []),
  ];

  return (
    <header
      className={cn(
        "sticky top-0 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 z-50 transition-all duration-300 backdrop-blur-md",
        "bg-gradient-to-r from-teal-50/80 via-purple-50/80 to-orange-50/80 dark:from-teal-900/80 dark:via-purple-900/80 dark:to-orange-900/80",
        scrollDirection === "down" && "-translate-y-full",
        scrollDirection === "up" && "translate-y-0",
        scrollDirection === "none" && "translate-y-0"
      )}
    >
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base animate-pulse-glow"
        >
          <Image
            src="/logo.png"
            alt="Dynamic Packaging Logo"
            width={180}
            height={32}
            className="h-8 w-auto"
          />
          <span className="sr-only">Dynamic Packaging</span>
        </Link>
        {navLinks.map((link, index) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "transition-all duration-300 hover:text-primary hover:scale-105 animate-fade-in-down",
              pathname === link.href
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu */}
      <Sheet>
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
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image
                src="/logo.png"
                alt="Dynamic Packaging Logo"
                width={180}
                height={32}
                className="h-8 w-auto"
              />
              <span className="sr-only">Dynamic Packaging</span>
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "hover:text-primary transition-colors duration-300",
                  pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Right-side user section */}
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial" />
        <ModeToggle />

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:scale-110 transition-transform duration-300"
              >
                <FaCircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gradient-to-b from-background to-muted"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Sheet>
                <SheetTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Profile
                  </DropdownMenuItem>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-md bg-gradient-to-b from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900"
                >
                  {/* ProfileCard can be added here */}
                </SheetContent>
              </Sheet>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/login">
            <Button variant="secondary" size="icon">
              <FaCircleUser className="h-5 w-5" />
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
