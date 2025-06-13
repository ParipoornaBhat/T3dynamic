"use client";

import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { motion } from "framer-motion";
import type { Session } from "next-auth";
import { useTheme } from "next-themes";
import { useEffect ,useState} from "react";
import { V } from "node_modules/framer-motion/dist/types.d-CtuPurYT";
import { useSession } from "next-auth/react";
export default function HomePage() {
const { data: session } = useSession()
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
const role = session?.user.role
  const perms = session?.user.permissions ?? []
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

  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    console.log("Theme:", theme);
    console.log("Resolved theme:", resolvedTheme);
  }, [theme, resolvedTheme]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-teal-100 via-purple-100 to-orange-100 dark:from-teal-950 dark:via-purple-900 dark:to-orange-1000 relative">
      {/* 
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        src="https://video.wixstatic.com/video/a8353f_5a8a2d92ebef451d959a2d592bc0abf5/1080p/mp4/file.mp4"
      />
      */}
       

      <div className="absolute top-0 left-0 w-full h-full  z-10" />

      <motion.div
        className="relative z-20 flex flex-col items-center justify-center px-4 py-12 md:py-24 lg:py-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl text-center space-y-6">
          <motion.h1
  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent 
    dark:bg-gradient-to-r dark:from-teal-600 dark:via-purple-600 dark:to-amber-600 
    bg-gradient-to-r from-teal-300 via-purple-200 to-amber-300"
  style={{
    WebkitTextStroke: "2px black",
  }}
  variants={itemVariants}
>
  Premium Packaging That Elevates Your Brand
</motion.h1>

          <motion.p
            className="text-lg text-muted-foreground md:text-xl"
            style={{
              WebkitTextStroke: "0.2px black",
            }}
            variants={itemVariants}
          >
            For over 25 years, Dynamic Packaging has been a trusted partner in high-quality, customized packaging that reflects your brand’s excellence.
          </motion.p>
          <motion.div
            className="flex flex-col gap-4 sm:flex-row justify-center"
            variants={itemVariants}
          >
            <Link href="/about">
              <Button
                size="lg"
                className="bg-blue-600 text-white rounded-lg py-3 px-6 transition-all duration-300 hover:bg-blue-700 hover:shadow-md dark:bg-blue-800 dark:text-white dark:hover:bg-blue-900"
              >
                About Us
              </Button>
            </Link>
        {!session && 
            <Link href="/auth/signin">
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 rounded-lg py-3 px-6 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-700 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600"
              >
                Login
              </Button>
            </Link>
            }
            {session && <>
            {role!=="CUSTOMER" &&
            <Link href="/dashboard">
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 rounded-lg py-3 px-6 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-700 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600"
              >
                Dashboard
              </Button>
            </Link>
        }
        { role=="CUSTOMER" &&
            <Link href="/items">
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 rounded-lg py-3 px-6 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-700 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600"
              >
                Order Items
              </Button>
            </Link>
          }
          </>}

          </motion.div>
        </div>
<motion.div
  className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full"
  variants={containerVariants}
>
  <motion.div variants={cardVariants} whileHover="hover">
    <Card className="h-full bg-gradient-to-br from-sky-300 to-sky-350 dark:from-sky-900 dark:to-sky-950 border-sky-400 dark:border-sky-600 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-sky-700 dark:text-sky-300">
          Customized Solutions
        </CardTitle>
        <CardDescription>
          End-to-end packaging tailored to your specific business needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-1">
          <li>Design to delivery under one roof</li>
          <li>Flexible packaging formats</li>
          <li>High-impact brand storytelling</li>
        </ul>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div variants={cardVariants} whileHover="hover">
    <Card className="h-full bg-gradient-to-br from-gray-300 to-gray-350 dark:from-gray-900 dark:to-gray-950 border-gray-400 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-gray-700 dark:text-gray-300">
          Speed & Efficiency
        </CardTitle>
        <CardDescription>
          Fast turnaround and consistent quality—on time, every time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-1">
          <li>Time-bound delivery with precision</li>
          <li>Streamlined production workflows</li>
          <li>Logistic support across regions</li>
        </ul>
      </CardContent>
    </Card>
  </motion.div>

  <motion.div variants={cardVariants} whileHover="hover">
    <Card className="h-full bg-gradient-to-br from-green-300 to-green-350 dark:from-green-900 dark:to-green-950 border-green-400 dark:border-green-600 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-green-700 dark:text-green-300">
          Trusted by Industry Leaders
        </CardTitle>
        <CardDescription>
          Chosen across industries for our quality, commitment, and innovation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-1">
          <li>25+ years of manufacturing excellence</li>
          <li>Preferred partner for B2B packaging</li>
          <li>Reputation built on trust & results</li>
        </ul>
      </CardContent>
    </Card>
  </motion.div>
</motion.div>

      </motion.div>
    </div>
  );
}
