import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  Server,
  HelpCircle, // Menambahkan icon bantuan
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToastContext } from "../contexts/ToastContext";
import { Role } from "../types/auth.types";

export const LoginPage: React.FC = () => {
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, logout } = useAuth();
  const toast = useToastContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nik || !password) {
      toast.error("NIK and password are required");
      return;
    }

    setIsLoading(true);
    try {
      await login(nik, password);
      const userStr = localStorage.getItem("user");

      if (userStr) {
        const user = JSON.parse(userStr);
        const authorizedRoles = [Role.ADMIN, Role.MANAGER, Role.ENGINEER];

        if (!authorizedRoles.includes(user.role)) {
          await logout();
          toast.error("Access denied. Authorized personnel only.");
          return;
        }
      }

      toast.success("Authentication Successful");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.");
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


            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50/50 text-lg focus:bg-white focus:ring-2 focus:ring-[#00935f] focus:border-transparent transition-all outline-none placeholder:text-slate-300"
                  placeholder="NIKXXXXXX"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Secure Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50/50 text-lg focus:bg-white focus:ring-2 focus:ring-[#00935f] focus:border-transparent transition-all outline-none placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-green-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 py-4.5 rounded-xl text-lg font-bold text-white transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 h-[64px]"
                style={{ background: "#00935f" }}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate</span>
                    <LogIn className="w-5 h-5" />
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

              {/* Security Notice */}
              {/* <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
                <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                  Protected by <span className="font-bold text-slate-900">OPPO Secure Gateway</span>.
                  All authentication activities are monitored and audited.
                </p>
              </div> */}

              {/* Support - full width */}
              {/* <div className="md:col-span-2 p-5 bg-green-50/40 rounded-2xl border border-green-100 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Mail className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-900 uppercase">
                    IT Support
                  </p>
                  <p className="text-sm text-green-800 font-semibold">
                    admin.me@oppo.com
                  </p>
                </div>
              </div> */}

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