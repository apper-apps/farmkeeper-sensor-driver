import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-sm hover:shadow-md",
    accent: "bg-accent text-white hover:bg-accent/90 shadow-sm hover:shadow-md",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "hover:bg-surface text-primary",
    success: "bg-success text-white hover:bg-success/90",
    warning: "bg-warning text-white hover:bg-warning/90",
    error: "bg-error text-white hover:bg-error/90"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;