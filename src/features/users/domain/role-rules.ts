import { Role } from "../../../shared/types/shared.types";

export const ROLES_WITH_SPECIALIZATION: readonly Role[] = [
    Role.ENGINEER,
    Role.SUPERVISOR,
    Role.TECHNICIAN,
] as const;

export function requiresSpecialization(role: Role): boolean {
    return ROLES_WITH_SPECIALIZATION.includes(role);
}