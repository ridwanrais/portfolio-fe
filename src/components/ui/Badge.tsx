import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded bg-[var(--muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors",
      className
    )}>
      {children}
    </span>
  );
}
