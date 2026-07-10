import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@shared/types/shared.types";
import type { User } from "@features/users/types/users.types";

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;

    // Actions
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    setAccessToken: (accessToken: string) => void;
    updateUser: (user: Partial<User>) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;

    // Getters
    hasRole: (roles: Role[]) => boolean;
    getToken: () => string | null;
    getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,

            setAuth: (user, accessToken, refreshToken) => {
                set({ user, accessToken, refreshToken });
            },

            /**
             * Update only access token (used after refresh)
             */
            setAccessToken: (accessToken) => {
                set({ accessToken });
            },

            updateUser: (updates) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...updates } });
                }
            },

            clearAuth: () => {
                set({ user: null, accessToken: null, refreshToken: null });
            },

            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            hasRole: (roles) => {
                const user = get().user;
                if (!user) return false;
                return roles.includes(user.role);
            },

            getToken: () => get().accessToken,
            getRefreshToken: () => get().refreshToken,
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        },
    ),
);

// ================================================================
// Helper hooks
// ================================================================

export const useCurrentUser = () => {
    return useAuthStore((state) => state.user);
};

export const useHasRole = (roles: Role | Role[]) => {
    const user = useAuthStore((state) => state.user);
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
};

export const useIsAdmin = () => useHasRole("ADMIN" as Role);
export const useCanManage = () => useHasRole(["ADMIN", "MANAGER", "ENGINEER"] as Role[]);
export const useIsEngineer = () => useHasRole(["ENGINEER", "SUPERVISOR"] as Role[]);