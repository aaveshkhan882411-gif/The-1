import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      hint,
      id,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) {
    const inputId =
      id ??
      (label
        ? `input-${label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`
        : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-white/85"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          className={[
            "w-full rounded-xl border bg-white/[0.04]",
            "px-4 py-3 text-sm text-white",
            "placeholder:text-white/35",
            "outline-none transition-all duration-200",
            "focus:bg-white/[0.06]",
            "focus:ring-2 focus:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-500/60 focus:ring-red-500/20"
              : "border-white/10 hover:border-white/20",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </p>
        )}

        {!error && hint && (
          <p
            id={`${inputId}-hint`}
            className="mt-2 text-xs text-white/45"
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
