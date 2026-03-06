"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(email, password, role);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-md relative animate-fade-up">
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
            Create your account
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Join 13K+ learners building the future
          </p>
        </div>

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
            {/* Role toggle */}
            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["student", "instructor"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="py-3.5 px-4 rounded-xl text-sm font-semibold transition-all"
                    style={
                      role === r
                        ? {
                            background: "var(--accent-bg)",
                            color: "var(--accent)",
                            border: "1px solid var(--accent-border)",
                          }
                        : {
                            background: "var(--bg-elevated)",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border-default)",
                          }
                    }
                  >
                    {r === "student" ? "📚 Learn" : "🎓 Teach"}
                    <div
                      className="text-xs font-normal mt-1"
                      style={{ opacity: 0.7 }}
                    >
                      {r === "student"
                        ? "Enroll in courses"
                        : "Create & share courses"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base justify-center"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p
          className="text-center text-xs mt-7"
          style={{ color: "var(--text-muted)" }}
        >
          By registering you agree to our{" "}
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
