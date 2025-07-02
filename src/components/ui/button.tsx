import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-out-cubic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-medium hover:shadow-large hover:scale-[1.02] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground shadow-medium hover:shadow-large hover:scale-[1.02] active:scale-[0.98]",
        outline: "border-2 border-border bg-background text-foreground shadow-soft hover:shadow-medium hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground shadow-medium hover:shadow-large hover:scale-[1.02] active:scale-[0.98]",
        ghost: "text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200",
        link: "text-primary underline-offset-4 hover:underline transition-colors duration-200",
        
        // Premium Apple-style variants
        "apple-primary": "bg-gradient-primary text-white shadow-glow hover:shadow-large hover:scale-[1.02] active:scale-[0.98] font-semibold tracking-tight",
        "apple-secondary": "bg-gradient-secondary text-white shadow-glow hover:shadow-large hover:scale-[1.02] active:scale-[0.98] font-semibold tracking-tight",
        "apple-glass": "bg-gradient-glass backdrop-blur-xl border border-white/20 text-foreground shadow-glass hover:shadow-large hover:scale-[1.02] active:scale-[0.98] font-medium",
        "apple-outline": "border-2 border-primary/20 bg-background/80 backdrop-blur-sm text-primary shadow-soft hover:border-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98] font-medium",
        "apple-minimal": "bg-muted/50 text-foreground shadow-none hover:bg-muted hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        
        // Health-specific variants (backwards compatibility)
        health: "bg-gradient-primary text-white shadow-glow hover:shadow-large hover:scale-[1.02] active:scale-[0.98] font-semibold tracking-tight",
        "health-secondary": "bg-gradient-secondary text-white shadow-glow hover:shadow-large hover:scale-[1.02] active:scale-[0.98] font-semibold tracking-tight",
        "health-outline": "border-2 border-primary/20 bg-background/80 backdrop-blur-sm text-primary shadow-soft hover:border-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98] font-medium",
      },
      size: {
        sm: "h-10 px-4 text-sm font-medium",
        default: "h-12 px-6 text-base font-medium",
        lg: "h-14 px-8 text-lg font-semibold",
        xl: "h-16 px-10 text-xl font-semibold",
        icon: "h-12 w-12",
        "icon-sm": "h-10 w-10",
        "icon-lg": "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
