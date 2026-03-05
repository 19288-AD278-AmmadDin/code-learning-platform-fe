"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCourse, enrollInCourse, CourseResponse, SectionResponse } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";

const LEVEL_COLORS = {
  beginner: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  intermediate: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
  advanced: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

function SectionAccordion({ section, courseId }: { section: SectionResponse; courseId: number }) {
  const [open, setOpen] = useState(false);
  const totalMins = section.lessons.reduce((a, l) => a + l.duration_minutes, 0);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ background: open ? "rgba(124,58,237,0.1)" : "#12121e" }}>
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa" }}>
            {section.order_index + 1}
          </span>
          <span className="font-medium text-white">{section.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: "#6b7280" }}>
            {section.lessons.length} lessons · {totalMins}min
          </span>
          <span className="text-lg transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", color: "#6b7280" }}>
            ▾
          </span>
        </div>
      </button>

      {open && (
        <div style={{ background: "#0d0d18" }}>
          {section.lessons.length === 0 ? (
            <p className="px-5 py-4 text-sm" style={{ color: "#6b7280" }}>No lessons yet</p>
          ) : (
            section.lessons.map((lesson, idx) => (
              <Link
                href={`/courses/${courseId}/lessons/${lesson.id}`}
                key={lesson.id}
                className="flex items-center gap-4 px-5 py-3 transition-colors group"
                style={{
                  borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                  display: "flex",
                }}>
                <span className="text-lg">{lesson.content_type === "video" ? "🎬" : lesson.content_type === "quiz" ? "📝" : "📄"}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium group-hover:text-purple-400 transition-colors" style={{ color: "#e5e7eb" }}>{lesson.title}</p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>{lesson.content_type} · {lesson.duration_minutes} min</p>
                </div>
                {lesson.has_quiz && (
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                    Quiz
                  </span>
                )}
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#a78bfa" }}>→</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  const courseId = Number(params.id);

  useEffect(() => {
    getCourse(courseId)
      .then(setCourse)
      .catch(() => router.push("/courses"))
      .finally(() => setLoading(false));
  }, [courseId, router]);

  const handleEnroll = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setEnrolling(true);
    setEnrollError("");
    try {
      await enrollInCourse(courseId);
      setEnrolled(true);
    } catch (err: unknown) {
      setEnrollError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a12" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
          <p style={{ color: "#9ca3af" }}>Loading course…</p>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const levelStyle = LEVEL_COLORS[course.level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.beginner;
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalMins = course.sections.reduce((acc, s) => acc + s.lessons.reduce((a, l) => a + l.duration_minutes, 0), 0);

  return (
    <div className="min-h-screen" style={{ background: "#0a0a12" }}>

      {/* Hero */}
      <section className="py-16 px-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0f0820 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
        <div className="max-w-5xl mx-auto relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "#6b7280" }}>
            <Link href="/courses" style={{ color: "#a78bfa" }}>Courses</Link>
            <span>/</span>
            <span>{course.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium px-3 py-1 rounded-full capitalize"
                  style={{ background: levelStyle.bg, color: levelStyle.text }}>
                  {course.level}
                </span>
                {!course.published && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>
                    Draft
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "#9ca3af" }}>
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm" style={{ color: "#9ca3af" }}>
                <span className="flex items-center gap-2">
                  <span>👥</span> {course.enrollments_count} students enrolled
                </span>
                <span className="flex items-center gap-2">
                  <span>📚</span> {course.sections.length} sections
                </span>
                <span className="flex items-center gap-2">
                  <span>🎓</span> {totalLessons} lessons
                </span>
                {totalMins > 0 && (
                  <span className="flex items-center gap-2">
                    <span>⏱</span> {Math.round(totalMins / 60)}h {totalMins % 60}m total
                  </span>
                )}
              </div>
            </div>

            {/* Right - Enroll card */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <div className="w-full h-36 rounded-xl mb-5 flex items-center justify-center text-6xl"
                  style={{ background: "linear-gradient(135deg, #1a1040, #0f1a2e)" }}>
                  🎓
                </div>

                {enrollError && (
                  <div className="mb-4 px-3 py-2 rounded-lg text-xs"
                    style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                    {enrollError}
                  </div>
                )}

                {enrolled ? (
                  <Link href="/dashboard"
                    className="text-center py-3 rounded-lg font-semibold mb-4 block"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                    ✓ Enrolled — Go to Dashboard →
                  </Link>
                ) : user?.role === "student" ? (
                  <button onClick={handleEnroll} disabled={enrolling}
                    className="btn-primary w-full py-3 text-base justify-center mb-4"
                    style={{ opacity: enrolling ? 0.7 : 1 }}>
                    {enrolling ? "Enrolling…" : "Enroll Now — Free"}
                  </button>
                ) : user?.role === "instructor" ? (
                  <div className="text-center py-3 rounded-lg text-sm mb-4"
                    style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa" }}>
                    You're viewing as instructor
                  </div>
                ) : (
                  <Link href="/register" className="btn-primary w-full py-3 text-base justify-center text-center block mb-4">
                    Sign Up to Enroll
                  </Link>
                )}

                <ul className="space-y-2 text-sm" style={{ color: "#9ca3af" }}>
                  <li className="flex items-center gap-2"><span>✓</span> Full lifetime access</li>
                  <li className="flex items-center gap-2"><span>✓</span> Access on all devices</li>
                  <li className="flex items-center gap-2"><span>✓</span> Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Course Curriculum</h2>

          {course.sections.length === 0 ? (
            <div className="text-center py-16 card">
              <p className="text-4xl mb-4">📋</p>
              <p className="font-semibold text-white mb-2">Curriculum coming soon</p>
              <p className="text-sm" style={{ color: "#6b7280" }}>The instructor is still building this course</p>
            </div>
          ) : (
            <div className="space-y-3">
              {course.sections
                .slice()
                .sort((a, b) => a.order_index - b.order_index)
                .map(section => (
                  <SectionAccordion key={section.id} section={section} courseId={courseId} />
                ))}
                ))
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
