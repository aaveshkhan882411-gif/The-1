"use client";

import * as React from "react";

export interface DropdownMenuItem {
  id: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  className?: string;
}

const DropdownMenu = React.forwardRef<
  HTMLDivElement,
  DropdownMenuProps
>(function DropdownMenu(
  {
    trigger,
    items,
    align = "right",
    className = "",
  },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => containerRef.current!);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (!containerRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleItemSelect = (item: DropdownMenuItem) => {
    if (item.disabled) return;

    item.onSelect?.();
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={[
        "relative inline-block text-left",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white/70 transition-all duration-200 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          className={[
            "absolute z-50 mt-2 min-w-48 overflow-hidden rounded-xl",
            "border border-white/10 bg-[#080b12]/95 p-1",
            "shadow-2xl shadow-black/40 backdrop-blur-xl",
            "animate-in fade-in zoom-in-95 duration-150",
            align === "right"
              ? "right-0 origin-top-right"
              : "left-0 origin-top-left",
          ].join(" ")}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => handleItemSelect(item)}
              className={[
                "flex w-full items-center rounded-lg px-3 py-2.5",
                "text-left text-sm
