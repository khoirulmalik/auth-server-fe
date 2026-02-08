export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  ENGINEER = "ENGINEER",
  ASSISTANT_ENGINEER = "ASSISTANT_ENGINEER",
  TECHNICIAN = "TECHNICIAN",
}

export enum EngineerSpecialization {
  RELIABLE = "RELIABLE",
  SMED = "SMED",
  PLATFORM = "PLATFORM",
  TPM = "TPM",
}

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

export interface LoginDto {
  nik: string;
  password: string;
}

export interface RegisterDto {
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

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
