"use client";

import * as React from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  function Select(
    {
      options,
      value,
      onChange,
      placeholder = "Select option...",
      className = "",
    },
    ref
  ) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    return (
      <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white/80 text-sm hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <span>
            {value
              ? options.find((opt) => opt.value === value)?.label || value
              : placeholder}
          </span>
          <span className="ml-2 text-white/50">&#9662;</span>
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#080b12]/95 p-1 shadow-2xl backdrop-blur-xl">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className="w-full text-left rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
