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

// ── Student Dashboard ─────────────────────────────────────────────────────────
function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [courseMap, setCourseMap] = useState<Record<number, CourseResponse>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyEnrollments(), getCourses()])
      .then(([envs, courses]) => {
        setEnrollments(envs);
        const map: Record<number, CourseResponse> = {};
        courses.forEach(c => (map[c.id] = c));
        setCourseMap(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Enrolled Courses", value: enrollments.length, icon: "📚" },
          { label: "In Progress", value: enrollments.filter(e => !e.completed_at).length, icon: "⚡" },
          { label: "Completed", value: enrollments.filter(e => e.completed_at).length, icon: "🏆" },
          { label: "Certificates", value: enrollments.filter(e => e.completed_at).length, icon: "🎓" },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="text-3xl font-extrabold text-white mb-1">{s.value}</p>
            <p className="text-xs" style={{ color: "#6b7280" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">My Learning</h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-5 animate-pulse flex gap-4">
              <div className="w-16 h-16 rounded-xl flex-shrink-0" style={{ background: "#1a1a2e" }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded" style={{ background: "#1e1e3a", width: "60%" }} />
                <div className="h-3 rounded" style={{ background: "#1e1e3a", width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-5xl mb-4">🚀</p>
          <h3 className="font-bold text-white text-xl mb-2">Start Your Journey</h3>
          <p className="mb-6" style={{ color: "#6b7280" }}>You haven't enrolled in any courses yet.</p>
          <Link href="/courses" className="btn-primary px-6 py-2">Browse Courses</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map(enr => {
            const course = courseMap[enr.course_id];
            return (
              <div key={enr.id} className="card p-5 flex items-center gap-5 group">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.15)" }}>
                  📚
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {course ? course.title : `Course #${enr.course_id}`}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                    Enrolled {new Date(enr.enrolled_at).toLocaleDateString()}
                  </p>
                  {/* Progress bar placeholder */}
                  <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "#1e1e3a", width: "100%", maxWidth: "300px" }}>
                    <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4)", width: enr.completed_at ? "100%" : "35%" }} />
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {enr.completed_at ? (
                    <span className="text-xs px-3 py-1 rounded-full"
                      style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
                      ✓ Completed
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 rounded-full"
                      style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                      In Progress
                    </span>
                  )}
                  <Link href={`/courses/${enr.course_id}`} className="btn-primary text-xs px-4 py-2">
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

// ── Instructor Dashboard ───────────────────────────────────────────────────────
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

  const loadCourses = () => {
    setLoading(true);
    getMyCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourses(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      await createCourse(form);
      setShowCreate(false);
      setForm({ title: "", description: "", level: "beginner", published: true });
      loadCourses();
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
      setCourses(prev => prev.filter(c => c.id !== id));
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
          { label: "Published", value: courses.filter(c => c.published).length, icon: "✅" },
          { label: "Drafts", value: courses.filter(c => !c.published).length, icon: "📝" },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="text-3xl font-extrabold text-white mb-1">{s.value}</p>
            <p className="text-xs" style={{ color: "#6b7280" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">My Courses</h2>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary px-6 py-2">
          {showCreate ? "✕ Cancel" : "+ New Course"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="card p-6 mb-6">
          <h3 className="font-bold text-white mb-5">Create New Course</h3>
          {createError && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm"
              style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
              {createError}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#9ca3af" }}>Course Title</label>
              <input className="input-field" placeholder="e.g. Introduction to Machine Learning"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required minLength={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#9ca3af" }}>Description</label>
              <textarea className="input-field resize-none" rows={3} placeholder="Describe what students will learn…"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required minLength={10} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#9ca3af" }}>Level</label>
                <select className="input-field" value={form.level}
                  onChange={e => setForm(f => ({ ...f, level: e.target.value as CourseCreate["level"] }))}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#9ca3af" }}>Status</label>
                <select className="input-field" value={form.published ? "true" : "false"}
                  onChange={e => setForm(f => ({ ...f, published: e.target.value === "true" }))}>
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="btn-outline px-6 py-2">Cancel</button>
              <button type="submit" disabled={creating} className="btn-primary px-6 py-2"
                style={{ opacity: creating ? 0.7 : 1 }}>
                {creating ? "Creating…" : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Course list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="card p-5 animate-pulse flex gap-4">
              <div className="w-16 h-16 rounded-xl" style={{ background: "#1a1a2e" }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded" style={{ background: "#1e1e3a", width: "60%" }} />
                <div className="h-3 rounded" style={{ background: "#1e1e3a", width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-5xl mb-4">✏️</p>
          <h3 className="font-bold text-white text-xl mb-2">No courses yet</h3>
          <p className="mb-6" style={{ color: "#6b7280" }}>Create your first course to start teaching.</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary px-6 py-2">Create Course</button>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="card p-5 flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: "rgba(124,58,237,0.15)" }}>
                📚
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">{course.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full`}
                    style={course.published
                      ? { background: "rgba(16,185,129,0.15)", color: "#10b981" }
                      : { background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                    {course.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex gap-4 text-xs" style={{ color: "#6b7280" }}>
                  <span>👥 {course.enrollments_count} students</span>
                  <span>📋 {course.sections.length} sections</span>
                  <span className="capitalize">⚡ {course.level}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/courses/${course.id}`} className="text-xs px-3 py-2 rounded-lg transition-colors"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                  View
                </Link>
                <button onClick={() => handleDelete(course.id)}
                  className="text-xs px-3 py-2 rounded-lg transition-colors"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>
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

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a12" }}>
        <div className="w-12 h-12 rounded-full border-2 animate-spin"
          style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a12" }}>

      {/* Header */}
      <section className="py-12 px-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0f0820 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
              {user.email[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: "#9ca3af" }}>Welcome back,</p>
              <h1 className="text-2xl font-bold text-white">{user.email}</h1>
              <span className="text-xs px-3 py-1 rounded-full capitalize font-medium mt-1 inline-block"
                style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
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
