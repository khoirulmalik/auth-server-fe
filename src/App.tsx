import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersManagementPage } from "./pages/UsersManagementPage"; // Import halaman baru
import { Role } from "./types/auth.types";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard - Akses untuk ADMIN, MANAGER, ENGINEER */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[Role.ADMIN, Role.MANAGER, Role.ENGINEER]}
              >
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* User Management - KHUSUS ADMIN & MANAGER (Sesuai UsersController backend) */}
          <Route
            path="/users"
            element={
              <ProtectedRoute
                allowedRoles={[Role.ADMIN, Role.MANAGER, Role.ENGINEER]}
              >
                <UsersManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
