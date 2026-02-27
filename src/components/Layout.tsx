import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useTheme } from "../hooks/useTheme";
// import { NotificationBell } from "./NotificationBell";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Users Management", href: "/users", icon: Users },
];

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, clearAuth } = useAuthStore();
    const { dark, toggleTheme } = useTheme();

    const handleLogout = async () => {
        await clearAuth();
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex" style={{ background: "var(--c-bg)" }}>
            {/* ─── Mobile backdrop ─── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{
                        background: "rgba(15,23,42,0.45)",
                        backdropFilter: "blur(2px)",
                    }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ─── Sidebar ─── */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col lg:translate-x-0 transition-transform duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={{
                    width: 240,
                    background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
                }}
            >
                {/* Logo area */}
                <div className="flex items-center justify-between px-5 pt-6 pb-5">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                            style={{
                                background: "linear-gradient(135deg, #34d399, #60a5fa)",
                            }}
                        >
                            <span className="text-white font-bold text-lg">O</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white tracking-wide">
                                OPPO
                            </h1>
                            <p className="text-xs" style={{ color: "rgba(148,163,184,0.7)" }}>
                                Auth System
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden"
                        style={{ color: "rgba(148,163,184,0.6)" }}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive =
                            location.pathname === item.href ||
                            (item.href !== "/" && location.pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className="relative flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200"
                                style={{
                                    background: isActive
                                        ? "rgba(52,211,153,0.12)"
                                        : "transparent",
                                    color: isActive ? "#fff" : "rgba(148,163,184,0.75)",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive)
                                        (e.currentTarget as HTMLElement).style.background =
                                            "rgba(255,255,255,0.06)";
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive)
                                        (e.currentTarget as HTMLElement).style.background =
                                            "transparent";
                                }}
                            >
                                {/* Active left glow bar */}
                                {isActive && (
                                    <span
                                        className="absolute left-0 top-1/2 w-0.5 rounded-full"
                                        style={{
                                            height: 24,
                                            transform: "translateY(-50%)",
                                            background: "linear-gradient(180deg, #34d399, #60a5fa)",
                                            boxShadow: "0 0 6px rgba(52,211,153,0.5)",
                                        }}
                                    />
                                )}

                                <item.icon
                                    className="w-4.5 h-4.5 flex-shrink-0 transition-colors duration-200"
                                    style={{
                                        color: isActive ? "#34d399" : "rgba(148,163,184,0.6)",
                                    }}
                                />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* NOTIFICATION BELL - SIDEBAR VERSION
                    <div className="pt-2">
                        <div
                            className="h-px mx-2 mb-2"
                            style={{ background: "rgba(148,163,184,0.12)" }}
                        />
                        <NotificationBell variant="sidebar" className="relative" />
                    </div> */}
                </nav>

                {/* ─── User block ─── */}
                <div className="p-3">
                    {/* Divider */}
                    <div
                        className="h-px mx-2 mb-3"
                        style={{ background: "rgba(148,163,184,0.12)" }}
                    />

                    {/* Avatar row */}
                    <div
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            }}
                        >
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                                {user?.name}
                            </p>
                            <p
                                className="text-xs truncate"
                                style={{ color: "rgba(148,163,184,0.55)" }}
                            >
                                {user?.role || "User"}
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full mt-1.5 flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200"
                        style={{ color: "rgba(148,163,184,0.5)" }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                                "rgba(239,68,68,0.1)";
                            (e.currentTarget as HTMLElement).style.color = "#f87171";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color =
                                "rgba(148,163,184,0.5)";
                        }}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-xs font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* ─── Main area ─── */}
            <div className="flex-1 flex flex-col lg:ml-60">
                {/* Top bar */}
                <header
                    className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 flex-shrink-0"
                    style={{
                        background: dark ? "rgba(30,41,59,0.82)" : "rgba(241,245,249,0.85)",
                        backdropFilter: "blur(12px)",
                        borderBottom: dark
                            ? "1px solid rgba(148,163,184,0.12)"
                            : "1px solid rgba(0,0,0,0.06)",
                    }}
                >
                    {/* Left: hamburger (mobile) + page title */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden transition"
                            style={{ color: "var(--c-text-secondary)" }}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2
                            className="text-sm font-bold"
                            style={{ color: "var(--c-text)" }}
                        >
                            {navigation.find((item) =>
                                item.href === "/"
                                    ? location.pathname === "/"
                                    : location.pathname.startsWith(item.href),
                            )?.name || "Dashboard"}
                        </h2>
                    </div>

                    {/* Right: notification bell + theme toggle + department badge */}
                    <div className="flex items-center space-x-3">
                        {/* <div className="lg:hidden">
                            <NotificationBell variant="header" />
                        </div> */}

                        {/* ─── Dark / Light toggle ─── */}
                        <button
                            onClick={toggleTheme}
                            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                            className="relative flex items-center transition-colors duration-300 focus:outline-none"
                            style={{
                                width: 44,
                                height: 24,
                                borderRadius: 12,
                                background: dark
                                    ? "linear-gradient(135deg, #334155, #1e293b)"
                                    : "linear-gradient(135deg, #cbd5e1, #e2e8f0)",
                                border: dark ? "1px solid #475569" : "1px solid #cbd5e1",
                                padding: 2,
                            }}
                        >
                            {/* Track icons */}
                            <Moon
                                className="absolute w-3 h-3"
                                style={{
                                    left: 5,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: dark ? "#94a3b8" : "#cbd5e1",
                                    opacity: dark ? 1 : 0.4,
                                    transition: "opacity 0.3s",
                                }}
                            />
                            <Sun
                                className="absolute w-3 h-3"
                                style={{
                                    right: 5,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: dark ? "#475569" : "#f59e0b",
                                    opacity: dark ? 0.3 : 1,
                                    transition: "opacity 0.3s",
                                }}
                            />
                            {/* Knob */}
                            <span
                                className="inline-block rounded-full shadow-sm transition-transform duration-300 ease-out z-10"
                                style={{
                                    width: 18,
                                    height: 18,
                                    background: dark ? "#f1f5f9" : "#ffffff",
                                    transform: dark ? "translateX(20px)" : "translateX(0px)",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                                }}
                            />
                        </button>

                        {/* Department badge */}
                        <div
                            className="hidden sm:flex items-center px-3 py-1.5 rounded-lg"
                            style={{
                                background: "rgba(52,211,153,0.08)",
                                border: "1px solid rgba(52,211,153,0.2)",
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full mr-2"
                                style={{ background: "#34d399" }}
                            />
                            <span
                                className="text-xs font-medium"
                                style={{ color: "#059669" }}
                            >
                                Manufacturing Engineering
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}