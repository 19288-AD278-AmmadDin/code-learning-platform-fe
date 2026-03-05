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

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildFlatLessonList(course: CourseResponse) {
  return course.sections
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .flatMap(s =>
      s.lessons
        .slice()
        .sort((a, b) => a.order_index - b.order_index)
        .map(l => ({ ...l, sectionTitle: s.title }))
    );
}

// ── Quiz Component ─────────────────────────────────────────────────────────────
function QuizBlock({ quiz, lessonId }: { quiz: QuizDetailResponse; lessonId: number }) {
  const [selected, setSelected] = useState<Record<number, number[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizAttemptResponse | null>(null);
  const [error, setError] = useState("");

  const toggle = (questionId: number, answerId: number, isSingle: boolean) => {
    setSelected(prev => {
      const current = prev[questionId] || [];
      if (isSingle) return { ...prev, [questionId]: [answerId] };
      return {
        ...prev,
        [questionId]: current.includes(answerId)
          ? current.filter(id => id !== answerId)
          : [...current, answerId],
      };
    });
  };

  const handleSubmit = async () => {
    const allSelected = Object.values(selected).flat();
    if (allSelected.length === 0) {
      setError("Please answer at least one question.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await submitQuizAttempt(quiz.id, allSelected);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${result.passed ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}` }}>
        <div className="p-6 text-center"
          style={{ background: result.passed ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)" }}>
          <div className="text-6xl mb-4">{result.passed ? "🏆" : "📚"}</div>
          <h3 className="text-2xl font-extrabold text-white mb-2">
            {result.passed ? "Quiz Passed!" : "Not Passed — Keep Learning"}
          </h3>
          <p className="text-5xl font-extrabold mb-2"
            style={{ color: result.passed ? "#10b981" : "#f87171" }}>
            {result.score}%
          </p>
          <p className="text-sm" style={{ color: "#9ca3af" }}>
            Passing score: {quiz.passing_score}% · You scored {result.score}%
          </p>
        </div>
        {!result.passed && (
          <div className="p-4 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Review the lesson material above and come back when you're ready.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.04)" }}>
      {/* Quiz header */}
      <div className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(124,58,237,0.1)" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">📝</span>
          <div>
            <h3 className="font-bold text-white">{quiz.title}</h3>
            <p className="text-xs" style={{ color: "#a78bfa" }}>
              {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""} · Pass at {quiz.passing_score}%
            </p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full"
          style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa" }}>
          {quiz.attempts_count > 0 ? `${quiz.attempts_count} attempt${quiz.attempts_count > 1 ? "s" : ""}` : "No attempts yet"}
        </span>
      </div>

      {/* Questions */}
      <div className="p-6 space-y-6">
        {error && (
          <div className="px-4 py-3 rounded-lg text-sm"
            style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
            {error}
          </div>
        )}

        {quiz.questions.map((q, qi) => {
          const isSingle = q.question_type === "single_choice";
          const currentSelected = selected[q.id] || [];
          return (
            <div key={q.id}>
              <p className="font-semibold text-white mb-3">
                <span className="text-sm mr-2" style={{ color: "#7c3aed" }}>Q{qi + 1}.</span>
                {q.question_text}
              </p>
              <p className="text-xs mb-3" style={{ color: "#6b7280" }}>
                {isSingle ? "Select one answer" : "Select all that apply"}
              </p>
              <div className="space-y-2">
                {q.answers.map(a => {
                  const isChecked = currentSelected.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggle(q.id, a.id, isSingle)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                      style={{
                        background: isChecked ? "rgba(124,58,237,0.2)" : "#12121e",
                        border: `1px solid ${isChecked ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.06)"}`,
                        color: isChecked ? "#c4b5fd" : "#9ca3af",
                      }}>
                      <div className={`w-5 h-5 rounded-${isSingle ? "full" : "md"} flex items-center justify-center flex-shrink-0 border transition-colors`}
                        style={{
                          background: isChecked ? "#7c3aed" : "transparent",
                          borderColor: isChecked ? "#7c3aed" : "#4b5563",
                        }}>
                        {isChecked && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-sm">{a.answer_text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary w-full justify-center py-3"
          style={{ opacity: submitting ? 0.7 : 1 }}>
          {submitting ? "Submitting…" : "Submit Quiz →"}
        </button>
      </div>
    </div>
  );
}

// ── Lesson Content ─────────────────────────────────────────────────────────────
function LessonContent({ lesson }: { lesson: LessonResponse }) {
  if (lesson.content_type === "video") {
    // If content_text is a YouTube ID or full URL, embed it
    const url = lesson.content_text;
    const youtubeId = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1];
    return (
      <div>
        {youtubeId ? (
          <div className="relative rounded-2xl overflow-hidden mb-6"
            style={{ paddingTop: "56.25%", background: "#000" }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="rounded-2xl mb-6 flex items-center justify-center h-64"
            style={{ background: "#12121e", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-center">
              <span className="text-5xl mb-3 block">🎬</span>
              <p className="font-medium text-white mb-1">Video Lesson</p>
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="text-sm" style={{ color: "#a78bfa" }}>
                  Open video →
                </a>
              )}
            </div>
          </div>
        )}
        {url && !youtubeId && (
          <div className="rounded-xl p-4 text-sm mb-6"
            style={{ background: "#12121e", border: "1px solid rgba(255,255,255,0.06)", color: "#9ca3af" }}>
            <strong className="text-white">Video URL: </strong>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#a78bfa" }}>{url}</a>
          </div>
        )}
      </div>
    );
  }

  // Text / article content
  return (
    <div className="rounded-2xl p-6 mb-6 prose prose-invert max-w-none leading-relaxed"
      style={{ background: "#0d0d18", border: "1px solid rgba(255,255,255,0.06)", color: "#d1d5db" }}>
      {lesson.content_text
        ? lesson.content_text.split("\n").map((line, i) => (
            <p key={i} className="mb-3" style={{ color: "#d1d5db" }}>{line}</p>
          ))
        : <p style={{ color: "#6b7280" }}>No content available for this lesson yet.</p>
      }
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
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
      .then(c => {
        setCourse(c);
        const flat = buildFlatLessonList(c);
        setFlatLessons(flat);
        const found = flat.find(l => l.id === lessonId);
        if (!found) {
          router.push(`/courses/${courseId}`);
          return;
        }
        setLesson(found);
      })
      .catch(() => router.push(`/courses/${courseId}`))
      .finally(() => setLoading(false));
  }, [courseId, lessonId, router]);

  // Load quiz whenever lesson changes
  useEffect(() => {
    if (!lesson?.has_quiz) {
      setQuiz(null);
      return;
    }
    setQuizLoading(true);
    getQuizForLesson(lesson.id)
      .then(setQuiz)
      .catch(() => setQuiz(null))
      .finally(() => setQuizLoading(false));
  }, [lesson]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a12" }}>
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!course || !lesson) return null;

  const currentIdx = flatLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? flatLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < flatLessons.length - 1 ? flatLessons[currentIdx + 1] : null;

  const CONTENT_ICON: Record<string, string> = {
    video: "🎬",
    text: "📄",
    article: "📄",
    quiz: "📝",
  };
  const icon = CONTENT_ICON[lesson.content_type] ?? "📄";

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a12" }}>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 flex-shrink-0 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0d0d18", borderRight: "1px solid rgba(255,255,255,0.06)", top: "64px" }}>

        {/* Sidebar header */}
        <div className="px-4 py-4 sticky top-0" style={{ background: "#0d0d18", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href={`/courses/${courseId}`}
            className="flex items-center gap-2 text-sm font-medium mb-3"
            style={{ color: "#a78bfa" }}>
            ← Back to Course
          </Link>
          <h2 className="font-bold text-white text-sm line-clamp-2">{course.title}</h2>
          <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
            {currentIdx + 1} / {flatLessons.length} lessons
          </p>
          {/* Progress bar */}
          <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "#1e1e3a" }}>
            <div className="h-full rounded-full transition-all"
              style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4)", width: `${((currentIdx + 1) / flatLessons.length) * 100}%` }} />
          </div>
        </div>

        {/* Lesson list */}
        <nav className="py-2">
          {course.sections
            .slice()
            .sort((a, b) => a.order_index - b.order_index)
            .map(section => (
              <div key={section.id}>
                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#6b7280" }}>
                  {section.title}
                </p>
                {section.lessons
                  .slice()
                  .sort((a, b) => a.order_index - b.order_index)
                  .map(l => {
                    const isActive = l.id === lessonId;
                    return (
                      <Link
                        key={l.id}
                        href={`/courses/${courseId}/lessons/${l.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 transition-colors"
                        style={{
                          background: isActive ? "rgba(124,58,237,0.15)" : "transparent",
                          borderLeft: isActive ? "2px solid #7c3aed" : "2px solid transparent",
                        }}>
                        <span className="text-sm">{CONTENT_ICON[l.content_type] ?? "📄"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate"
                            style={{ color: isActive ? "#a78bfa" : "#9ca3af", fontWeight: isActive ? 600 : 400 }}>
                            {l.title}
                          </p>
                          <p className="text-xs" style={{ color: "#4b5563" }}>{l.duration_minutes} min</p>
                        </div>
                        {l.has_quiz && (
                          <span className="text-xs" style={{ color: "#7c3aed" }}>📝</span>
                        )}
                      </Link>
                    );
                  })}
              </div>
            ))}
        </nav>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 px-4 py-3 flex items-center gap-4"
          style={{ background: "rgba(10,10,18,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
          <button className="lg:hidden text-white p-1" onClick={() => setSidebarOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs" style={{ color: "#6b7280" }}>{lesson.sectionTitle}</p>
            <h1 className="font-semibold text-white text-sm truncate">{lesson.title}</h1>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#6b7280" }}>
            <span>{icon}</span>
            <span className="capitalize">{lesson.content_type}</span>
            <span>·</span>
            <span>{lesson.duration_minutes} min</span>
          </div>
        </div>

        {/* Lesson body */}
        <div className="max-w-3xl mx-auto px-4 py-10">

          {/* Lesson title (large) */}
          <h1 className="text-3xl font-extrabold text-white mb-2">{lesson.title}</h1>
          <div className="flex items-center gap-3 mb-8">
            <p className="text-sm" style={{ color: "#6b7280" }}>
              {lesson.sectionTitle} · {lesson.duration_minutes} min · <span className="capitalize">{lesson.content_type}</span>
            </p>
          </div>

          {/* Content */}
          <LessonContent lesson={lesson} />

          {/* Quiz */}
          {lesson.has_quiz && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <span>📝</span> Lesson Quiz
              </h2>
              {quizLoading ? (
                <div className="rounded-2xl p-10 text-center" style={{ background: "#12121e", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3"
                    style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }} />
                  <p className="text-sm" style={{ color: "#6b7280" }}>Loading quiz…</p>
                </div>
              ) : quiz ? (
                !user ? (
                  <div className="rounded-2xl p-8 text-center"
                    style={{ background: "#12121e", border: "1px solid rgba(124,58,237,0.3)" }}>
                    <p className="text-white font-semibold mb-3">Sign in to take this quiz</p>
                    <Link href="/login" className="btn-primary px-6 py-2">Sign In →</Link>
                  </div>
                ) : user.role !== "student" ? (
                  <div className="rounded-2xl p-6 text-center"
                    style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                    <p className="text-sm" style={{ color: "#a78bfa" }}>Quiz preview — only students can submit attempts.</p>
                  </div>
                ) : (
                  <QuizBlock quiz={quiz} lessonId={lesson.id} />
                )
              ) : (
                <div className="rounded-2xl p-6 text-center"
                  style={{ background: "#12121e", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-sm" style={{ color: "#6b7280" }}>Quiz could not be loaded.</p>
                </div>
              )}
            </div>
          )}

          {/* Prev / Next navigation */}
          <div className="mt-14 flex items-stretch gap-4">
            {prevLesson ? (
              <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                className="flex-1 card p-5 flex items-center gap-4 group"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="text-2xl text-gray-500 group-hover:text-purple-400 transition-colors">←</span>
                <div className="min-w-0">
                  <p className="text-xs mb-1" style={{ color: "#6b7280" }}>Previous</p>
                  <p className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                    {prevLesson.title}
                  </p>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {nextLesson ? (
              <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                className="flex-1 card p-5 flex items-center justify-end gap-4 text-right group"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="min-w-0">
                  <p className="text-xs mb-1" style={{ color: "#6b7280" }}>Next</p>
                  <p className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                    {nextLesson.title}
                  </p>
                </div>
                <span className="text-2xl text-gray-500 group-hover:text-purple-400 transition-colors flex-shrink-0">→</span>
              </Link>
            ) : (
              <Link href={`/courses/${courseId}`}
                className="flex-1 card p-5 flex items-center justify-end gap-4 text-right"
                style={{ background: "rgba(124,58,237,0.08)", borderColor: "rgba(124,58,237,0.3)" }}>
                <div>
                  <p className="text-xs mb-1" style={{ color: "#a78bfa" }}>Course Complete!</p>
                  <p className="text-sm font-semibold" style={{ color: "#a78bfa" }}>Back to Course →</p>
                </div>
                <span className="text-2xl" style={{ color: "#7c3aed" }}>🏆</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
