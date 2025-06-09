'use client';

import { LuSun, LuMoon } from "react-icons/lu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/app/_components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure correct theme is loaded after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
       <LuMoon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
         <LuSun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
