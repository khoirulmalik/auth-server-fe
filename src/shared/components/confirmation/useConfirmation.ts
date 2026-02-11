import { useState, useCallback } from "react";
import type { DialogOptions } from "./types";

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    title: "",
    message: "",
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<
    (() => void | Promise<void>) | null
  >(null);

  const confirm = useCallback(
    (opts: DialogOptions, callback: () => void | Promise<void>) => {
      setOptions(opts);
      setOnConfirmCallback(() => callback);
      setIsOpen(true);
    },
    [],
  );

  const handleConfirm = useCallback(async () => {
    if (onConfirmCallback) {
      setLoading(true);
      try {
        await onConfirmCallback();
      } finally {
        setLoading(false);
        setIsOpen(false);
        setOnConfirmCallback(null);
      }
    }
  }, [onConfirmCallback]);

  const handleCancel = useCallback(() => {
    if (!loading) {
      setIsOpen(false);
      setOnConfirmCallback(null);
    }
  }, [loading]);

  return {
    isOpen,
    loading,
    options,
    confirm,
    handleConfirm,
    handleCancel,
  };
}