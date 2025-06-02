import Link from "next/link"
import { Separator } from "@/app/_components/ui/seperator"
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6";
export function Footer() {
  return (
    <footer className="w-full py-8 bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-lg">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Dynamic Packaging</h3>
          <p className="text-sm text-teal-100">
            Revolutionizing order management and manufacturing process monitoring for the packaging industry.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-teal-100 hover:text-white transition-colors duration-300">
              <FaFacebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-teal-100 hover:text-white transition-colors duration-300">
              <FaXTwitter className="h-5 w-5" />
              <span className="sr-only">X</span>
            </Link>
            <Link href="#" className="text-teal-100 hover:text-white transition-colors duration-300">
              <FaInstagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-teal-100 hover:text-white transition-colors duration-300">
              <FaLinkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-1 text-sm text-teal-100">
              <li>
                <Link href="/" className="hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/items" className="hover:text-white transition-colors duration-300">
                  Item Dashboard
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors duration-300">
                  Orders Management
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-1 text-sm text-teal-100">
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Contact Info</h4>
          <p className="text-sm text-teal-100">
            123 Packaging Lane, Industrial City, State 98765
            <br />
            Email: info@dynamicpackaging.com
            <br />
            Phone: +1 (555) 123-4567
          </p>
        </div>
      </div>
      <Separator className="my-8 bg-teal-300" />
      <div className="container mx-auto px-4 md:px-6 text-center text-sm text-teal-100">
        &copy; {new Date().getFullYear()} Dynamic Packaging. All rights reserved.
      </div>
    </footer>
  )
}
