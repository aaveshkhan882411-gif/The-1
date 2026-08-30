"use client";

import * as React from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    {
      content,
      children,
      side = "top",
      delay = 300,
      className = "",
    },
    ref,
  ) {
    const [open, setOpen] = React.useState(false);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

    const show = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setOpen(true);
      }, delay);
    };

    const hide = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setOpen(false);
    };

    React.useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, []);

    const positionClasses: Record<
      NonNullable<TooltipProps["side"]>,
      string
    > = {
      top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
      bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
      left: "right-full top-1/2 mr-2 -translate-y-1/2",
      right: "left-full top-1/2 ml-2 -translate-y-1/2",
    };

    const child = React.cloneElement(children, {
      onMouseEnter: (event: React.MouseEvent) => {
        children.props.onMouseEnter?.(event);
        show();
      },
      onMouseLeave: (event: React.MouseEvent) => {
        children.props.onMouseLeave?.(event);
        hide();
      },
      onFocus: (event: React.FocusEvent) => {
        children.props.onFocus?.(event);
        show();
      },
      onBlur: (event: React.FocusEvent) => {
        children.props.onBlur?.(event);
        hide();
      },
    });

    return (
      <div
        ref={ref}
        className="relative inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {child}

        {open && (
          <div
            role="tooltip"
            className={[
              "pointer-events-none absolute z-50 whitespace-nowrap",
              "rounded-lg border border-white/10",
              "bg-[#080b12]/95 px-3 py-2",
              "text-xs font-medium text-white/90",
              "shadow-xl shadow-black/30 backdrop-blur-xl",
              "animate-in fade-in zoom-in-95 duration-150",
              positionClasses[side],
              className,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {content}
          </div>
        )}
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
