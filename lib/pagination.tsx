"use client";

import * as React from "react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  function Pagination(
    {
      page,
      totalPages,
      onPageChange,
      className = "",
    },
    ref,
  ) {
    const safeTotalPages = Math.max(1, totalPages);
    const currentPage = Math.min(
      Math.max(1, page),
      safeTotalPages,
    );

    const pages = React.useMemo(() => {
      const result: (number | "ellipsis")[] = [];

      if (safeTotalPages <= 7) {
        for (let i = 1; i <= safeTotalPages; i += 1) {
          result.push(i);
        }

        return result;
      }

      result.push(1);

      if (currentPage > 4) {
        result.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(
        safeTotalPages - 1,
        currentPage + 1,
      );

      for (let i = start; i <= end; i += 1) {
        result.push(i);
      }

      if (currentPage < safeTotalPages - 3) {
        result.push("ellipsis");
      }

      result.push(safeTotalPages);

      return result;
    }, [currentPage, safeTotalPages]);

    const buttonBase =
      "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20";

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={[
          "flex items-center justify-center gap-1",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={[
            buttonBase,
            "border border-white/10 bg-white/[0.03] text-white/65",
            "hover:bg-white/[0.07] hover:text-white",
            "disabled:cursor-not-allowed disabled:opacity-30",
          ].join(" ")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="inline-flex h-9 min-w-9 items-center justify-center text-white/35"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={
                item === currentPage ? "page" : undefined
              }
              onClick={() => onPageChange(item)}
              className={[
                buttonBase,
                item === currentPage
                  ? "bg-white text-black shadow-lg"
                  : "text-white/55 hover:bg-white/[0.07] hover:text-white",
              ].join(" ")}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === safeTotalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={[
            buttonBase,
            "border border-white/10 bg-white/[0.03] text-white/65",
            "hover:bg-white/[0.07] hover:text-white",
            "disabled:cursor-not-allowed disabled:opacity-30",
          ].join(" ")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

export default Pagination;
