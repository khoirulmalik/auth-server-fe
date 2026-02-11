import { useState, useCallback } from "react";
import type { Toast, ToastType } from "./types";

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, duration?: number) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = { id, type, message, duration };
      setToasts((prev) => [...prev, newToast]);
    },
    [],
  );

  const success = useCallback(
    (message: string, duration?: number) =>
      showToast("success", message, duration),
    [showToast],
  );

  const error = useCallback(
    (message: string, duration?: number) =>
      showToast("error", message, duration),
    [showToast],
  );

  const warning = useCallback(
    (message: string, duration?: number) =>
      showToast("warning", message, duration),
    [showToast],
  );

  const info = useCallback(
    (message: string, duration?: number) =>
      showToast("info", message, duration),
    [showToast],
  );

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}