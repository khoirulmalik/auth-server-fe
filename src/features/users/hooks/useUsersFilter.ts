import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { User } from "../types/users.types";
import { Role, EngineerSpecialization } from "../../../shared/types/shared.types";

export type StatusFilter = "all" | "active" | "inactive";
export type SortField = "name" | "nik" | "role" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface UsersFilterState {
    search: string;
    role: Role | "all";
    specialization: EngineerSpecialization | "all";
    status: StatusFilter;
    sortField: SortField;
    sortDirection: SortDirection;
    page: number;
    pageSize: number;
}

const DEFAULT_STATE: UsersFilterState = {
    search: "",
    role: "all",
    specialization: "all",
    status: "all",
    sortField: "createdAt",
    sortDirection: "desc",
    page: 1,
    pageSize: 10,
};

/**
 * Manages client-side filtering, sorting, and pagination for users list.
 * State is persisted in URL search params so users can bookmark & share filtered views.
 */
export function useUsersFilter(users: User[]) {
    const [searchParams, setSearchParams] = useSearchParams();

    // ─── Parse state from URL ──────────────────────────────────────────────
    const state: UsersFilterState = useMemo(
        () => ({
            search: searchParams.get("q") ?? DEFAULT_STATE.search,
            role: (searchParams.get("role") as Role | "all") ?? DEFAULT_STATE.role,
            specialization:
                (searchParams.get("spec") as EngineerSpecialization | "all") ??
                DEFAULT_STATE.specialization,
            status: (searchParams.get("status") as StatusFilter) ?? DEFAULT_STATE.status,
            sortField: (searchParams.get("sort") as SortField) ?? DEFAULT_STATE.sortField,
            sortDirection:
                (searchParams.get("dir") as SortDirection) ?? DEFAULT_STATE.sortDirection,
            page: parseInt(searchParams.get("page") ?? "1", 10),
            pageSize: parseInt(searchParams.get("size") ?? "10", 10),
        }),
        [searchParams],
    );

    // ─── Setters that update URL ───────────────────────────────────────────
    const update = (patch: Partial<UsersFilterState>) => {
        const next = { ...state, ...patch };

        // Reset page when any filter changes
        const filterChanged =
            patch.search !== undefined ||
            patch.role !== undefined ||
            patch.specialization !== undefined ||
            patch.status !== undefined ||
            patch.sortField !== undefined ||
            patch.sortDirection !== undefined;
        if (filterChanged && patch.page === undefined) {
            next.page = 1;
        }

        const params: Record<string, string> = {};
        if (next.search) params.q = next.search;
        if (next.role !== "all") params.role = next.role;
        if (next.specialization !== "all") params.spec = next.specialization;
        if (next.status !== "all") params.status = next.status;
        if (next.sortField !== DEFAULT_STATE.sortField) params.sort = next.sortField;
        if (next.sortDirection !== DEFAULT_STATE.sortDirection) params.dir = next.sortDirection;
        if (next.page !== 1) params.page = next.page.toString();
        if (next.pageSize !== 10) params.size = next.pageSize.toString();

        setSearchParams(params);
    };

    const reset = () => {
        setSearchParams({});
    };

    const hasActiveFilters =
        state.search !== "" ||
        state.role !== "all" ||
        state.specialization !== "all" ||
        state.status !== "all";

    // ─── Apply filters & sort & pagination ─────────────────────────────────
    const filtered = useMemo(() => {
        let result = [...users];

        // Search
        if (state.search) {
            const q = state.search.toLowerCase();
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(q) ||
                    u.nik.toLowerCase().includes(q) ||
                    (u.email?.toLowerCase().includes(q) ?? false),
            );
        }

        // Role
        if (state.role !== "all") {
            result = result.filter((u) => u.role === state.role);
        }

        // Specialization
        if (state.specialization !== "all") {
            result = result.filter((u) => u.specialization === state.specialization);
        }

        // Status
        if (state.status === "active") {
            result = result.filter((u) => u.isActive);
        } else if (state.status === "inactive") {
            result = result.filter((u) => !u.isActive);
        }

        // Sort
        result.sort((a, b) => {
            let cmp = 0;
            switch (state.sortField) {
                case "name":
                    cmp = a.name.localeCompare(b.name);
                    break;
                case "nik":
                    cmp = a.nik.localeCompare(b.nik);
                    break;
                case "role":
                    cmp = a.role.localeCompare(b.role);
                    break;
                case "createdAt":
                    cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
            }
            return state.sortDirection === "asc" ? cmp : -cmp;
        });

        return result;
    }, [users, state]);

    // ─── Pagination ────────────────────────────────────────────────────────
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / state.pageSize));
    const currentPage = Math.min(state.page, totalPages);

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * state.pageSize;
        return filtered.slice(start, start + state.pageSize);
    }, [filtered, currentPage, state.pageSize]);

    return {
        state,
        update,
        reset,
        hasActiveFilters,
        filtered,
        paginated,
        totalItems,
        totalPages,
        currentPage,
    };
}