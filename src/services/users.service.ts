import api from "../lib/api";
import { User, UpdateUserDto } from "../types/auth.types";

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async deactivateUser(id: string): Promise<User> {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data.user;
  },

  async activateUser(id: string): Promise<User> {
    const response = await api.patch(`/users/${id}/activate`);
    return response.data.user;
  },
};
