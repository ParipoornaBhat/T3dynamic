"use client";

import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { motion } from "framer-motion";
import type { Session } from "next-auth"; // or whatever your session type is


export default function HomePage({ session }: { session: Session | null }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-teal-50 via-purple-50 to-orange-50 dark:from-teal-900 dark:via-purple-900 dark:to-orange-900">
      <motion.div
        className="flex flex-col items-center justify-center px-4 py-12 md:py-24 lg:py-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl text-center space-y-6">
          <motion.h1
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-teal-600 via-purple-600 to-orange-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Streamline Your Manufacturing Process
          </motion.h1>
          <motion.p className="text-lg text-muted-foreground md:text-xl" variants={itemVariants}>
            Empower your Order Management team with real-time monitoring and efficient tools for manufacturing.
          </motion.p>
          <motion.div className="flex flex-col gap-4 sm:flex-row justify-center" variants={itemVariants}>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full"
          variants={containerVariants}
        >
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="h-full bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-800 border-teal-200 dark:border-teal-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-teal-700 dark:text-teal-300">Order Management</CardTitle>
                <CardDescription>Track and manage all your orders from creation to delivery.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Real-time order status</li>
                  <li>Priority sorting</li>
                  <li>Detailed job progress</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="h-full bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-purple-700 dark:text-purple-300">Manufacturing Monitoring</CardTitle>
                <CardDescription>Monitor each stage of your production process with ease.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Job-specific details</li>
                  <li>Employee assignment</li>
                  <li>Progress tracking</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="h-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 border-orange-200 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-orange-700 dark:text-orange-300">User & Item Management</CardTitle>
                <CardDescription>Efficiently manage employees, customers, and product items.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Role-based access control</li>
                  <li>Detailed item forms (BOPP/PET)</li>
                  <li>User profile management</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
