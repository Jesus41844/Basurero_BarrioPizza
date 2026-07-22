"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", loading, disabled, children, className, ...props }, ref) => {
    const base =
      "min-touch-target font-heading text-sm tracking-widest uppercase cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 leading-none";

    const variants: Record<string, string> = {
      primary: "bg-red text-white border-none hover:bg-ink-bg active:scale-[0.97] transition-all",
      outline: "bg-transparent text-ink border-2 border-ink hover:bg-ink-bg hover:text-white active:scale-[0.97] transition-all",
      ghost: "bg-transparent text-ink border-none hover:text-red active:scale-[0.97] transition-all",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(base, variants[variant], disabled && "opacity-40 cursor-not-allowed pointer-events-none", className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="80" strokeDashoffset="60" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
