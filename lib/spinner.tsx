import * as React from "react";

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeClasses: Record<
  NonNullable<SpinnerProps["size"]>,
  string
> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  function Spinner(
    {
      size = "md",
      label = "Loading",
      className = "",
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={[
          "inline-flex items-center justify-center",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <span
          aria-hidden="true"
          className={[
            "animate-spin rounded-full",
            "border-white/20 border-t-white",
            sizeClasses[size],
          ].join(" ")}
        />

        <span className="sr-only">{label}</span>
      </div>
    );
  },
);

Spinner.displayName = "Spinner";

export default Spinner;
