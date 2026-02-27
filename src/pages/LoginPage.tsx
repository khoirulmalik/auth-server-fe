import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogIn, Lock, Server, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/authStore";
import type { LoginCredentials } from "../types/auth.types";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.access_token, response.refresh_token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ============ LEFT PANEL (70%) – Branding ============ */}
      <div
        className="hidden lg:flex items-center justify-center relative overflow-hidden"
        style={{
          width: "70%",
          minHeight: "100vh",
          background: "linear-gradient(145deg, #000000 0%, #003b25 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <div className="flex items-center gap-3 mb-6 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <Server className="text-green-400 w-5 h-5" />
            <span className="text-white/80 text-sm font-medium tracking-widest uppercase">
              Central Authentication Service
            </span>
          </div>

          <p className="text-2xl leading-relaxed font-light text-white/60 max-w-xl">
            Single Sign-On (SSO) for <br />
            <span className="font-semibold text-white uppercase tracking-wider text-xl">
              Manufacturing Engineering Ecosystem
            </span>
          </p>
        </div>
      </div>

      {/* ============ RIGHT PANEL (30%) – Auth Server Form ============ */}
      <div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col bg-white">
        <div className="flex-1 px-8 lg:px-14 pt-20 pb-10">
          <div className="w-full max-w-md mx-auto">
            {/* Logo OPPO */}
            <div className="mb-12">
              {/* Logo Row */}
              <div className="flex items-center gap-4 mb-8">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIr3AnH75vzRfIYpL8Uh9i4V6NhUhkKuYRchvsqVaPJA&s=10"
                  alt="OPPO Logo"
                  className="h-10 object-contain"
                />
                <img
                  src="/logo BMT.png"
                  alt="BMT Logo"
                  className="h-10 object-contain"
                />
              </div>

              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Sign In
              </h2>
              <p className="text-slate-500 mt-2">
                Use your employee identity to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* NIK Field */}
              <div>
                <label
                  htmlFor="nik"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Employee ID (NIK)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm font-bold">#</span>
                  </div>
                  <input
                    id="nik"
                    type="text"
                    autoComplete="username"
                    className="w-full pl-9 pr-3 py-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Enter your NIK"
                    {...register("nik", {
                      required: "NIK is required",
                    })}
                  />
                </div>
                {errors.nik && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.nik.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-3 py-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 mt-6"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Info Admin & Security */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Need Help */}
              <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                    Need Access Assistance?
                  </p>
                  <p className="text-[12px] text-amber-800 leading-relaxed font-medium">
                    Contact your <span className="font-bold">System Administrator</span> or
                    <span className="font-bold"> Engineering Team</span> for password reset or access issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ FOOTER ============ */}
        <div className="py-8 px-14 flex justify-between items-center border-t border-slate-50">
          <span
            className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"
            title="System Online"
          ></span>
          <p className="text-[11px] font-bold tracking-widest text-black-300 uppercase">
            © 2026 OPPO ME · Authentication Service
          </p>
        </div>
      </div>
    </div>
  );
};