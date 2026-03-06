"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCourse,
  enrollInCourse,
  CourseResponse,
  SectionResponse,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import QuizBuilder from "@/components/QuizBuilder";

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  beginner: { bg: "rgba(45,140,140,.1)", text: "#2D8C8C" },
  intermediate: { bg: "rgba(234,179,8,.1)", text: "#b58b0a" },
  advanced: { bg: "rgba(239,68,68,.1)", text: "#dc2626" },
};

const ICON: Record<string, string> = {
  video: "🎬",
  text: "📄",
  article: "📄",
  quiz: "📝",
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [sectionIdx, setSectionIdx] = useState(0);
  const [quizBuilderLessonId, setQuizBuilderLessonId] = useState<number | null>(null);
  const isOwner = !!(user && course && user.id === course.instructor_id);

  const refreshCourse = useCallback(() => {
    getCourse(courseId).then(setCourse).catch(() => {});
  }, [courseId]);

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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Enrollment failed";
      if (msg.toLowerCase().includes("already")) setEnrolled(true);
      else setEnrollError(msg);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!course) return null;

  const sections = course.sections
    .slice()
    .sort((a, b) => a.order_index - b.order_index);
  const totalLessons = sections.reduce((a, s) => a + s.lessons.length, 0);
  const totalMins = sections.reduce(
    (a, s) => a + s.lessons.reduce((acc, l) => acc + l.duration_minutes, 0),
    0
  );
  const lvl = LEVEL_COLORS[course.level] ?? LEVEL_COLORS.beginner;
  const currentSection: SectionResponse | undefined = sections[sectionIdx];
  const sortedLessons = currentSection
    ? currentSection.lessons.slice().sort((a, b) => a.order_index - b.order_index)
    : [];

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ── Hero ── */}
      <section
        className="py-16 px-4"
        style={{
          background: "var(--bg-alt)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            ← All Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[11px] font-semibold px-3 py-1 rounded-full capitalize"
                  style={{ background: lvl.bg, color: lvl.text }}
                >
                  {course.level}
                </span>
                {course.published ? (
                  <span
                    className="text-[11px] px-3 py-1 rounded-full font-medium"
                    style={{
                      background: "rgba(22,163,74,.1)",
                      color: "#16a34a",
                    }}
                  >
                    Published
                  </span>
                ) : (
                  <span
                    className="text-[11px] px-3 py-1 rounded-full font-medium"
                    style={{
                      background: "rgba(181,139,10,.1)",
                      color: "#b58b0a",
                    }}
                  >
                    Draft
                  </span>
                )}
              </div>

              <h1
                className="heading-font text-3xl lg:text-4xl mb-4 leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {course.title}
              </h1>
              <p
                className="text-lg leading-relaxed mb-6 max-w-2xl"
                style={{ color: "var(--text-secondary)" }}
              >
                {course.description}
              </p>

              <div
                className="flex flex-wrap items-center gap-5 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h10M4 18h6"
                    />
                  </svg>
                  {sections.length} sections
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  {totalLessons} lessons
                </span>
                {totalMins > 0 && (
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {Math.round(totalMins / 60)}h {totalMins % 60}m
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {course.enrollments_count} enrolled
                </span>
              </div>
            </div>

            {/* Enroll Card */}
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="text-center mb-5">
                <p className="text-3xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>Free</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Full access to all content
                </p>
              </div>

              {enrolled ? (
                <div className="text-center">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium mb-4"
                    style={{
                      background: "rgba(16,185,129,.1)",
                      color: "#16a34a",
                      border: "1px solid rgba(16,185,129,.2)",
                    }}
                  >
                    ✓ Enrolled
                  </div>
                  {sections.length > 0 &&
                    sortedLessons.length > 0 && (
                      <Link
                        href={`/courses/${courseId}/lessons/${sortedLessons[0].id}`}
                        className="btn-primary w-full justify-center py-3 block text-center"
                      >
                        Start Learning →
                      </Link>
                    )}
                </div>
              ) : (
                <>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn-primary w-full justify-center py-3"
                    style={{ opacity: enrolling ? 0.7 : 1 }}
                  >
                    {enrolling ? "Enrolling…" : "Enroll Now — Free"}
                  </button>
                  {enrollError && (
                    <p className="text-xs text-center mt-3" style={{ color: "var(--error)" }}>
                      {enrollError}
                    </p>
                  )}
                </>
              )}

              <div
                className="mt-5 pt-5 space-y-3"
                style={{ borderTop: "1px solid var(--border-default)" }}
              >
                {[
                  "Full course access",
                  "Certificate on completion",
                  "Community support",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--accent)" }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section Pagination ── */}
      {sections.length > 0 && (
        <section className="py-14 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section tabs */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
              <span
                className="text-xs font-bold uppercase tracking-widest shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                Sections
              </span>
              <div className="flex gap-2">
                {sections.map((sec, i) => (
                  <button
                    key={sec.id}
                    onClick={() => setSectionIdx(i)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
                    style={
                      sectionIdx === i
                        ? {
                            background: "var(--accent-bg)",
                            color: "var(--accent)",
                            border: "1px solid var(--accent-border)",
                          }
                        : {
                            background: "var(--bg-card)",
                            color: "var(--text-dim)",
                            border: "1px solid var(--border-default)",
                          }
                    }
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current section */}
            {currentSection && (
              <div className="animate-fade-up" key={currentSection.id}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest mb-1"
                      style={{ color: "var(--accent)" }}
                    >
                      Section {sectionIdx + 1} of {sections.length}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                      {currentSection.title}
                    </h2>
                  </div>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {sortedLessons.length} lesson
                    {sortedLessons.length !== 1 && "s"}
                  </span>
                </div>

                {/* Lessons */}
                {sortedLessons.length === 0 ? (
                  <div className="rounded-2xl p-10 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                      No lessons yet
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      This section doesn&apos;t have any lessons.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedLessons.map((lesson, li) => (
                      <div key={lesson.id}>
                        <Link
                          href={`/courses/${courseId}/lessons/${lesson.id}`}
                          className="rounded-xl p-5 flex items-center gap-4 group transition-all"
                          style={{
                            border: "1px solid var(--border-default)",
                          }}
                        >
                          {/* Number */}
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                            style={{
                              background: "var(--accent-bg)",
                              color: "var(--accent)",
                            }}
                          >
                            {li + 1}
                          </div>

                          {/* Icon + info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {ICON[lesson.content_type] ?? "📄"}
                              </span>
                              <h3 className="font-semibold truncate transition-colors" style={{ color: "var(--text-primary)" }}>
                                {lesson.title}
                              </h3>
                            </div>
                            <div
                              className="flex items-center gap-3 mt-1 text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              <span className="capitalize">
                                {lesson.content_type}
                              </span>
                              <span>·</span>
                              <span>{lesson.duration_minutes} min</span>
                              {lesson.has_quiz && (
                                <>
                                  <span>·</span>
                                  <span style={{ color: "var(--accent)" }}>
                                    📝 Has quiz
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Instructor: Add Quiz button */}
                          {isOwner && !lesson.has_quiz && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuizBuilderLessonId(
                                  quizBuilderLessonId === lesson.id ? null : lesson.id
                                );
                              }}
                              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              style={{
                                background: "var(--accent-bg)",
                                color: "var(--accent)",
                                border: "1px solid var(--accent-border)",
                              }}
                            >
                              + Quiz
                            </button>
                          )}

                          {/* Arrow */}
                          <span
                            className="text-lg opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0"
                            style={{ color: "var(--accent)" }}
                          >
                            →
                          </span>
                        </Link>

                        {/* Quiz Builder (inline, below lesson) */}
                        {isOwner && quizBuilderLessonId === lesson.id && (
                          <div className="mt-3 ml-14">
                            <QuizBuilder
                              lessonId={lesson.id}
                              lessonTitle={lesson.title}
                              onDone={() => {
                                setQuizBuilderLessonId(null);
                                refreshCourse();
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Prev / Next section navigation */}
                <div className="flex items-center justify-between mt-10">
                  <button
                    onClick={() => setSectionIdx((i) => Math.max(0, i - 1))}
                    disabled={sectionIdx === 0}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background:
                        sectionIdx === 0
                          ? "var(--bg-card)"
                          : "var(--accent-bg)",
                      color:
                        sectionIdx === 0
                          ? "var(--text-faint)"
                          : "var(--accent)",
                      border: `1px solid ${
                        sectionIdx === 0
                          ? "var(--border-default)"
                          : "var(--accent-border)"
                      }`,
                      opacity: sectionIdx === 0 ? 0.5 : 1,
                      cursor: sectionIdx === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    ← Previous Section
                  </button>

                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {sectionIdx + 1} / {sections.length}
                  </span>

                  <button
                    onClick={() =>
                      setSectionIdx((i) =>
                        Math.min(sections.length - 1, i + 1)
                      )
                    }
                    disabled={sectionIdx === sections.length - 1}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background:
                        sectionIdx === sections.length - 1
                          ? "var(--bg-card)"
                          : "var(--accent-bg)",
                      color:
                        sectionIdx === sections.length - 1
                          ? "var(--text-faint)"
                          : "var(--accent)",
                      border: `1px solid ${
                        sectionIdx === sections.length - 1
                          ? "var(--border-default)"
                          : "var(--accent-border)"
                      }`,
                      opacity:
                        sectionIdx === sections.length - 1 ? 0.5 : 1,
                      cursor:
                        sectionIdx === sections.length - 1
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Next Section →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* No sections */}
      {sections.length === 0 && (
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              No sections yet
            </p>
            <p style={{ color: "var(--text-muted)" }}>
              This course doesn&apos;t have any content yet. Check back soon!
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
