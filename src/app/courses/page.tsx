"use client";
import { useEffect, useState } from "react";
import { getCourses, CourseResponse } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";

const LEVELS = ["all", "beginner", "intermediate", "advanced"] as const;
type Level = (typeof LEVELS)[number];

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [filtered, setFiltered] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<Level>("all");

  useEffect(() => {
    getCourses()
      .then((d) => {
        setCourses(d);
        setFiltered(d);
      })
      .catch(() =>
        setError("Failed to load courses. Make sure the backend is running."),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let r = courses;
    if (level !== "all") r = r.filter((c) => c.level === level);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }
    setFiltered(r);
  }, [courses, level, search]);

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ── Header ── */}
      <section
        className="py-16 px-4"
        style={{
          background: "var(--bg-alt)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold uppercase tracking-[.15em] mb-2"
              style={{ color: "var(--accent)" }}
            >
              All Courses
            </p>
            <h1
              className="heading-font text-3xl lg:text-4xl mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Expand Your{" "}
              <span style={{ color: "var(--accent)" }}>Skills</span>
            </h1>
            <p
              className="max-w-xl mx-auto text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Browse our full catalogue of expert-crafted courses in AI,
              security, web development, and more.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                fill="none"
                stroke="var(--text-muted)"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                className="input-field pl-10"
                placeholder="Search courses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold capitalize transition-all"
                  style={
                    level === l
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
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div
                    className="h-44"
                    style={{ background: "var(--bg-elevated)" }}
                  />
                  <div className="p-5 space-y-3">
                    <div
                      className="h-4 rounded"
                      style={{
                        background: "var(--bg-elevated)",
                        width: "75%",
                      }}
                    />
                    <div
                      className="h-3 rounded"
                      style={{
                        background: "var(--bg-elevated)",
                        width: "55%",
                      }}
                    />
                    <div
                      className="h-3 rounded"
                      style={{
                        background: "var(--bg-elevated)",
                        width: "40%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">⚠️</p>
              <p
                className="font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Unable to load courses
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {error}
              </p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <p
                className="font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                No courses found
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Showing{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {filtered.length}
                  </span>{" "}
                  courses
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((c) => (
                  <CourseCard key={c.id} course={c} />
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
