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
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0f0820 100%)" }}>

      <div className="fixed top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
              CS
            </div>
            <span className="font-bold text-2xl text-white">CodeSavvy</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p style={{ color: "#9ca3af" }}>Join 13k+ learners building the future</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role toggle */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "#9ca3af" }}>
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["student", "instructor"] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="py-3 px-4 rounded-lg text-sm font-semibold transition-all border"
                    style={role === r
                      ? { background: "rgba(124,58,237,0.25)", color: "#a78bfa", borderColor: "rgba(124,58,237,0.5)" }
                      : { background: "#1a1a2e", color: "#9ca3af", borderColor: "#2e2e4e" }
                    }>
                    {r === "student" ? "📚 Learn" : "🎓 Teach"}
                    <div className="text-xs font-normal mt-1" style={{ opacity: 0.7 }}>
                      {r === "student" ? "Enroll in courses" : "Create & share courses"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base justify-center"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold" style={{ color: "#a78bfa" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#4b5563" }}>
          By registering, you agree to our{" "}
          <a href="#" style={{ color: "#6b7280" }}>Terms of Service</a> and{" "}
          <a href="#" style={{ color: "#6b7280" }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
