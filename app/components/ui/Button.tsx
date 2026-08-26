import React from "react";

type ButtonProps = {
      children: React.ReactNode;
      variant?: "primary" | "secondary" | "danger";
      size?: "sm" | "md" | "lg";
      className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
      children,
      variant = "primary",
      size = "md",
      className = "",
      ...props
}: ButtonProps) => {
      const base =
            "cursor-pointer rounded-sm font-medium transition-all duration-300";

      const variants = {
            primary: "bg-white text-black hover:text-black/80",
            secondary:
                  "border border-border bg-transparent text-white hover:bg-white/5 hover:-translate-y-0.5",
            danger: "bg-red-500/50 text-white hover:bg-red-500 border border-red-500",
      };

      const sizes = {
            sm: "px-3 py-1.5 text-base",
            md: "px-4 py-1.5 text-lg",
            lg: "px-6 py-3 text-xl",
      };

      return (
            <button
                  className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
                  {...props}
            >
                  {children}
            </button>
      );
};

export default Button;
