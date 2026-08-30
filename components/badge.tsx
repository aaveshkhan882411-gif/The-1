import * as React from "react";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

const variantClasses: Record<
  NonNullable<BadgeProps["variant"]>,
  string
> = {
  default: "border-white/10 bg-white/[0.06] text-white/80",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  danger: "border-red-400/20 bg-red-400/10 text-red-300",
  info: "border-sky-400/20 bg-sky-400/10 text-sky-300",
};

const sizeClasses: Record<
  NonNullable<BadgeProps["size"]>,
  string
> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    {
      variant = "default",
      size = "md",
      className = "",
      children,
      ...props
    },
    ref,
  ) {
    return (
      <span
        ref={ref}
        className={[
          "inline-flex items-center rounded-full border font-medium",
          "whitespace-nowrap",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
