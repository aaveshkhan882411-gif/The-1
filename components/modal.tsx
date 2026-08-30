"use client";

import * as React from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  function Modal(
    {
      open,
      onClose,
      title,
      description,
      children,
      className = "",
      closeOnOverlayClick = true,
    },
    ref,
  ) {
    React.useEffect(() => {
      if (!open) {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open, onClose]);

    if (!open) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="presentation"
      >
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          onMouseDown={
            closeOnOverlayClick ? onClose : undefined
          }
          aria-hidden="true"
        />

        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={
            title ? "growthai-modal-title" : undefined
          }
          aria-describedby={
            description
              ? "growthai-modal-description"
              : undefined
          }
          className={[
            "relative z-10 w-full max-w-lg",
            "rounded-2xl border border-white/10",
            "bg-[#080b12]/95 text-white",
            "shadow-2xl shadow-black/40",
            "backdrop-blur-xl",
            "animate-in fade-in zoom-in-95 duration-200",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div className="min-w-0">
              {title && (
                <h2
                  id="growthai-modal-title"
                  className="text-lg font-semibold tracking-tight"
                >
                  {title}
                </h2>
              )}

              {description && (
                <p
                  id="growthai-modal-description"
                  className="mt-1 text-sm leading-6 text-white/55"
                >
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="shrink-0 rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
