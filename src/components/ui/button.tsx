import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "neon"
  size?: "default" | "sm" | "lg"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-white text-black hover:bg-gray-200": variant === "default",
            "border border-white/10 bg-transparent hover:bg-white/5 text-gray-300": variant === "outline",
            "hover:bg-white/5 text-gray-300": variant === "ghost",
            "bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700 border-none": variant === "neon",
            "h-9 px-4 py-2": size === "default",
            "h-7 rounded-lg px-3 text-[10px]": size === "sm",
            "h-11 rounded-xl px-6 py-3 text-sm": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }
