"use client";

import * as React from "react";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  name: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      value,
      defaultValue,
      onValueChange,
      options,
      name,
      label,
      error,
      disabled = false,
      className = "",
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? "",
    );

    const selectedValue = value ?? internalValue;

    const handleChange = (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={label}
        className={["w-full", className].filter(Boolean).join(" ")}
      >
        {label && (
          <div className="mb-3 text-sm font-medium text-white/85">
            {label}
          </div>
        )}

        <div className="space-y-2">
          {options.map((option) => {
            const inputId = `${name}-${option.value}`;

            return (
              <label
                key={option.value}
                htmlFor={inputId}
                className={[
                  "flex items-start gap-3 rounded-xl border p-3",
                  "transition-all duration-200",
                  disabled || option.disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer",
                  selectedValue === option.value
                    ? "border-white/25 bg-white/[0.06]"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]",
                ].join(" ")}
              >
                <input
                  id={inputId}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={selectedValue === option.value}
                  disabled={disabled || option.disabled}
                  onChange={() => handleChange(option.value)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-white"
                />

                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white/85">
                    {option.label}
                  </span>

                  {option.description && (
                    <span className="mt-1 block text-xs leading-5 text-white/45">
                      {option.description}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>

        {error && (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
