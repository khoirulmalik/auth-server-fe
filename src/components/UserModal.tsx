import React, { useEffect, useState } from "react";
import {
  Role,
  EngineerSpecialization,
  User,
  RegisterDto,
  UpdateUserDto,
} from "../types/auth.types";

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
    Role.ASSISTANT_ENGINEER,
    Role.TECHNICIAN,
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">
            {mode === "add" ? "Add New User" : "Edit User"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
        >
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              NIK
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.nik}
              onChange={(e) =>
                setFormData({ ...formData, nik: e.target.value })
              }
              disabled={mode === "edit"} // NIK biasanya tidak boleh diubah
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Role
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Specialization
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Initial Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
            >
              {mode === "add" ? "Create User" : "Update Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
