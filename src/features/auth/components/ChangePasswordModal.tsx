import React, { useState } from "react";
import { X, Eye, EyeOff, Check } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../api/auth.service";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../shared/lib/error-message";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface StrengthCheck {
    label: string;
    test: (pwd: string) => boolean;
}

const STRENGTH_CHECKS: StrengthCheck[] = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "One number", test: (p) => /\d/.test(p) },
];

export const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const clearAuth = useAuthStore((s) => s.clearAuth);

    if (!isOpen) return null;

    const passedChecks = STRENGTH_CHECKS.filter((c) => c.test(newPassword));
    const isStrongEnough = passedChecks.length === STRENGTH_CHECKS.length;
    const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
    const isFormValid =
        oldPassword.length > 0 &&
        isStrongEnough &&
        passwordsMatch &&
        oldPassword !== newPassword;

    const handleClose = () => {
        if (isSubmitting) return;
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowOld(false);
        setShowNew(false);
        setShowConfirm(false);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await authService.changePassword({ oldPassword, newPassword });
            toast.success("Password changed successfully. Please log in again.");

            // Backend revoked all refresh tokens → force re-login
            setTimeout(() => {
                clearAuth();
                navigate("/login");
            }, 1500);
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to change password"));
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}
            onClick={handleClose}
        >
            <div
                className="card w-full max-w-md overflow-hidden animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="px-6 py-4 flex justify-between items-center"
                    style={{
                        background: "var(--c-surface-alt)",
                        borderBottom: "1px solid var(--c-border)",
                    }}
                >
                    <h3 className="text-lg font-bold" style={{ color: "var(--c-text)" }}>
                        Change Password
                    </h3>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                        style={{ color: "var(--c-text-muted)" }}
                        onMouseEnter={(e) => {
                            if (!isSubmitting) {
                                (e.currentTarget as HTMLElement).style.background = "var(--c-surface-hover)";
                                (e.currentTarget as HTMLElement).style.color = "var(--c-text)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "var(--c-text-muted)";
                        }}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    {/* Old password */}
                    <div>
                        <label
                            className="block text-xs font-semibold uppercase mb-2"
                            style={{ color: "var(--c-text-muted)" }}
                        >
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showOld ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                className="input pr-10"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowOld((s) => !s)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                style={{ color: "var(--c-text-muted)" }}
                                tabIndex={-1}
                            >
                                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New password */}
                    <div>
                        <label
                            className="block text-xs font-semibold uppercase mb-2"
                            style={{ color: "var(--c-text-muted)" }}
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                required
                                autoComplete="new-password"
                                className="input pr-10"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew((s) => !s)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                style={{ color: "var(--c-text-muted)" }}
                                tabIndex={-1}
                            >
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Strength checklist */}
                        {newPassword.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {STRENGTH_CHECKS.map((check) => {
                                    const passed = check.test(newPassword);
                                    return (
                                        <div
                                            key={check.label}
                                            className="flex items-center gap-2 text-xs transition-colors"
                                            style={{
                                                color: passed
                                                    ? "var(--c-status-done-text)"
                                                    : "var(--c-text-muted)",
                                            }}
                                        >
                                            <Check
                                                className="w-3 h-3"
                                                style={{ opacity: passed ? 1 : 0.3 }}
                                            />
                                            <span>{check.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Same-as-old warning */}
                        {newPassword.length > 0 &&
                            oldPassword.length > 0 &&
                            newPassword === oldPassword && (
                                <p
                                    className="mt-2 text-xs"
                                    style={{ color: "var(--c-status-cancel-text)" }}
                                >
                                    New password must be different from current password
                                </p>
                            )}
                    </div>

                    {/* Confirm new password */}
                    <div>
                        <label
                            className="block text-xs font-semibold uppercase mb-2"
                            style={{ color: "var(--c-text-muted)" }}
                        >
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                required
                                autoComplete="new-password"
                                className="input pr-10"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((s) => !s)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                style={{ color: "var(--c-text-muted)" }}
                                tabIndex={-1}
                            >
                                {showConfirm ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {confirmPassword.length > 0 && !passwordsMatch && (
                            <p
                                className="mt-2 text-xs"
                                style={{ color: "var(--c-status-cancel-text)" }}
                            >
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    {/* Info notice */}
                    <div
                        className="p-3 rounded-lg text-xs"
                        style={{
                            background: "var(--c-note-bg)",
                            border: "1px solid var(--c-note-border)",
                            color: "var(--c-note-text)",
                        }}
                    >
                        ℹ️ You will be signed out from all devices after changing your password.
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="btn btn-secondary btn-md flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className="btn btn-primary btn-md flex-1"
                        >
                            {isSubmitting ? "Updating..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};