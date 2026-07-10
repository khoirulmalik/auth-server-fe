import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<Props> = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
}) => {
    if (totalItems === 0) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    // Generate page numbers with ellipsis
    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);

        if (currentPage > 3) pages.push("...");

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);

        if (currentPage < totalPages - 2) pages.push("...");

        pages.push(totalPages);
        return pages;
    };

    return (
        <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t"
            style={{ borderColor: "var(--c-border)" }}
        >
            {/* Info */}
            <div
                className="text-xs"
                style={{ color: "var(--c-text-secondary)" }}
            >
                Showing <span className="font-semibold">{startItem}</span>–
                <span className="font-semibold">{endItem}</span> of{" "}
                <span className="font-semibold">{totalItems}</span>
            </div>

            <div className="flex items-center gap-3">
                {/* Page size */}
                <div className="flex items-center gap-2">
                    <label
                        className="text-xs"
                        style={{ color: "var(--c-text-muted)" }}
                    >
                        Per page:
                    </label>
                    <select
                        className="input py-1 text-xs max-w-[80px]"
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>

                {/* Page nav */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ color: "var(--c-text-secondary)" }}
                        onMouseEnter={(e) => {
                            if (!(e.currentTarget as HTMLButtonElement).disabled) {
                                (e.currentTarget as HTMLElement).style.background =
                                    "var(--c-surface-hover)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {getPageNumbers().map((p, idx) =>
                        p === "..." ? (
                            <span
                                key={`ellipsis-${idx}`}
                                className="px-2 text-xs"
                                style={{ color: "var(--c-text-muted)" }}
                            >
                                …
                            </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className="min-w-[32px] h-8 rounded-md text-xs font-medium transition-colors"
                                style={{
                                    background:
                                        p === currentPage ? "var(--c-accent)" : "transparent",
                                    color:
                                        p === currentPage
                                            ? "var(--c-text-inverse)"
                                            : "var(--c-text)",
                                }}
                                onMouseEnter={(e) => {
                                    if (p !== currentPage) {
                                        (e.currentTarget as HTMLElement).style.background =
                                            "var(--c-surface-hover)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (p !== currentPage) {
                                        (e.currentTarget as HTMLElement).style.background =
                                            "transparent";
                                    }
                                }}
                            >
                                {p}
                            </button>
                        ),
                    )}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ color: "var(--c-text-secondary)" }}
                        onMouseEnter={(e) => {
                            if (!(e.currentTarget as HTMLButtonElement).disabled) {
                                (e.currentTarget as HTMLElement).style.background =
                                    "var(--c-surface-hover)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};