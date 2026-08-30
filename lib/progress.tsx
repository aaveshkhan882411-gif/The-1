import * as React from "react";

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showValue?: boolean;
  label?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    {
      value = 0,
      max = 100,
      showValue = false,
      label,
      className = "",
      ...props
    },
    ref,
  ) {
    const safeMax = max > 0 ? max : 100;
    const safeValue = Math.min(
      Math.max(value, 0),
      safeMax,
    );
    const percentage = (safeValue / safeMax) * 100;

    return (
      <div
        ref={ref}
        className={["w-full", className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {(label || showValue) && (
          <div className="mb-2 flex items-center justify-between gap-3">
            {label && (
              <span className="text-sm font-medium text-white/75">
                {label}
              </span>
            )}

            {showValue && (
              <span className="text-xs text-white/50">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-valuenow={safeValue}
          className="h-2 w-full overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-full rounded-full bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";

export default Progress;
