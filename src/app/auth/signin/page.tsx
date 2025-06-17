"use client";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi"
            import { AiOutlineWhatsApp } from "react-icons/ai";
import { Separator } from "@/app/_components/ui/separator"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
 
import React from "react";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { toast } from "sonner"
import { signIn } from "next-auth/react"




export default function LoginPage() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please enter both email and password")
      return;
    }

    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        if(result.error === "CredentialsSignin") {
          toast.error("Invalid email or password. Please try again.")
        }
        else {
          toast.error("An unexpected error occurred. Please try again later.")
        }
      } else if (result?.ok) {
         document.cookie = [
                      "flash_success=Login successful!.",
                      "max-age=10",
                      "path=/",
                    ].join("; ");
        window.location.href = "/"
      }
      else {
        toast.error("An unexpected error occurred. Please try again later.")
      }
      return;
    }).catch(() => {
  toast.error("Something went wrong while signing in.");
});
    console.log("Login attempt:", { email, password })
  } 
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  }

const { theme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check the theme only after the component mounts on the client
    setIsDark(theme === 'dark' || resolvedTheme === 'dark');
  }, [theme, resolvedTheme]);

  const logoSrc = isDark ? "/t_dark.png" : "/t_light.png";  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-teal-100 via-purple-100 to-orange-100 dark:from-teal-950 dark:via-purple-900 dark:to-orange-1000 flex items-center justify-center px-4">
       <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="w-full max-w-sm"
      >
        <Card className="mx-auto bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900 shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center pb-8">


            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-40 h-16 flex items-center justify-center mb-4"
            >
              <Image
                src={logoSrc}
                alt="Dynamic Packaging Logo"
                width={180}
                height={32}
                className="h-auto sm:h-auto md:h-auto w-auto transition-all duration-300"
              />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back!
            </CardTitle>
            <CardDescription className="text-lg">
              Sign in to manage your orders and manufacturing process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              {/* Email input */}
              <motion.div variants={inputVariants} className="grid gap-2 relative">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <HiOutlineMail size={20} />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        passwordRef.current?.focus();
                      }
                    }}
                    className="h-11 pl-10 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 border-2 focus:border-primary transition-all duration-300"
                  />
                 
                </div>
              </motion.div>

              {/* Password input with toggle */}
              <motion.div variants={inputVariants} className="grid gap-2 relative">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgotpassword"
                    className="ml-auto inline-block text-sm underline text-primary hover:text-primary/80 transition-colors duration-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <HiOutlineLockClosed size={20} />
                  </span>
                  <Input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pl-10 pr-10 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 border-2 focus:border-primary transition-all duration-300"
                  />
                 
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Login Button */}
              <motion.div variants={buttonVariants}>
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Button>
              </motion.div>
            </div>

            {/* Signup Link */}
 <div className="relative w-full">
  <Separator />
  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-sm text-gray-700 bg-gradient-to-br from-white/70 to-teal-50/70 dark:from-gray-900/80 dark:to-teal-900/80 backdrop-blur-sm rounded-md">
    Or continue with
  </span>
</div>

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.7 }}
  className="mt-6 text-center text-sm text-muted-foreground"
>
  Don&apos;t have an account yet?{" "}
  <Link
    href="https://wa.me/7338652017"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center underline text-primary hover:text-primary/80 transition-colors duration-300"
  >
    <AiOutlineWhatsApp className="mr-1 h-5 w-5" />
    Contact us on WhatsApp to create your account.
  </Link>
</motion.div>

          </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
