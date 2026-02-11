import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";
import type { DialogType, DialogOptions } from "./types";

interface ConfirmationDialogProps extends DialogOptions {
  isOpen: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DIALOG_CONFIG: Record<
  DialogType,
  {
    icon: typeof AlertCircle;
    iconColor: string;
    iconBg: string;
    confirmBg: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    confirmBg: "bg-emerald-600 hover:bg-emerald-700",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
    confirmBg: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: AlertCircle,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
    confirmBg: "bg-orange-600 hover:bg-orange-700",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    confirmBg: "bg-blue-600 hover:bg-blue-700",
  },
};

export function ConfirmationDialog({
  isOpen,
  type = "warning",
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const { icon: Icon, iconColor, iconBg, confirmBg } = DIALOG_CONFIG[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`${iconBg} p-4 rounded-2xl`}>
            <Icon size={40} className={iconColor} strokeWidth={2.5} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h3 className="font-black text-slate-900 text-xl mb-3">{title}</h3>
          <p className="text-slate-600 font-bold leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-sm hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-6 py-3 ${confirmBg} text-white rounded-xl font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}