import { AxiosError } from "axios";

/**
 * Extracts a user-friendly error message from any error.
 *
 * Handles:
 * - Axios validation errors (array of messages from NestJS class-validator)
 * - Axios errors with `message` field
 * - Network errors (no response)
 * - Plain Error objects
 * - Unknown shapes (fallback)
 */
export function getErrorMessage(
    error: unknown,
    fallback = "Something went wrong. Please try again.",
): string {
    // Axios error
    if (error && typeof error === "object" && "isAxiosError" in error) {
        const axiosErr = error as AxiosError<any>;

        // No response = network error
        if (!axiosErr.response) {
            return "Cannot connect to server. Please check your connection.";
        }

        const data = axiosErr.response.data;

        // NestJS validation error → message is array
        if (Array.isArray(data?.message)) {
            return data.message.join(", ");
        }

        // NestJS standard error → message is string
        if (typeof data?.message === "string") {
            return data.message;
        }

        // Generic error field
        if (typeof data?.error === "string") {
            return data.error;
        }

        // Status-based fallback
        switch (axiosErr.response.status) {
            case 400: return "Invalid request. Please check your input.";
            case 401: return "Your session has expired. Please log in again.";
            case 403: return "You don't have permission to perform this action.";
            case 404: return "Resource not found.";
            case 409: return "Conflict — this resource already exists.";
            case 429: return "Too many requests. Please slow down and try again.";
            case 500: return "Server error. Please try again later.";
            default: return fallback;
        }
    }

    // Plain Error
    if (error instanceof Error) return error.message;

    // String
    if (typeof error === "string") return error;

    return fallback;
}