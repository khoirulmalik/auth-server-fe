export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  ENGINEER = "ENGINEER",
  SUPERVISOR = "SUPERVISOR",
  TECHNICIAN = "TECHNICIAN",
}

export enum EngineerSpecialization {
  RELIABLE = "RELIABLE",
  SMED = "SMED",
  PLATFORM = "PLATFORM",
  TPM = "TPM",
}

export enum EngineerCategory {
  TESTING = "TESTING",
  ASSEMBLY = "ASSEMBLY",
  PACKAGING = "PACKAGING",
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
