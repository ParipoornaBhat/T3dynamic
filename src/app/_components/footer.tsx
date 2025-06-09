import Link from "next/link";
import { Separator } from "@/app/_components/ui/seperator";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useSession } from "next-auth/react"; // Import NextAuth's useSession hook
export function Footer() {
    const { data: session } = useSession()

  return (
    <footer className="w-full py-8 bg-gradient-to-r from-teal-500 to-purple-500 dark:from-teal-900 dark:to-purple-900 text-white dark:text-gray-100">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Branding & Social */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Dynamic Packaging</h3>
          <p className="text-sm text-teal-100 dark:text-teal-300">
            Revolutionizing order management and manufacturing process monitoring for the packaging industry.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-teal-100 dark:text-teal-300 hover:text-white dark:hover:text-purple-300 transition-colors duration-300">
              <FaFacebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-teal-100 dark:text-teal-300 hover:text-white dark:hover:text-purple-300 transition-colors duration-300">
              <FaXTwitter className="h-5 w-5" />
              <span className="sr-only">X</span>
            </Link>
            <Link href="#" className="text-teal-100 dark:text-teal-300 hover:text-white dark:hover:text-purple-300 transition-colors duration-300">
              <FaInstagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-teal-100 dark:text-teal-300 hover:text-white dark:hover:text-purple-300 transition-colors duration-300">
              <FaLinkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>

        {/* Quick Links & Support */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-1 text-sm text-teal-100 dark:text-teal-300">
              <li><Link href="/" className="hover:text-white dark:hover:text-purple-300 transition-colors duration-300">Home</Link></li>
              <li><Link href="/about" className="hover:text-white dark:hover:text-purple-300 transition-colors duration-300">About Us</Link></li>
            {session ?(<>
              <li><Link href="/items" className="hover:text-white dark:hover:text-purple-300 transition-colors duration-300">Item Dashboard</Link></li>
              <li><Link href="/orders" className="hover:text-white dark:hover:text-purple-300 transition-colors duration-300">Orders Management</Link></li>

            </>):(<>
              <li><Link href="/auth/signin" className="hover:text-white dark:hover:text-purple-300 transition-colors duration-300">Login</Link></li>

            </>)}
            
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-1 text-sm text-teal-100 dark:text-teal-300">
              <li><Link href="about" className="hover:text-white dark:hover:text-purple-300 transition-colors duration-300">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Contact Info</h4>
          <p className="text-sm text-teal-100 dark:text-teal-300">
            123 Packaging Lane, Industrial City, State 98765<br />
            Email: info@dynamicpackaging.com<br />
            Phone: +1 (555) 123-4567
          </p>
        </div>
      </div>

      <Separator className="my-8 bg-teal-300 dark:bg-teal-600" />

      <div className="container mx-auto px-4 md:px-6 text-center text-sm text-teal-100 dark:text-teal-400">
        &copy; {new Date().getFullYear()} Dynamic Packaging. All rights reserved.
      </div>
    </footer>
  );
}
