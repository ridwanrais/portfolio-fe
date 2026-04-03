import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border)] disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2",
  {
    variants: {
      variant: {
        primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90",
        secondary: "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80",
        outline: "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] text-sm",
        ghost: "hover:bg-[var(--muted)] text-[var(--foreground)]",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={buttonVariants({ variant, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
