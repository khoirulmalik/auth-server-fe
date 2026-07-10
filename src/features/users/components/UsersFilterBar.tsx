import React from "react";
import { Search, X, ArrowUpDown } from "lucide-react";
import { Role, EngineerSpecialization } from "../../../shared/types/shared.types";
import { ROLES_WITH_SPECIALIZATION } from "../domain/role-rules";
import type {
    UsersFilterState,
    SortField,
    SortDirection,
    StatusFilter,
} from "../hooks/useUsersFilter";

interface Props {
    state: UsersFilterState;
    hasActiveFilters: boolean;
    totalItems: number;
    onChange: (patch: Partial<UsersFilterState>) => void;
    onReset: () => void;
}

export const UsersFilterBar: React.FC<Props> = ({
    state,
    hasActiveFilters,
    totalItems,
    onChange,
    onReset,
}) => {
    // Show specialization filter only when role filter is in the specialization group,
    // OR when role filter is "all" (because the data might still include them).
    const showSpecializationFilter =
        state.role === "all" ||
        ROLES_WITH_SPECIALIZATION.includes(state.role as Role);

    return (
        <div className="card p-4 space-y-3">
            {/* Row 1: Search + Filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <div
                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        style={{ color: "var(--c-text-muted)" }}
                    >
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, NIK, or email..."
                        className="input pl-10"
                        value={state.search}
                        onChange={(e) => onChange({ search: e.target.value })}
                    />
                </div>

                {/* Role filter */}
                <select
                    className="input md:max-w-[160px]"
                    value={state.role}
                    onChange={(e) =>
                        onChange({
                            role: e.target.value as Role | "all",
                            // Clear specialization if new role doesn't support it
                            specialization:
                                e.target.value === "all" ||
                                    ROLES_WITH_SPECIALIZATION.includes(e.target.value as Role)
                                    ? state.specialization
                                    : "all",
                        })
                    }
                >
                    <option value="all">All Roles</option>
                    {Object.values(Role).map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>

                {/* Specialization filter (conditional) */}
                {showSpecializationFilter && (
                    <select
                        className="input md:max-w-[160px]"
                        value={state.specialization}
                        onChange={(e) =>
                            onChange({
                                specialization: e.target.value as EngineerSpecialization | "all",
                            })
                        }
                    >
                        <option value="all">All Specs</option>
                        {Object.values(EngineerSpecialization).map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                )}

                {/* Status filter */}
                <select
                    className="input md:max-w-[140px]"
                    value={state.status}
                    onChange={(e) => onChange({ status: e.target.value as StatusFilter })}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Row 2: Sort + Results count + Clear */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                    <ArrowUpDown
                        className="w-4 h-4"
                        style={{ color: "var(--c-text-muted)" }}
                    />
                    <span
                        className="text-xs uppercase tracking-wider font-semibold"
                        style={{ color: "var(--c-text-muted)" }}
                    >
                        Sort:
                    </span>
                    <select
                        className="input py-1 text-xs max-w-[150px]"
                        value={state.sortField}
                        onChange={(e) =>
                            onChange({ sortField: e.target.value as SortField })
                        }
                    >
                        <option value="createdAt">Date Created</option>
                        <option value="name">Name</option>
                        <option value="nik">NIK</option>
                        <option value="role">Role</option>
                    </select>
                    <select
                        className="input py-1 text-xs max-w-[110px]"
                        value={state.sortDirection}
                        onChange={(e) =>
                            onChange({ sortDirection: e.target.value as SortDirection })
                        }
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className="text-xs"
                        style={{ color: "var(--c-text-secondary)" }}
                    >
                        {totalItems} {totalItems === 1 ? "user" : "users"} found
                    </span>
                    {hasActiveFilters && (
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1 text-xs font-medium transition-colors"
                            style={{ color: "var(--c-accent)" }}
                        >
                            <X className="w-3 h-3" />
                            Clear filters
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};