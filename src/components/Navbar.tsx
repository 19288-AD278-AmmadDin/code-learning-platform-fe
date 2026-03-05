"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{ background: "rgba(10,10,18,0.85)", borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
              CS
            </div>
            <span className="font-bold text-xl text-white">CodeSavvy</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-sm font-medium transition-colors"
              style={{ color: "#9ca3af" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}>
              Courses
            </Link>
            <Link href="/#pricing" className="text-sm font-medium transition-colors"
              style={{ color: "#9ca3af" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}>
              Pricing
            </Link>
            {user && (
              <Link href="/dashboard" className="text-sm font-medium transition-colors"
                style={{ color: "#9ca3af" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm" style={{ color: "#9ca3af" }}>{user.email}</span>
                <button onClick={handleLogout} className="btn-outline text-sm px-4 py-2">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline text-sm px-4 py-2">
                  Log In
                </Link>
                <Link href="/register" className="btn-primary text-sm px-4 py-2">
                  Start Learning
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 space-y-2"
          style={{ background: "rgba(10,10,18,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/courses" className="block py-2 text-sm" style={{ color: "#9ca3af" }}
            onClick={() => setMenuOpen(false)}>Courses</Link>
          <Link href="/#pricing" className="block py-2 text-sm" style={{ color: "#9ca3af" }}
            onClick={() => setMenuOpen(false)}>Pricing</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block py-2 text-sm" style={{ color: "#9ca3af" }}
                onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="w-full text-left py-2 text-sm" style={{ color: "#9ca3af" }}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-sm" style={{ color: "#9ca3af" }}
                onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link href="/register" className="w-full btn-primary text-sm text-center py-2 block"
                onClick={() => setMenuOpen(false)}>Start Learning</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
