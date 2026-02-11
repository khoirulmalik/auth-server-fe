import { useState, useEffect } from "react";

/**
 * Minimal dark/light toggle hook.
 * Persists choice in localStorage. On first visit falls back to
 * the OS preference (prefers-color-scheme).
 */
export function useTheme() {
    const [dark, setDark] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem("oppo-theme");
            if (saved !== null) return saved === "dark";
        } catch { }
        return (
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        );
    });

    useEffect(() => {
        const root = document.documentElement;
        dark ? root.classList.add("dark") : root.classList.remove("dark");
        try {
            localStorage.setItem("oppo-theme", dark ? "dark" : "light");
        } catch { }
    }, [dark]);

    return { dark, toggleTheme: () => setDark((d) => !d) };
}