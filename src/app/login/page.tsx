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
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-md relative animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-9">
          <Link href="/" className="inline-flex items-center gap-2 mb-7">
            <span
              className="heading-font text-2xl"
              style={{ color: "var(--text-primary)" }}
            >
              Code<span style={{ color: "var(--accent)" }}>Savvy</span>
            </span>
          </Link>
          <h1
            className="text-3xl font-extrabold mb-2 tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,.08)",
                border: "1px solid rgba(239,68,68,.2)",
                color: "var(--error)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base justify-center"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>

        <p
          className="text-center text-xs mt-7"
          style={{ color: "var(--text-muted)" }}
        >
          By signing in you agree to our{" "}
          <a href="#" style={{ color: "var(--text-secondary)" }}>
            Terms
          </a>{" "}
          &amp;{" "}
          <a href="#" style={{ color: "var(--text-secondary)" }}>
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
