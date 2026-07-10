import api from "../../../shared/lib/api";
import { useAuthStore } from "../store/authStore";
import { LoginCredentials, AuthResponse, User } from "../../../types/auth.types";

export const authService = {
  /**
   * Login via centralized Auth Server.
   * Caller (LoginPage) responsible for calling setAuth() with the response.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  /**
   * Get current user profile via Auth Server
   */
  getProfile: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  /**
   * Logout via Auth Server
   */
  logout: async (): Promise<void> => {
    const refreshToken = useAuthStore.getState().refreshToken;

    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refresh_token: refreshToken });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    useAuthStore.getState().clearAuth();
  },

  /**
   * Verify if current token is valid
   */
  verifyToken: async (): Promise<boolean> => {
    try {
      const token = useAuthStore.getState().accessToken;
      if (!token) return false;

      const { data } = await api.post("/auth/verify");
      return data.valid;
    } catch {
      return false;
    }
  },

  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      "/auth/change-password",
      data,
    );
    return response.data;
  },
};