"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0f0820 100%)" }}>

      {/* Background glows */}
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
              CS
            </div>
            <span className="font-bold text-2xl text-white">CodeSavvy</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p style={{ color: "#9ca3af" }}>Sign in to continue your learning journey</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#9ca3af" }}>
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#9ca3af" }}>
                Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base justify-center"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold" style={{ color: "#a78bfa" }}>
                Create one free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#4b5563" }}>
          By signing in, you agree to our{" "}
          <a href="#" style={{ color: "#6b7280" }}>Terms of Service</a> and{" "}
          <a href="#" style={{ color: "#6b7280" }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
