import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, type = "text", label, value, placeholder, id, ...props }, ref) => {
    const inputId =
      id || `floating-${label?.toLowerCase().replace(/\s+/g, "-") || "input"}`;
    const hasValue = value !== undefined && value !== null && value !== "";

    return label ? (
      <div className="relative z-0 w-full">
        <input
          type={type}
          id={inputId}
          ref={ref}
          value={value}
          placeholder=" "
          {...props}
          className={cn(
            "peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute start-0 origin-[0] scale-75 -translate-y-6 top-1 text-sm text-muted-foreground transition-all duration-300",
            "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4",
            "peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:top-3 peer-focus:text-ring",
            hasValue && "scale-75 -translate-y-5 top-4"
          )}
        >
          {label || placeholder}
        </label>
      </div>
    ) : (
      <input
        type={type}
        ref={ref}
        value={value}
        placeholder={placeholder}
        {...props}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
