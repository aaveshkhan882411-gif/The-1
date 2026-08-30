import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses: Record<
  NonNullable<ButtonProps["variant"]>,
  string
> = {
  primary:
    "bg-white text-black hover:bg-neutral-200 focus-visible:ring-white",
  secondary:
    "border border-white/15 bg-white/5 text-white hover:bg-white/10 focus-visible:ring-white/40",
  ghost:
    "bg-transparent text-white hover:bg-white/10 focus-visible:ring-white/30",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500",
};

const sizeClasses: Record<
  NonNullable<ButtonProps["size"]>,
  string
> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-base",
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    className = "",
    type = "button",
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-xl font-medium",
        "transition-all duration-200",
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-black",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
