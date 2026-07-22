"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="label">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "border-2 border-ink bg-white px-3 py-2.5 font-body text-sm text-ink",
            "placeholder:text-mid",
            "focus:outline-[3px] focus:outline-ink focus:-outline-offset-[3px]",
            "transition-all duration-150",
            error && "border-red",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="font-body text-xs text-red">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="font-body text-xs text-mid">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
