import api from "../lib/api";
import { LoginCredentials, AuthResponse, User, CreateUserDto } from "../types/auth.types";

export const authService = {
  /**
 * Login via centralized Auth Server
 */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(
      "/auth/login",
      credentials,
    );

    // Save tokens
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  /**
   * Register via centralized Auth Server
   */
  register: async (
    userData: CreateUserDto,
  ): Promise<{ message: string; user: User }> => {
    const { data } = await api.post("/auth/register", userData);
    return data;
  },

  /**
   * Get current user profile via Auth Server
   */
  getProfile: async (): Promise<User> => {
    const token = localStorage.getItem("access_token");
    const { data } = await api.get<User>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  /**
   * Logout via Auth Server
   */
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");

    if (refreshToken && accessToken) {
      try {
        await api.post(
          "/auth/logout",
          { refresh_token: refreshToken },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    // Clear local storage
    localStorage.clear();
  },

  /**
   * Verify if current token is valid
   */
  verifyToken: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return false;

      const { data } = await api.post(
        "/auth/verify",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return data.valid;
    } catch {
      return false;
    }
  },
};