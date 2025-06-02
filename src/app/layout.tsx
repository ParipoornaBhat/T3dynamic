"use client";

import "@/styles/globals.css";
import { ThemeProvider } from "@/app/_components/ui/theme";
import { Footer } from "@/app/_components/footer";
import { Navbar } from "@/app/_components/navbar";
import { WhatsAppButton } from "@/app/_components/whatsapp-button";
import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
  session, // Receiving session prop
}: Readonly<{ children: React.ReactNode, session: any }>) {
  return (
    
     <html lang="en" suppressHydrationWarning>
      <body >
        
        <TRPCReactProvider>
          <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <Navbar /> {/* Passing session to Navbar */}
              <main className="flex-1">{children}</main>
              <WhatsAppButton />
              <Footer />
            </div>
          </ThemeProvider>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
    
  );
}
