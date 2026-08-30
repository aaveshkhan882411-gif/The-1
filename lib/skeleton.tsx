import * as React from "react";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

const roundedClasses: Record<
  NonNullable<SkeletonProps["rounded"]>,
  string
> = {
  none: "rounded-none",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-xl",
  full: "rounded-full",
};

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    {
      width,
      height,
      rounded = "md",
      className = "",
      style,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={[
          "animate-pulse bg-white/10",
          roundedClasses[rounded],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          width,
          height,
          ...style,
        }}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

export default Skeleton;
