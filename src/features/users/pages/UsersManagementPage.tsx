import React, { useEffect, useState } from "react";
import { userService } from "../api/users.service";
import { User } from "../types/users.types";
import { Role } from "../../../shared/types/shared.types";
import { useAuthStore } from "../../auth/store/authStore";
import { UserModal } from "../components/UserModal";
import { UsersFilterBar } from "../components/UsersFilterBar";
import { Pagination } from "../../../shared/components/pagination/Pagination";
import { useUsersFilter } from "../hooks/useUsersFilter";
import { UserPlus, Edit2, Power, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../shared/lib/error-message";

export const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { user: currentUser } = useAuthStore();

  // Filter + pagination hook
  const {
    state,
    update,
    reset,
    hasActiveFilters,
    paginated,
    totalItems,
    totalPages,
    currentPage,
  } = useUsersFilter(users);

  // ─── Data fetching ─────────────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error(getErrorMessage(err, "Failed to fetch users"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────
  const openAddModal = () => {
    setModalMode("add");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (modalMode === "add") {
        await userService.createUser(data);
        toast.success("User successfully created!");
      } else if (selectedUser) {
        await userService.updateUser(selectedUser.id, data);
        toast.success("User information updated!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err, "Operation failed. Please try again."));
    }
  };

  const handleToggleStatus = async (user: User) => {
    const action = user.isActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    try {
      if (user.isActive) {
        await userService.deactivateUser(user.id);
        toast.success(`${user.name} has been deactivated`);
      } else {
        await userService.activateUser(user.id);
        toast.success(`${user.name} has been activated`);
      }
      fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update status"));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`PERMANENTLY delete user ${name}? This cannot be undone.`)) return;
    try {
      await userService.deleteUser(id);
      toast.success(`${name} has been deleted`);
      fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete user"));
    }
  };

  // ─── Helpers ───────────────────────────────────────────────────────────
  const getRoleBadgeClass = (role: Role) => {
    switch (role) {
      case Role.ADMIN: return "badge-danger";
      case Role.MANAGER: return "badge-primary";
      default: return "badge-success";
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{
            borderColor: "var(--c-border)",
            borderTopColor: "var(--c-accent)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--c-text)" }}
          >
            User Management
          </h1>
          <p style={{ color: "var(--c-text-secondary)" }}>
            Create, update, and manage system access
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary btn-lg">
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filter Bar */}
      <UsersFilterBar
        state={state}
        hasActiveFilters={hasActiveFilters}
        totalItems={totalItems}
        onChange={update}
        onReset={reset}
      />

      {/* User Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead
              style={{
                background: "var(--c-surface-alt)",
                borderBottom: "1px solid var(--c-border)",
              }}
            >
              <tr>
                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--c-text-muted)" }}
                >
                  Employee
                </th>
                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--c-text-muted)" }}
                >
                  Role & Spec
                </th>
                <th
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--c-text-muted)" }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--c-text-muted)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ borderTop: "1px solid var(--c-border)" }}>
              {paginated.length > 0 ? (
                paginated.map((u, idx) => (
                  <tr
                    key={u.id}
                    className="transition-colors"
                    style={{
                      borderBottom:
                        idx !== paginated.length - 1
                          ? "1px solid var(--c-border)"
                          : "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--c-surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{
                            background: "var(--c-accent-subtle)",
                            color: "var(--c-accent)",
                          }}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div
                            className="text-sm font-semibold"
                            style={{ color: "var(--c-text)" }}
                          >
                            {u.name}
                          </div>
                          <div
                            className="text-xs font-mono"
                            style={{ color: "var(--c-text-muted)" }}
                          >
                            {u.nik}
                          </div>
                          {u.email && (
                            <div
                              className="text-xs"
                              style={{ color: "var(--c-text-muted)" }}
                            >
                              {u.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getRoleBadgeClass(u.role)}`}>
                        {u.role}
                      </span>
                      {u.specialization && (
                        <div
                          className="text-xs mt-1 italic"
                          style={{ color: "var(--c-text-secondary)" }}
                        >
                          {u.specialization}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${u.isActive
                            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                            : "bg-red-500"
                            }`}
                        />
                        <span
                          className={`text-xs font-medium ${u.isActive ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-md transition-colors"
                          style={{ color: "var(--c-accent)" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "var(--c-accent-subtle)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                          }}
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(u)}
                          className="p-1.5 rounded-md transition-colors"
                          style={{
                            color: u.isActive
                              ? "var(--c-status-hold-text)"
                              : "var(--c-status-done-text)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = u.isActive
                              ? "var(--c-status-hold-bg)"
                              : "var(--c-status-done-bg)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                          }}
                          title={u.isActive ? "Deactivate Account" : "Activate Account"}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {currentUser?.role === Role.ADMIN && (
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: "var(--c-error)" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background =
                                "var(--c-status-cancel-bg)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background =
                                "transparent";
                            }}
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <Search
                        className="w-12 h-12 mb-3"
                        style={{ color: "var(--c-border)" }}
                      />
                      <p
                        className="text-sm italic"
                        style={{ color: "var(--c-text-muted)" }}
                      >
                        {hasActiveFilters
                          ? "No users found matching your filters."
                          : "No users yet."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={reset}
                          className="mt-3 text-xs font-medium"
                          style={{ color: "var(--c-accent)" }}
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={state.pageSize}
          onPageChange={(page) => update({ page })}
          onPageSizeChange={(pageSize) => update({ pageSize, page: 1 })}
        />
      </div>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        mode={modalMode}
        initialData={selectedUser}
      />
    </div>
  );
};