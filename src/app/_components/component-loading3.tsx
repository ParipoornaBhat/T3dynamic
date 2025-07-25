import { Loader2 } from "lucide-react";

interface ComponentLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function ComponentLoading({
  message = "Loading...",
  size = "md",
}: ComponentLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-primary/30 animate-spin`}
          style={{ animationDirection: "reverse", animationDuration: "2s" }}
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}
