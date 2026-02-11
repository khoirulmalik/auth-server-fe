export type DialogType = "success" | "error" | "warning" | "info";

export interface DialogOptions {
  type?: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface DialogState {
  isOpen: boolean;
  loading: boolean;
  options: DialogOptions;
}