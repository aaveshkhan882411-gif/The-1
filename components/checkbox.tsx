"use client";

import * as React from "react";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      description,
      error,
      id,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) {
    const checkboxId =
      id ??
      (label
        ? `checkbox-${label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`
        : undefined);

    return (
      <div className="w-full">
        <label
          htmlFor={checkboxId}
          className={[
            "flex items-start gap-3",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-white/20 bg-white/[0.04] transition-all checked:border-white checked:bg-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed"
            {...props}
          />

          {(label || description) && (
            <span className="min-w-0">
              {label && (
                <span className="block text-sm font-medium text-white/85">
                  {label}
                </span>
              )}

              {description && (
                <span className="mt-1 block text-xs leading-5 text-white/45">
                  {description}
                </span>
              )}
            </span>
          )}
        </label>

        {error && (
          <p
            role="alert"
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
