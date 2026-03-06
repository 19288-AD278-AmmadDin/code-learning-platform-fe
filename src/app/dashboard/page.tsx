"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getMyEnrollments,
  getMyCourses,
  createCourse,
  deleteCourse,
  getCourses,
  EnrollmentResponse,
  CourseResponse,
  CourseCreate,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";

/* ═══ Student Dashboard ═══ */
function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [courseMap, setCourseMap] = useState<Record<number, CourseResponse>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyEnrollments(), getCourses()])
      .then(([envs, courses]) => {
        setEnrollments(envs);
        const m: Record<number, CourseResponse> = {};
        courses.forEach((c) => (m[c.id] = c));
        setCourseMap(m);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Enrolled", value: enrollments.length, icon: "📚" },
    { label: "In Progress", value: enrollments.filter((e) => !e.completed_at).length, icon: "⚡" },
    { label: "Completed", value: enrollments.filter((e) => e.completed_at).length, icon: "🏆" },
    { label: "Certificates", value: enrollments.filter((e) => e.completed_at).length, icon: "🎓" },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 text-center transition-all hover:-translate-y-0.5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <span className="text-2xl mb-2 block">{s.icon}</span>
            <p className="text-3xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>{s.value}</p>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>My Learning</h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse flex gap-4">
              <div className="w-14 h-14 rounded-xl shrink-0" style={{ background: "var(--bg-elevated)" }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded" style={{ background: "var(--bg-elevated)", width: "60%" }} />
                <div className="h-3 rounded" style={{ background: "var(--bg-elevated)", width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div
          className="rounded-2xl p-14 text-center"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
          }}
        >
          <p className="text-5xl mb-4">🚀</p>
          <h3 className="font-bold text-xl mb-2" style={{ color: "var(--text-primary)" }}>Start Your Journey</h3>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>
            You haven&apos;t enrolled in any courses yet.
          </p>
          <Link href="/courses" className="btn-primary px-7 py-2.5">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enr) => {
            const course = courseMap[enr.course_id];
            return (
              <div
                key={enr.id}
                className="rounded-2xl p-5 flex items-center gap-5 group transition-all"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: "var(--accent-bg)" }}
                >
                  📚
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {course ? course.title : `Course #${enr.course_id}`}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Enrolled {new Date(enr.enrolled_at).toLocaleDateString()}
                  </p>
                  <div
                    className="mt-3 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-elevated)", maxWidth: 280 }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        background: "var(--accent)",
                        width: enr.completed_at ? "100%" : "35%",
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="text-[11px] px-3 py-1 rounded-full font-medium"
                    style={
                      enr.completed_at
                        ? { background: "rgba(16,185,129,.1)", color: "#16a34a" }
                        : { background: "rgba(234,179,8,.1)", color: "#b58b0a" }
                    }
                  >
                    {enr.completed_at ? "✓ Completed" : "In Progress"}
                  </span>
                  <Link
                    href={`/courses/${enr.course_id}`}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Continue →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══ Instructor Dashboard ═══ */
function InstructorDashboard() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CourseCreate>({
    title: "",
    description: "",
    level: "beginner",
    published: true,
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const load = () => {
    setLoading(true);
    getMyCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      await createCourse(form);
      setShowCreate(false);
      setForm({ title: "", description: "", level: "beginner", published: true });
      load();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      setCourses((p) => p.filter((c) => c.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const totalStudents = courses.reduce((a, c) => a + c.enrollments_count, 0);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Courses", value: courses.length, icon: "📚" },
          { label: "Total Students", value: totalStudents, icon: "👥" },
          { label: "Published", value: courses.filter((c) => c.published).length, icon: "✅" },
          { label: "Drafts", value: courses.filter((c) => !c.published).length, icon: "📝" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 text-center transition-all hover:-translate-y-0.5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <span className="text-2xl mb-2 block">{s.icon}</span>
            <p className="text-3xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>{s.value}</p>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>My Courses</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="btn-primary px-6 py-2.5 text-sm"
        >
          {showCreate ? "✕ Cancel" : "+ New Course"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div
          className="rounded-2xl p-7 mb-6 animate-fade-up"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h3 className="font-bold mb-5" style={{ color: "var(--text-primary)" }}>Create New Course</h3>
          {createError && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,.08)",
                color: "var(--error)",
                border: "1px solid rgba(239,68,68,.2)",
              }}
            >
              {createError}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Course Title
              </label>
              <input
                className="input-field"
                placeholder="e.g. Introduction to Machine Learning"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                minLength={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Description
              </label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Describe what students will learn…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                minLength={10}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Level
                </label>
                <select
                  className="input-field"
                  value={form.level}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      level: e.target.value as CourseCreate["level"],
                    }))
                  }
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Status
                </label>
                <select
                  className="input-field"
                  value={form.published ? "true" : "false"}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, published: e.target.value === "true" }))
                  }
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowCreate(false)} className="btn-outline px-6 py-2 text-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="btn-primary px-6 py-2 text-sm"
                style={{ opacity: creating ? 0.7 : 1 }}
              >
                {creating ? "Creating…" : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Course list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="card p-5 animate-pulse flex gap-4">
              <div className="w-14 h-14 rounded-xl" style={{ background: "var(--bg-elevated)" }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded" style={{ background: "var(--bg-elevated)", width: "60%" }} />
                <div className="h-3 rounded" style={{ background: "var(--bg-elevated)", width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div
          className="rounded-2xl p-14 text-center"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
          }}
        >
          <p className="text-5xl mb-4">✏️</p>
          <h3 className="font-bold text-xl mb-2" style={{ color: "var(--text-primary)" }}>No courses yet</h3>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>
            Create your first course to start teaching.
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-primary px-7 py-2.5">
            Create Course
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl p-5 flex items-center gap-5 transition-all"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: "var(--accent-bg)" }}
              >
                📚
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>{c.title}</h3>
                  <span
                    className="text-[10px] px-2.5 py-0.5 rounded-full font-medium shrink-0"
                    style={
                      c.published
                        ? { background: "rgba(16,185,129,.1)", color: "#16a34a" }
                        : { background: "rgba(234,179,8,.1)", color: "#b58b0a" }
                    }
                  >
                    {c.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>👥 {c.enrollments_count} students</span>
                  <span>📋 {c.sections.length} sections</span>
                  <span className="capitalize">⚡ {c.level}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/courses/${c.id}`}
                  className="text-xs px-3.5 py-2 rounded-full transition-colors"
                  style={{
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                    border: "1px solid var(--accent-border)",
                  }}
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs px-3.5 py-2 rounded-full transition-colors"
                  style={{
                    background: "rgba(239,68,68,.08)",
                    color: "var(--error)",
                    border: "1px solid rgba(239,68,68,.15)",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ Main Dashboard ═══ */
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <section
        className="py-12 px-4"
        style={{
          background: "var(--bg-alt)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: "var(--accent)" }}
            >
              {user.email[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                Welcome back,
              </p>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {user.email}
              </h1>
              <span
                className="text-[11px] px-3 py-1 rounded-full capitalize font-medium mt-2 inline-block"
                style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {user.role === "student" ? <StudentDashboard /> : <InstructorDashboard />}
        </div>
      </section>

      <Footer />
    </div>
  );
}
