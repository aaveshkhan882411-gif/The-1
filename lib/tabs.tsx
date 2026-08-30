"use client";

import * as React from "react";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  function Tabs(
    {
      tabs,
      value,
      defaultValue,
      onValueChange,
      children,
      className = "",
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? tabs[0]?.value ?? "",
    );

    const activeValue = value ?? internalValue;

    const handleChange = (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    };

    return (
      <div
        ref={ref}
        className={["w-full", className]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          role="tablist"
          aria-label="Tabs"
          className="flex w-full gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-1"
        >
          {tabs.map((tab) => {
            const active = activeValue === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={active}
                disabled={tab.disabled}
                onClick={() => handleChange(tab.value)}
                className={[
                  "shrink-0 rounded-lg px-4 py-2.5",
                  "text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white text-black shadow-lg"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white",
                  tab.disabled
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {children}
      </div>
    );
  },
);

Tabs.displayName = "Tabs";

export default Tabs;
