import React, { useEffect, useState } from "react";
import {
  Role,
  EngineerSpecialization,
  User,
  RegisterDto,
  UpdateUserDto,
} from "../types/auth.types";
import { X } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: User | null;
  mode: "add" | "edit";
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<
    Partial<RegisterDto | UpdateUserDto>
  >({
    nik: "",
    name: "",
    email: "",
    role: Role.ENGINEER,
    specialization: null,
    password: "",
  });

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        nik: initialData.nik,
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        specialization: initialData.specialization || null,
      });
    } else {
      setFormData({
        nik: "",
        name: "",
        email: "",
        role: Role.ENGINEER,
        specialization: null,
        password: "",
      });
    }
  }, [initialData, mode, isOpen]);

  const rolesRequiringSpec = [
    Role.ENGINEER,
    Role.SUPERVISOR,
    Role.TECHNICIAN,
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
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
          <h3
            className="text-lg font-bold"
            style={{ color: "var(--c-text)" }}
          >
            {mode === "add" ? "Add New User" : "Edit User"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--c-text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--c-surface-hover)";
              (e.currentTarget as HTMLElement).style.color = "var(--c-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color =
                "var(--c-text-muted)";
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
        >
          <div>
            <label
              className="block text-xs font-semibold uppercase mb-2"
              style={{ color: "var(--c-text-muted)" }}
            >
              NIK
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.nik}
              onChange={(e) =>
                setFormData({ ...formData, nik: e.target.value })
              }
              disabled={mode === "edit"}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase mb-2"
              style={{ color: "var(--c-text-muted)" }}
            >
              Full Name
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase mb-2"
              style={{ color: "var(--c-text-muted)" }}
            >
              Email
            </label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase mb-2"
              style={{ color: "var(--c-text-muted)" }}
            >
              Role
            </label>
            <select
              className="input"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as Role })
              }
            >
              {Object.values(Role).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {rolesRequiringSpec.includes(formData.role as Role) && (
            <div>
              <label
                className="block text-xs font-semibold uppercase mb-2"
                style={{ color: "var(--c-text-muted)" }}
              >
                Specialization
              </label>
              <select
                required
                className="input"
                value={formData.specialization || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialization: e.target.value as EngineerSpecialization,
                  })
                }
              >
                <option value="" disabled>
                  Select Specialization
                </option>
                {Object.values(EngineerSpecialization).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === "add" && (
            <div>
              <label
                className="block text-xs font-semibold uppercase mb-2"
                style={{ color: "var(--c-text-muted)" }}
              >
                Initial Password
              </label>
              <input
                type="password"
                required
                className="input"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-md flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-md flex-1">
              {mode === "add" ? "Create User" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};