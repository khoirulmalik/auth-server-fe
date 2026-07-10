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

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}