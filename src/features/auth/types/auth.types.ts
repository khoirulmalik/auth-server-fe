import type { User } from "../../users/types/users.types";

export interface LoginCredentials {
    nik: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}