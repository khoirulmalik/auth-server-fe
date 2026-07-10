import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "@shared/contexts/ToastContext";
import LoginPage from "@features/auth/pages/LoginPage";
import { DashboardPage } from "@features/dashboard/pages/DashboardPage";
import { UsersManagementPage } from "@features/users/pages/UsersManagementPage";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import Layout from "./shared/components/layout/Layout";
import { Role } from "@shared/types/shared.types";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected — any authenticated user */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Users management — restricted */}
            <Route
              path="users"
              element={
                <ProtectedRoute
                  allowedRoles={[Role.ADMIN, Role.MANAGER, Role.ENGINEER]}
                >
                  <UsersManagementPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;