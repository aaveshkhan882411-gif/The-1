"use client";

import * as React from "react";

export interface SwitchProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange"
  > {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      label,
      description,
      disabled = false,
      className = "",
      id,
      ...props
    },
    ref,
  ) {
    const [internalChecked, setInternalChecked] =
      React.useState(defaultChecked);

    const isChecked = checked ?? internalChecked;

    const handleToggle = () => {
      if (disabled) return;

      const nextValue = !isChecked;

      if (checked === undefined) {
        setInternalChecked(nextValue);
      }

      onCheckedChange?.(nextValue);
    };

    return (
      <div className="flex items-start justify-between gap-4">
        {(label || description) && (
          <div className="min-w-0">
            {label && (
              <label
                htmlFor={id}
                className="block cursor-pointer text-sm font-medium text-white/85"
              >
                {label}
              </label>
            )}

            {description && (
              <p className="mt-1 text-xs leading-5 text-white/45">
                {description}
              </p>
            )}
          </div>
        )}

        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          onClick={handleToggle}
          className={[
            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full",
            "border transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-white/20",
            isChecked
              ? "border-white bg-white"
              : "border-white/15 bg-white/10",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        >
          <span
            aria-hidden="true"
            className={[
              "block h-4 w-4 rounded-full transition-transform duration-200",
              isChecked
                ? "translate-x-6 bg-black"
                : "translate-x-1 bg-white/70",
            ].join(" ")}
          />
        </button>
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
