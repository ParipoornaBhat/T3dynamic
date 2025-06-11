"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X, PanelLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                CONTEXT                                     */
/* -------------------------------------------------------------------------- */

type SidebarContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider.");
  return ctx;
};

/* -------------------------------------------------------------------------- */
/*                                PROVIDER                                    */
/* -------------------------------------------------------------------------- */

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [open, setOpen] = React.useState(true); // auto‑open on desktop, collapse on mobile

  React.useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* keep sidebar closed on mobile, open on desktop */
  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const value = React.useMemo(() => ({ open, setOpen, isMobile }), [open, isMobile]);

  return (
    <SidebarContext.Provider value={value}>
      <div ref={ref} className={cn("flex min-h-screen", className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

/* -------------------------------------------------------------------------- */
/*                             SIDEBAR SHELL                                  */
/* -------------------------------------------------------------------------- */

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, isMobile } = useSidebar();

    return (
      <>
        {isMobile && open && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
        )}

        <div
  ref={ref}
  className={cn(
    "flex h-full flex-col border-r bg-background transition-all duration-450 ease-in",
    /* desktop positioning */
    "md:relative",
    /* desktop width toggle */
    open ? "md:w-[280px]" : "md:w-[75px]",
    /* mobile positioning */
"",
    "fixed inset-y-0 left-0  z-50 w-[280px]"
,
    /* mobile slide transition */
    `${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`,
    className
  )}
  {...props}
>

          {isMobile && (
            <div className="flex justify-end p-4 md:hidden ">
              <button aria-label="Close sidebar" onClick={() => setOpen(false)}>
                <X className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>
          )}
          {children}
        </div>
      </>
    );
  }
);
Sidebar.displayName = "Sidebar";

/* -------------------------------------------------------------------------- */
/*                             SUB‑SECTIONS                                   */
/* -------------------------------------------------------------------------- */

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-4", className)} {...props} />
  )
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 overflow-auto", className)} {...props} />
  )
);
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-auto p-4", className)} {...props} />
  )
);
SidebarFooter.displayName = "SidebarFooter";

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-2", className)} {...props} />
);
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-1", className)} {...props} />
);
SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => <ul ref={ref} className={cn("space-y-1", className)} {...props} />
);
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />
);
SidebarMenuItem.displayName = "SidebarMenuItem";

/* -------------------------------------------------------------------------- */
/*                            MENU BUTTON                                     */
/* -------------------------------------------------------------------------- */

const buttonVariants = cva(
  "flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground",
  {
    variants: {
      size: {
        default: "h-9 px-2",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-3",
      },
    },
    defaultVariants: { size: "default" },
  }
);

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & { asChild?: boolean; isActive?: boolean }
>(({ className, size, asChild, isActive, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const { open } = useSidebar();

  return (
    <Comp
      ref={ref}
      className={cn(
        buttonVariants({ size }),
        isActive && "bg-accent text-accent-foreground",
        !open && "md:justify-center md:px-0 md:w-10 md:h-10",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

/* -------------------------------------------------------------------------- */
/*                               TRIGGER                                      */
/* -------------------------------------------------------------------------- */

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { setOpen } = useSidebar();
    return (
      <button
        ref={ref}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none",
          className
        )}
        {...props}
      >
        <PanelLeft className="h-5 w-5" />
      </button>
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";
