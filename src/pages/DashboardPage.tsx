import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Role, EngineerSpecialization } from "../types/auth.types";
import {
  FileText,
  Settings,
  Users,
  Shield,
  Briefcase,
  Wrench,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const getRoleBadgeClass = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "badge-danger";
      case Role.MANAGER:
        return "badge-primary";
      case Role.ENGINEER:
        return "badge-success";
      default:
        return "badge-gray";
    }
  };

  const getSpecializationBadgeClass = (spec?: EngineerSpecialization) => {
    if (!spec) return "";
    return "badge-warning";
  };

  const getWelcomeMessage = () => {
    if (!user) return "Welcome";

    switch (user.role) {
      case Role.ADMIN:
        return "Admin Dashboard";
      case Role.MANAGER:
        return "Manager Dashboard";
      case Role.ENGINEER:
        return "Engineer Dashboard";
      default:
        return "Dashboard";
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case Role.ADMIN:
        return Shield;
      case Role.MANAGER:
        return Briefcase;
      case Role.ENGINEER:
        return Wrench;
      default:
        return Users;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-8 animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--c-accent), var(--c-accent-hover))",
              }}
            >
              <RoleIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: "var(--c-text)" }}
              >
                {getWelcomeMessage()}
              </h2>
              <p style={{ color: "var(--c-text-secondary)" }}>
                Welcome back, <span className="font-semibold">{user?.name}</span>!
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`badge ${getRoleBadgeClass(user?.role!)}`}>
              {user?.role}
            </span>
            {user?.specialization && (
              <span
                className={`badge ${getSpecializationBadgeClass(user?.specialization)}`}
              >
                {user.specialization}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* User Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--c-accent-subtle)",
                color: "var(--c-accent)",
              }}
            >
              <Users className="w-6 h-6" />
            </div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--c-text)" }}
            >
              Profile Information
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--c-text-muted)" }}
              >
                NIK
              </p>
              <p
                className="font-medium"
                style={{ color: "var(--c-text)" }}
              >
                {user?.nik}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--c-text-muted)" }}
              >
                Full Name
              </p>
              <p
                className="font-medium"
                style={{ color: "var(--c-text)" }}
              >
                {user?.name}
              </p>
            </div>
            {user?.email && (
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "var(--c-text-muted)" }}
                >
                  Email
                </p>
                <p
                  className="font-medium"
                  style={{ color: "var(--c-text)" }}
                >
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Account Status Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--c-accent-subtle)",
                color: "var(--c-accent)",
              }}
            >
              <Shield className="w-6 h-6" />
            </div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--c-text)" }}
            >
              Account Status
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--c-text-muted)" }}
              >
                Current Role
              </p>
              <p
                className="font-medium"
                style={{ color: "var(--c-text)" }}
              >
                {user?.role}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--c-text-muted)" }}
              >
                Status
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${user?.isActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                ></span>
                <p
                  className="font-medium"
                  style={{ color: "var(--c-text)" }}
                >
                  {user?.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--c-text)" }}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* View Reports - All Roles */}
          <button
            className="flex items-center gap-3 p-4 rounded-xl transition-all text-left group"
            style={{
              border: "1px solid var(--c-border)",
              background: "var(--c-surface)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--c-surface-hover)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--c-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--c-surface)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--c-border)";
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
              style={{
                background: "var(--c-accent-subtle)",
                color: "var(--c-accent)",
              }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p
                className="font-medium"
                style={{ color: "var(--c-text)" }}
              >
                View Reports
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--c-text-secondary)" }}
              >
                Access system reports
              </p>
            </div>
          </button>

          {/* Manage Tasks - Engineers Only */}
          {user?.role === Role.ENGINEER && (
            <button
              className="flex items-center gap-3 p-4 rounded-xl transition-all text-left group"
              style={{
                border: "1px solid var(--c-border)",
                background: "var(--c-surface)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--c-surface-hover)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--c-accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--c-surface)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--c-border)";
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "var(--c-status-done-bg)",
                  color: "var(--c-status-done-text)",
                }}
              >
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <p
                  className="font-medium"
                  style={{ color: "var(--c-text)" }}
                >
                  Manage Tasks
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--c-text-secondary)" }}
                >
                  View and update tasks
                </p>
              </div>
            </button>
          )}

          {/* Manage Users - Admin & Manager */}
          {(user?.role === Role.ADMIN || user?.role === Role.MANAGER) && (
            <Link
              to="/users"
              className="flex items-center gap-3 p-4 rounded-xl transition-all text-left group"
              style={{
                border: "1px solid var(--c-border)",
                background: "var(--c-surface)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--c-surface-hover)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--c-accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--c-surface)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--c-border)";
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "var(--c-status-progress-bg)",
                  color: "var(--c-status-progress-text)",
                }}
              >
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p
                  className="font-medium"
                  style={{ color: "var(--c-text)" }}
                >
                  Manage Users
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--c-text-secondary)" }}
                >
                  User administration
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Role-specific Info Panels */}
      <div>
        {user?.role === Role.ADMIN && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              color: "white",
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              <Shield className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-xl font-bold">Admin Panel</h3>
            </div>
            <p className="text-purple-50">
              You have full system access. Use the Manage Users section to
              control access and roles.
            </p>
          </div>
        )}

        {user?.role === Role.MANAGER && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              color: "white",
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              <Briefcase className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-xl font-bold">Manager Control</h3>
            </div>
            <p className="text-blue-50">
              Manage your department team and monitor overall engineering
              performance.
            </p>
          </div>
        )}

        {user?.role === Role.ENGINEER && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, var(--c-accent) 0%, #059669 100%)",
              color: "white",
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              <Wrench className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-xl font-bold">Engineer Workspace</h3>
            </div>
            <p className="text-green-50">
              Current Specialization:{" "}
              <span className="font-mono bg-white/20 px-2 py-0.5 rounded">
                {user?.specialization}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};