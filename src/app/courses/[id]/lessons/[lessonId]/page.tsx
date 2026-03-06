"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCourse,
  getQuizForLesson,
  submitQuizAttempt,
  CourseResponse,
  LessonResponse,
  QuizDetailResponse,
  QuizAttemptResponse,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/* ═══ Helpers ═══ */
function buildFlatLessonList(course: CourseResponse) {
  return course.sections
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .flatMap((s) =>
      s.lessons
        .slice()
        .sort((a, b) => a.order_index - b.order_index)
        .map((l) => ({ ...l, sectionTitle: s.title })),
    );
}

const ICON: Record<string, string> = { video: "🎬", text: "📄", article: "📄", quiz: "📝" };

/* ═══ Quiz Block ═══ */
function QuizBlock({ quiz }: { quiz: QuizDetailResponse }) {
  const [selected, setSelected] = useState<Record<number, number[]>>({});
  const [textAnswers, setTextAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizAttemptResponse | null>(quiz.my_attempt ?? null);
  const [error, setError] = useState("");

  const toggle = (qId: number, aId: number) => {
    setSelected((prev) => {
      const cur = prev[qId] || [];
      return {
        ...prev,
        [qId]: cur.includes(aId) ? cur.filter((id) => id !== aId) : [...cur, aId],
      };
    });
  };

  const handleSubmit = async () => {
    const answerIds: number[] = [];
    const txtAnswers: Record<number, string> = {};

    for (const q of quiz.questions) {
      if (q.question_type === "single_choice") {
        const typed = (textAnswers[q.id] || "").trim();
        if (typed) txtAnswers[q.id] = typed;
      } else {
        answerIds.push(...(selected[q.id] || []));
      }
    }

    if (!answerIds.length && !Object.keys(txtAnswers).length) {
      setError("Answer at least one question.");
      return;
    }
    setSubmitting(true);
    setError("");
    try { setResult(await submitQuizAttempt(quiz.id, answerIds, txtAnswers)); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Submission failed"); }
    finally { setSubmitting(false); }
  };

  if (result) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: `1px solid ${result.passed ? "rgba(22,163,74,.3)" : "rgba(239,68,68,.3)"}`,
          background: "var(--bg-card)",
        }}
      >
        <div
          className="p-8 text-center"
          style={{ background: result.passed ? "rgba(22,163,74,.06)" : "rgba(239,68,68,.06)" }}
        >
          <span className="text-6xl block mb-4">{result.passed ? "🏆" : "📚"}</span>
          <h3
            className="text-2xl font-extrabold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {result.passed ? "Quiz Passed!" : "Not Passed — Keep Learning"}
          </h3>
          <p
            className="text-5xl font-extrabold mb-2"
            style={{ color: result.passed ? "#16a34a" : "var(--error)" }}
          >
            {result.score}%
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Passing score: {quiz.passing_score}%
          </p>
        </div>
        {!result.passed && (
          <div className="p-4 text-center" style={{ borderTop: "1px solid var(--border-default)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              You have already used your attempt for this quiz.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid var(--accent-border)",
        background: "var(--bg-card)",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border-default)", background: "var(--accent-bg)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📝</span>
          <div>
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>{quiz.title}</h3>
            <p className="text-xs" style={{ color: "var(--accent)" }}>
              {quiz.questions.length} question{quiz.questions.length !== 1 && "s"} · Pass at{" "}
              {quiz.passing_score}%
            </p>
          </div>
        </div>
        <span
          className="text-[10px] px-3 py-1 rounded-full font-medium"
          style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
        >
          {quiz.attempts_count > 0
            ? `${quiz.attempts_count} attempt${quiz.attempts_count > 1 ? "s" : ""}`
            : "No attempts"}
        </span>
      </div>

      {/* Questions */}
      <div className="p-6 space-y-7">
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(239,68,68,.08)", color: "var(--error)", border: "1px solid rgba(239,68,68,.15)" }}
          >
            {error}
          </div>
        )}

        {quiz.questions.map((q, qi) => {
          const isFillBlank = q.question_type === "single_choice";
          const cur = selected[q.id] || [];
          return (
            <div key={q.id}>
              <p className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                <span className="text-sm mr-2" style={{ color: "var(--accent)" }}>Q{qi + 1}.</span>
                {q.question_text}
              </p>

              {isFillBlank ? (
                /* ── Fill in the Blank ── */
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                      style={{ background: "rgba(22,163,74,.1)", color: "#16a34a" }}
                    >
                      Fill in the blank
                    </span>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Type your answer below
                    </p>
                  </div>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                    style={{
                      background: "var(--bg-alt)",
                      border: `1px solid ${textAnswers[q.id]?.trim() ? "var(--accent-border)" : "var(--border-default)"}`,
                      color: "var(--text-primary)",
                    }}
                    placeholder="Type your answer…"
                    value={textAnswers[q.id] || ""}
                    onChange={(e) =>
                      setTextAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                  />
                </>
              ) : (
                /* ── Multiple Choice ── */
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                      style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
                    >
                      Multiple choice
                    </span>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Select all that apply
                    </p>
                  </div>
                  <div className="space-y-2">
                    {q.answers.map((a) => {
                      const on = cur.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          onClick={() => toggle(q.id, a.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                          style={{
                            background: on ? "var(--accent-bg)" : "var(--bg-alt)",
                            border: `1px solid ${on ? "var(--accent-border)" : "var(--border-default)"}`,
                            color: on ? "var(--accent)" : "var(--text-secondary)",
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors"
                            style={{
                              background: on ? "var(--accent)" : "transparent",
                              borderColor: on ? "var(--accent)" : "var(--border-default)",
                            }}
                          >
                            {on && <span className="text-white text-xs">✓</span>}
                          </div>
                          <span className="text-sm">{a.answer_text}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary w-full justify-center py-3"
          style={{ opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Submitting…" : "Submit Quiz →"}
        </button>
      </div>
    </div>
  );
}

/* ═══ Lesson Content ═══ */
function LessonContent({ lesson }: { lesson: LessonResponse }) {
  if (lesson.content_type === "video") {
    const url = lesson.content_text;
    const ytId = url?.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1];
    return (
      <div>
        {ytId ? (
          <div
            className="relative rounded-2xl overflow-hidden mb-6"
            style={{ paddingTop: "56.25%", background: "#000" }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div
            className="rounded-2xl mb-6 flex items-center justify-center h-64"
            style={{ background: "var(--bg-alt)", border: "1px solid var(--border-default)" }}
          >
            <div className="text-center">
              <span className="text-5xl mb-3 block">🎬</span>
              <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>Video Lesson</p>
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: "var(--accent)" }}>
                  Open video →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-7 mb-6 max-w-none leading-relaxed"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
    >
      {lesson.content_text ? (
        lesson.content_text.split("\n").map((line, i) => (
          <p key={i} className="mb-3 last:mb-0" style={{ color: "var(--text-secondary)" }}>
            {line}
          </p>
        ))
      ) : (
        <p style={{ color: "var(--text-muted)" }}>No content available for this lesson yet.</p>
      )}
    </div>
  );
}

/* ═══ Page ═══ */
export default function LessonViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [lesson, setLesson] = useState<(LessonResponse & { sectionTitle: string }) | null>(null);
  const [flatLessons, setFlatLessons] = useState<(LessonResponse & { sectionTitle: string })[]>([]);
  const [quiz, setQuiz] = useState<QuizDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getCourse(courseId)
      .then((c) => {
        setCourse(c);
        const flat = buildFlatLessonList(c);
        setFlatLessons(flat);
        const found = flat.find((l) => l.id === lessonId);
        if (!found) { router.push(`/courses/${courseId}`); return; }
        setLesson(found);
      })
      .catch(() => router.push(`/courses/${courseId}`))
      .finally(() => setLoading(false));
  }, [courseId, lessonId, router]);

  useEffect(() => {
    if (!lesson?.has_quiz) { setQuiz(null); return; }
    setQuizLoading(true);
    getQuizForLesson(lesson.id)
      .then(setQuiz)
      .catch(() => setQuiz(null))
      .finally(() => setQuizLoading(false));
  }, [lesson]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }
  if (!course || !lesson) return null;

  const idx = flatLessons.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? flatLessons[idx - 1] : null;
  const next = idx < flatLessons.length - 1 ? flatLessons[idx + 1] : null;
  const icon = ICON[lesson.content_type] ?? "📄";

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* ══ Sidebar ══ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--bg-card)",
          borderRight: "1px solid var(--border-default)",
          top: "64px",
        }}
      >
        {/* Sidebar header */}
        <div
          className="px-4 py-4 sticky top-0"
          style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-default)" }}
        >
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-2 text-sm font-medium mb-3 transition-colors"
            style={{ color: "var(--accent)" }}
          >
            ← Back to Course
          </Link>
          <h2 className="font-bold text-sm line-clamp-2" style={{ color: "var(--text-primary)" }}>{course.title}</h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {idx + 1} / {flatLessons.length} lessons
          </p>
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-alt)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                background: "var(--accent)",
                width: `${((idx + 1) / flatLessons.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Lesson list */}
        <nav className="py-2">
          {course.sections
            .slice()
            .sort((a, b) => a.order_index - b.order_index)
            .map((sec) => (
              <div key={sec.id}>
                <p
                  className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[.12em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {sec.title}
                </p>
                {sec.lessons
                  .slice()
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((l) => {
                    const active = l.id === lessonId;
                    return (
                      <Link
                        key={l.id}
                        href={`/courses/${courseId}/lessons/${l.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 transition-colors"
                        style={{
                          background: active ? "var(--accent-bg)" : "transparent",
                          borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                        }}
                      >
                        <span className="text-sm">{ICON[l.content_type] ?? "📄"}</span>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm truncate"
                            style={{
                              color: active ? "var(--accent)" : "var(--text-secondary)",
                              fontWeight: active ? 600 : 400,
                            }}
                          >
                            {l.title}
                          </p>
                          <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                            {l.duration_minutes} min
                          </p>
                        </div>
                        {l.has_quiz && (
                          <span className="text-xs" style={{ color: "var(--accent)" }}>📝</span>
                        )}
                      </Link>
                    );
                  })}
              </div>
            ))}
        </nav>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══ Main ══ */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Top bar */}
        <div
          className="sticky top-0 z-20 px-4 py-3 flex items-center gap-4"
          style={{
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border-default)",
          }}
        >
          <button
            className="lg:hidden p-1"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {lesson.sectionTitle}
            </p>
            <h1 className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{lesson.title}</h1>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>{icon}</span>
            <span className="capitalize">{lesson.content_type}</span>
            <span>·</span>
            <span>{lesson.duration_minutes} min</span>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1
            className="heading-font text-3xl mb-2 tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {lesson.title}
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {lesson.sectionTitle} · {lesson.duration_minutes} min ·{" "}
              <span className="capitalize">{lesson.content_type}</span>
            </p>
          </div>

          <LessonContent lesson={lesson} />

          {/* Quiz */}
          {lesson.has_quiz && (
            <div className="mt-12">
              <h2
                className="text-xl font-bold mb-5 flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                📝 Lesson Quiz
              </h2>
              {quizLoading ? (
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3"
                    style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
                  />
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading quiz…</p>
                </div>
              ) : quiz ? (
                !user ? (
                  <div
                    className="rounded-2xl p-8 text-center"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
                  >
                    <p className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Sign in to take this quiz</p>
                    <Link href="/login" className="btn-primary px-6 py-2">Sign In →</Link>
                  </div>
                ) : user.role !== "student" ? (
                  <div
                    className="rounded-2xl p-6 text-center"
                    style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}
                  >
                    <p className="text-sm" style={{ color: "var(--accent)" }}>
                      Quiz preview — only students can submit.
                    </p>
                  </div>
                ) : (
                  <QuizBlock quiz={quiz} />
                )
              ) : (
                <div
                  className="rounded-2xl p-6 text-center"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
                >
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Quiz not available.</p>
                </div>
              )}
            </div>
          )}

          {/* Nav */}
          <div className="mt-14 flex items-stretch gap-4">
            {prev ? (
              <Link
                href={`/courses/${courseId}/lessons/${prev.id}`}
                className="flex-1 rounded-2xl p-5 flex items-center gap-4 group transition-all"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
              >
                <span className="text-2xl transition-colors" style={{ color: "var(--text-muted)" }}>←</span>
                <div className="min-w-0">
                  <p className="text-[10px] mb-1 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Previous
                  </p>
                  <p className="text-sm font-semibold truncate transition-colors" style={{ color: "var(--text-primary)" }}>
                    {prev.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                href={`/courses/${courseId}/lessons/${next.id}`}
                className="flex-1 rounded-2xl p-5 flex items-center justify-end gap-4 text-right group transition-all"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
              >
                <div className="min-w-0">
                  <p className="text-[10px] mb-1 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Next
                  </p>
                  <p className="text-sm font-semibold truncate transition-colors" style={{ color: "var(--text-primary)" }}>
                    {next.title}
                  </p>
                </div>
                <span className="text-2xl transition-colors shrink-0" style={{ color: "var(--text-muted)" }}>→</span>
              </Link>
            ) : (
              <Link
                href={`/courses/${courseId}`}
                className="flex-1 rounded-2xl p-5 flex items-center justify-end gap-4 text-right"
                style={{
                  background: "var(--accent-bg)",
                  border: "1px solid var(--accent-border)",
                }}
              >
                <div>
                  <p className="text-[10px] mb-1 uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                    Course Complete!
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                    Back to Course →
                  </p>
                </div>
                <span className="text-2xl" style={{ color: "var(--accent)" }}>🏆</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
