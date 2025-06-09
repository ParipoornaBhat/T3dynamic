"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { PencilIcon } from "lucide-react"
import { motion } from "framer-motion"

export function ProfileCard() {
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
      <Card className="mx-auto bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900 shadow-xl border-0">
        <CardHeader className="flex flex-col items-center gap-4 pb-6">
          <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Avatar className="h-24 w-24 ring-4 ring-gradient-to-r ring-teal-500 ring-offset-2">
              <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-purple-500 text-white text-xl font-bold">
                JD
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 text-white border-0 hover:from-teal-600 hover:to-purple-600 transition-all duration-300"
            >
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Edit profile picture</span>
            </Button>
          </motion.div>
          <div className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              John Doe
            </CardTitle>
            <CardDescription className="text-lg">john.doe@example.com</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              defaultValue="John Doe"
              className="bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 border-2 focus:border-primary transition-all duration-300"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              defaultValue="john.doe@example.com"
              type="email"
              className="bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 border-2 focus:border-primary transition-all duration-300"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              defaultValue="+1 (555) 123-4567"
              type="tel"
              className="bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 border-2 focus:border-primary transition-all duration-300"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="current-password" className="text-sm font-medium">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900 dark:to-pink-900 border-2 focus:border-primary transition-all duration-300"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="new-password" className="text-sm font-medium">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900 dark:to-pink-900 border-2 focus:border-primary transition-all duration-300"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="grid gap-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900 dark:to-pink-900 border-2 focus:border-primary transition-all duration-300"
            />
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-6">
          <Button
            variant="outline"
            className="hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-600 hover:text-white transition-all duration-300"
          >
            Cancel
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
