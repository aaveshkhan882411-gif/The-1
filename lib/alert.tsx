import * as React from "react";

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  title?: string;
}

const variantClasses: Record<
  NonNullable<AlertProps["variant"]>,
  string
> = {
  default: "border-white/10 bg-white/[0.04] text-white/80",
  success:
    "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200",
  warning:
    "border-amber-400/20 bg-amber-400/[0.06] text-amber-200",
  error:
    "border-red-400/20 bg-red-400/[0.06] text-red-200",
  info:
    "border-sky-400/20 bg-sky-400/[0.06] text-sky-200",
};

const iconClasses: Record<
  NonNullable<AlertProps["variant"]>,
  string
> = {
  default: "text-white/60",
  success: "text-emerald-300",
  warning: "text-amber-300",
  error: "text-red-300",
  info: "text-sky-300",
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(
    {
      variant = "default",
      title,
      children,
      className = "",
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role={variant === "error" ? "alert" : "status"}
        className={[
          "flex gap-3 rounded-xl border p-4",
          "backdrop-blur-sm",
          variantClasses[variant],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div
          aria-hidden="true"
          className={[
            "mt-0.5 shrink-0",
            iconClasses[variant],
          ].join(" ")}
        >
          {variant === "success" && "✓"}
          {variant === "warning" && "!"}
          {variant === "error" && "×"}
          {variant === "info" && "i"}
          {variant === "default" && "•"}
        </div>

        <div className="min-w-0 flex-1">
          {title && (
            <h3 className="text-sm font-semibold">
              {title}
            </h3>
          )}

          {children && (
            <div
              className={[
                "text-sm leading-6 text-white/60",
                title ? "mt-1" : "",
              ].join(" ")}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Alert.displayName = "Alert";

export default Alert;
