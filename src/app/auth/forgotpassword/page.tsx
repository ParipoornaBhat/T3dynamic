"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiOutlineMail } from "react-icons/hi";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Separator } from "@/app/_components/ui/separator";
import { Button } from "@/app/_components/ui/button";
import { toast } from "sonner";
import { api } from "@/trpc/react";

export default function ForgotPassword() {
  // theme logo switcher
  const { theme, resolvedTheme } = useTheme();
  const logoSrc =
    theme === "dark" || resolvedTheme === "dark" ? "/t_dark.png" : "/t_light.png";

  // form state
  const [email, setEmail] = useState("");

  const requestReset = api.pass.requestPasswordReset.useMutation({
    onSuccess: () => {
      toast.success("If that email exists, a reset link has been sent.");
      setEmail("");
    },
    onError: (err) => toast.error(err.message || "Something went wrong"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    requestReset.mutate({ email });
  };

  /* ---------- animations ---------- */
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: 0.3 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.5 },
    },
  };
  /* -------------------------------- */

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-teal-100 via-purple-100 to-orange-100 dark:from-teal-950 dark:via-purple-900 dark:to-orange-1000 flex items-center justify-center px-4">
      <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full max-w-sm">
        <Card className="mx-auto bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900 shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-40 h-16 flex items-center justify-center mb-4"
            >
              <Image src={logoSrc} alt="Dynamic Packaging Logo" width={180} height={32} />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-lg">
              Enter your email and we’ll send you a reset link.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={inputVariants} className="grid gap-2">
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
                    className="h-11 pl-10 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900 dark:to-purple-900 border-2 focus:border-primary transition-all duration-300"
                  />
                </div>
              </motion.div>

              <motion.div variants={buttonVariants}>
                <Button
                  type="submit"
                  disabled={requestReset.isPending}
                  className="w-full h-11 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60"
                >
                  {requestReset.isPending ? "Sending..." : "Send Reset Link"}
                </Button>
              </motion.div>
            </form>

            <div className="relative w-full">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-sm text-gray-700 bg-gradient-to-br from-white/70 to-teal-50/70 dark:from-gray-900/80 dark:to-teal-900/80 backdrop-blur-sm rounded-md">
                Or contact us
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-sm text-muted-foreground"
            >
              Need help?{" "}
              <Link
                href="https://wa.me/7338652017"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center underline text-primary hover:text-primary/80 transition-colors duration-300"
              >
                <AiOutlineWhatsApp className="mr-1 h-5 w-5" />
                Chat on WhatsApp.
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
