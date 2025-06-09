import Link from "next/link"
import { Button } from "@/app/_components/ui/button"
import { FiMessageCircle } from "react-icons/fi";
export function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/7338652017" // Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
  size="icon"
  className="h-14 w-14 rounded-full shadow-lg bg-green-500 hover:bg-green-700 dark:bg-teal-500 dark:hover:bg-teal-700 transform hover:scale-105 transition-all duration-300"
>
  <FiMessageCircle className="h-8 w-8 text-white" />
  <span className="sr-only">Contact us on WhatsApp</span>
</Button>


    </Link>
  )
}
