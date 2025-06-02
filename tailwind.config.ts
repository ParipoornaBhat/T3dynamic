import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced color palette with gradients
        teal: {
          50: "hsl(180, 100%, 97%)",
          100: "hsl(180, 100%, 94%)",
          200: "hsl(180, 100%, 87%)",
          300: "hsl(180, 100%, 76%)",
          400: "hsl(180, 100%, 60%)",
          500: "hsl(180, 100%, 34%)", // Main logo color
          600: "hsl(180, 100%, 28%)",
          700: "hsl(180, 100%, 22%)",
          800: "hsl(180, 100%, 16%)",
          900: "hsl(180, 100%, 10%)",
        },
        orange: {
          50: "hsl(25, 100%, 97%)",
          100: "hsl(25, 100%, 94%)",
          200: "hsl(25, 100%, 87%)",
          300: "hsl(25, 100%, 76%)",
          400: "hsl(25, 100%, 65%)",
          500: "hsl(25, 95%, 53%)",
          600: "hsl(25, 90%, 45%)",
          700: "hsl(25, 85%, 38%)",
          800: "hsl(25, 80%, 30%)",
          900: "hsl(25, 75%, 22%)",
        },
        purple: {
          50: "hsl(270, 100%, 97%)",
          100: "hsl(270, 100%, 94%)",
          200: "hsl(270, 100%, 87%)",
          300: "hsl(270, 100%, 76%)",
          400: "hsl(270, 100%, 65%)",
          500: "hsl(270, 90%, 50%)",
          600: "hsl(270, 85%, 40%)",
          700: "hsl(270, 80%, 30%)",
          800: "hsl(270, 75%, 20%)",
          900: "hsl(270, 70%, 10%)",
        },
        pink: {
          50: "hsl(330, 100%, 97%)",
          100: "hsl(330, 100%, 94%)",
          200: "hsl(330, 100%, 87%)",
          300: "hsl(330, 100%, 76%)",
          400: "hsl(330, 100%, 65%)",
          500: "hsl(330, 90%, 50%)",
          600: "hsl(330, 85%, 40%)",
          700: "hsl(330, 80%, 30%)",
          800: "hsl(330, 75%, 20%)",
          900: "hsl(330, 70%, 10%)",
        },
        lime: {
          50: "hsl(80, 100%, 97%)",
          100: "hsl(80, 100%, 94%)",
          200: "hsl(80, 100%, 87%)",
          300: "hsl(80, 100%, 76%)",
          400: "hsl(80, 100%, 65%)",
          500: "hsl(80, 90%, 50%)",
          600: "hsl(80, 85%, 40%)",
          700: "hsl(80, 80%, 30%)",
          800: "hsl(80, 75%, 20%)",
          900: "hsl(80, 70%, 10%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 175, 175, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 175, 175, 0.8)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "loading-dots": {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in-down": "fade-in-down 0.6s ease-out forwards",
        "slide-in-left": "slide-in-left 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "loading-dots": "loading-dots 1.4s ease-in-out infinite both",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, hsl(180, 100%, 34%), hsl(270, 90%, 50%))",
        "gradient-secondary": "linear-gradient(135deg, hsl(25, 95%, 53%), hsl(330, 90%, 50%))",
        "gradient-accent": "linear-gradient(135deg, hsl(180, 100%, 76%), hsl(270, 100%, 76%))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
