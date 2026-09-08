"use client";

import type { ReactNode } from "react";

/**
 * Submit button that asks for confirmation before the surrounding form submits.
 * Used for destructive admin actions (delete).
 */
export function ConfirmButton({
  message,
  className,
  children,
  ...rest
}: {
  message: string;
  className?: string;
  children: ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type">) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
