import * as React from "react";

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    {
      orientation = "horizontal",
      decorative = true,
      className = "",
      ...props
    },
    ref,
  ) {
    const isHorizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        className={[
          "shrink-0 bg-white/10",
          isHorizontal
            ? "h-px w-full"
            : "h-full w-px",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";

export default Separator;
