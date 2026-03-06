"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getMyEnrollments,
  getCourse,
  CourseResponse,
  EnrollmentResponse,
  LessonResponse,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";

interface QuizLesson {
  lesson: LessonResponse;
  course: CourseResponse;
  sectionTitle: string;
}

export default function QuizzesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [quizLessons, setQuizLessons] = useState<QuizLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    async function loadQuizzes() {
      try {
        const enrollments: EnrollmentResponse[] = await getMyEnrollments();
        const courseIds = [...new Set(enrollments.map((e) => e.course_id))];

        const courses: CourseResponse[] = await Promise.all(
          courseIds.map((id) => getCourse(id).catch(() => null as unknown as CourseResponse))
        ).then((res) => res.filter(Boolean));

        const items: QuizLesson[] = [];
        for (const course of courses) {
          for (const section of course.sections) {
            for (const lesson of section.lessons) {
              if (lesson.has_quiz) {
                items.push({ lesson, course, sectionTitle: section.title });
              }
            }
          }
        }
        setQuizLessons(items);
      } catch {
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadQuizzes();
  }, [user]);

  if (authLoading || !user) {
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

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ── Header ── */}
      <section
        className="py-16 px-4"
        style={{ background: "var(--bg-alt)", borderBottom: "1px solid var(--border-default)" }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <p
            className="text-xs font-bold uppercase tracking-[.15em] mb-3"
            style={{ color: "var(--accent)" }}
          >
            Quizzes
          </p>
          <h1
            className="heading-font text-4xl mb-4 tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Test Your Knowledge
          </h1>
          <p style={{ color: "var(--text-secondary)" }} className="max-w-xl mx-auto">
            Quizzes from your enrolled courses. Take them to track your progress
            and earn certificates.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="px-4 py-14">
        <div className="max-w-5xl mx-auto">
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 animate-pulse flex gap-4"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl shrink-0"
                    style={{ background: "var(--bg-alt)" }}
                  />
                  <div className="flex-1 space-y-2">
                    <div
                      className="h-4 rounded"
                      style={{ background: "var(--bg-alt)", width: "60%" }}
                    />
                    <div
                      className="h-3 rounded"
                      style={{ background: "var(--bg-alt)", width: "40%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">⚠️</p>
              <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Something went wrong
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {error}
              </p>
            </div>
          )}

          {!loading && !error && quizLessons.length === 0 && (
            <div
              className="rounded-2xl p-14 text-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
            >
              <p className="text-5xl mb-4">📝</p>
              <h3
                className="font-bold text-xl mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                No Quizzes Available
              </h3>
              <p className="mb-6" style={{ color: "var(--text-muted)" }}>
                {user.role !== "student"
                  ? "Sign in as a student and enroll in courses to see quizzes here."
                  : "Enroll in courses that have quizzes to see them here."}
              </p>
              <Link href="/courses" className="btn-primary px-7 py-2.5">
                Browse Courses
              </Link>
            </div>
          )}

          {!loading && !error && quizLessons.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Showing{" "}
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    {quizLessons.length}
                  </span>{" "}
                  quiz{quizLessons.length !== 1 && "zes"}
                </p>
              </div>

              <div className="space-y-4">
                {quizLessons.map(({ lesson, course, sectionTitle }) => (
                  <Link
                    key={`${course.id}-${lesson.id}`}
                    href={`/courses/${course.id}/lessons/${lesson.id}`}
                    className="rounded-2xl p-5 flex items-center gap-5 group transition-all"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-default)",
                      display: "flex",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{
                        background: "var(--accent-bg)",
                        border: "1px solid var(--accent-border)",
                      }}
                    >
                      📝
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold truncate transition-colors"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {lesson.title}
                      </h3>
                      <div
                        className="flex flex-wrap items-center gap-2 mt-1.5 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span
                          className="px-2 py-0.5 rounded-md"
                          style={{
                            background: "var(--accent-bg)",
                            color: "var(--accent)",
                          }}
                        >
                          {course.title}
                        </span>
                        <span>·</span>
                        <span>{sectionTitle}</span>
                        <span>·</span>
                        <span>{lesson.duration_minutes} min</span>
                      </div>
                    </div>

                    {/* Badge + Arrow */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-[11px] px-3 py-1 rounded-full font-medium"
                        style={{
                          background: "var(--accent-bg)",
                          color: "var(--accent)",
                          border: "1px solid var(--accent-border)",
                        }}
                      >
                        Quiz
                      </span>
                      <span
                        className="text-lg opacity-0 group-hover:opacity-100 transition-all"
                        style={{ color: "var(--accent)" }}
                      >
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
