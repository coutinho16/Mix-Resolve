import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-laranja text-branco-puro hover:opacity-90 disabled:opacity-50",
  secondary:
    "bg-branco-puro text-preto border border-neutro-2 hover:bg-neutro-3 disabled:opacity-50",
  ghost: "bg-transparent text-preto hover:bg-neutro-3 disabled:opacity-50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold font-titulo transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
