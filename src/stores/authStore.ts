import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "../types/auth.types";

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;

    // Actions
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    updateUser: (user: Partial<User>) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;

    // Getters
    hasRole: (roles: Role[]) => boolean;
    getToken: () => string | null;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,

            /**
             * Set authentication state after login
             */
            setAuth: (user, accessToken, refreshToken) => {
                // Rely solely on zustand persist — no manual localStorage
                set({ user, accessToken, refreshToken });
            },

            /**
             * Update user info (after profile update)
             */
            updateUser: (updates) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...updates } });
                }
            },

            /**
             * Clear authentication state (logout)
             */
            clearAuth: () => {
                set({ user: null, accessToken: null, refreshToken: null });
            },

            /**
             * Toggle global loading state
             */
            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            /**
             * Check if user has one of the given roles
             */
            hasRole: (roles) => {
                const user = get().user;
                if (!user) return false;
                return roles.includes(user.role);
            },

            /**
             * Get current access token
             */
            getToken: () => {
                return get().accessToken;
            },
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

// Role-based authorization hooks
export const useIsAdmin = () => useHasRole("ADMIN" as Role);
export const useCanManage = () => useHasRole(["ADMIN", "MANAGER", "ENGINEER"] as Role[]);
export const useIsEngineer = () => useHasRole(["ENGINEER", "SUPERVISOR"] as Role[]);