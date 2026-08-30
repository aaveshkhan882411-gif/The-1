import * as React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(function Textarea(
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
  const textareaId =
    id ??
    (label
      ? `textarea-${label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`
      : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-2 block text-sm font-medium text-white/85"
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error
            ? `${textareaId}-error`
            : hint
              ? `${textareaId}-hint`
              : undefined
        }
        className={[
          "min-h-32 w-full resize-y rounded-xl border bg-white/[0.04]",
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
          id={`${textareaId}-error`}
          role="alert"
          className="mt-2 text-xs text-red-400"
        >
          {error}
        </p>
      )}

      {!error && hint && (
        <p
          id={`${textareaId}-hint`}
          className="mt-2 text-xs text-white/45"
        >
          {hint}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
