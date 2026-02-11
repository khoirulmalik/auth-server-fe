import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import type { Toast, ToastType } from "./types";

interface ToastItemProps extends Toast {
  onClose: (id: string) => void;
}

const TOAST_CONFIG: Record<
  ToastType,
  { icon: typeof CheckCircle2; bg: string; iconBg: string }
> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-400/20",
  },
  error: {
    icon: XCircle,
    bg: "bg-gradient-to-br from-red-500 to-red-600",
    iconBg: "bg-red-400/20",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-gradient-to-br from-orange-500 to-orange-600",
    iconBg: "bg-orange-400/20",
  },
  info: {
    icon: Info,
    bg: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconBg: "bg-blue-400/20",
  },
};

export function ToastItem({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const { icon: Icon, bg, iconBg } = TOAST_CONFIG[type];

  return (
    <div
      className={`${bg} text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] max-w-md animate-in slide-in-from-right-full duration-300`}
    >
      <div className={`${iconBg} p-2 rounded-xl flex-shrink-0`}>
        <Icon size={24} />
      </div>
      <p className="flex-1 font-bold text-sm leading-snug">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  );
}