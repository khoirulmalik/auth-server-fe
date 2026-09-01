import {
  Role,
  EngineerSpecialization,
  EngineerCategory,
} from "../../../shared/types/shared.types";

export interface User {
  id: string;
  nik: string;
  email?: string;
  name: string;
  role: Role;
  specialization?: EngineerSpecialization;
  category?: EngineerCategory;
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
  category?: EngineerCategory;
}

export interface UpdateUserDto {
  nik?: string;
  email?: string;
  name?: string;
  password?: string;
  role?: Role;
  specialization?: EngineerSpecialization | null;
  category?: EngineerCategory | null;
  isActive?: boolean;
}
