"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const links = [
    { href: "/courses", label: "Courses" },
    { href: "/quizzes", label: "Quizzes" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
      style={{
        background: "var(--bg-primary)",
        borderBottom: `1px solid var(--border-default)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className="heading-font text-xl tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              CodeSavvy
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = active
                      ? "var(--accent)"
                      : "var(--text-secondary)")
                  }
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: "var(--bg-alt)",
                border: "1px solid var(--border-default)",
              }}
              aria-label="Toggle theme"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <>
                <div
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent-border)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    {user.email[0].toUpperCase()}
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {user.email.split("@")[0]}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-xs">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium px-4 py-2 transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-secondary)")
                  }
                >
                  Login →
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm px-5 py-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "var(--bg-alt)",
                border: "1px solid var(--border-default)",
              }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text-primary)" }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-5 pt-3 space-y-1 animate-fade-up"
          style={{
            background: "var(--bg-primary)",
            borderTop: "1px solid var(--border-default)",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2.5 px-3 text-sm font-medium rounded-lg"
              style={{
                color:
                  pathname === l.href
                    ? "var(--accent)"
                    : "var(--text-secondary)",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div
            className="pt-3"
            style={{ borderTop: "1px solid var(--border-default)" }}
          >
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left py-2.5 px-3 text-sm rounded-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                Log Out
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block py-2.5 px-3 text-sm rounded-lg"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary w-full text-sm py-2.5 justify-center block text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
