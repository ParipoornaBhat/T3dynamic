import { Loader2 } from "lucide-react"

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-orange-50 dark:from-teal-900 dark:via-purple-900 dark:to-orange-900 text-foreground">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <div
          className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-primary animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1s" }}
        />
      </div>
      <p className="mt-6 text-xl font-medium animate-pulse">Loading content...</p>
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-primary rounded-full animate-loading-dots" style={{ animationDelay: "0s" }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-loading-dots" style={{ animationDelay: "0.2s" }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-loading-dots" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  )
}
