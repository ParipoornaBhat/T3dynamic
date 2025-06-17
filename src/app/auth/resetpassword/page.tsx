"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/_components/ui/card";

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const { data, isFetching } = api.pass.verifyResetToken.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  useEffect(() => {
    if (!isFetching && (!token || data?.valid === false)) {
      document.cookie = [
        "flash_error=Invalid or expired reset link.",
        "max-age=10",
        "path=/",
      ].join("; ");
      window.location.href = "/auth/forgotpassword";
    }
  }, [data?.valid, isFetching, token, router]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const resetMutation = api.pass.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Password updated. You can sign in now.");
      router.replace("/auth/signin");
    },
    onError: (err) => toast.error(err.message ?? "Failed to reset password"),
  });

  if (isFetching || data?.valid === false) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-purple-100 to-orange-100 dark:from-teal-950 dark:via-purple-900 dark:to-orange-1000 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <Card className="shadow-xl bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900 border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Set New Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="newpass">New Password</Label>
                <Input
                  id="newpass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmpass">Confirm Password</Label>
                <Input
                  id="confirmpass"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? "Saving…" : "Save Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    resetMutation.mutate({ token, newPassword: password });
  }
}

// ✅ Wrap in Suspense to avoid build error
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
