import { Role, EngineerSpecialization } from "../../../shared/types/shared.types";

export interface User {
    id: string;
    nik: string;
    email?: string;
    name: string;
    role: Role;
    specialization?: EngineerSpecialization;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserDto {
    nik: string;
    email?: string;
    password: string;
    name: string;
    role: Role;
    specialization?: EngineerSpecialization;
}

export interface UpdateUserDto {
    nik?: string;
    email?: string;
    name?: string;
    password?: string;
    role?: Role;
    specialization?: EngineerSpecialization | null;
    isActive?: boolean;
}