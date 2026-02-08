import api from "../lib/api";
import { LoginDto, RegisterDto, AuthResponse, User } from "../types/auth.types";

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(data: RegisterDto): Promise<{ message: string; user: User }> {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async logout(refreshToken: string): Promise<{ message: string }> {
    const response = await api.post("/auth/logout", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  async verifyToken(token: string): Promise<{ valid: boolean; user?: User }> {
    const response = await api.post("/auth/verify", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    const response = await api.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
