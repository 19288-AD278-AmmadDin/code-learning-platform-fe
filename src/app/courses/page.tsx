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
      .then(data => {
        setCourses(data);
        setFiltered(data);
      })
      .catch(() => setError("Failed to load courses. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = courses;
    if (level !== "all") result = result.filter(c => c.level === level);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [courses, level, search]);

  return (
    <div className="min-h-screen" style={{ background: "#0a0a12" }}>

      {/* Header */}
      <section className="py-16 px-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0f0820 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>
              All Courses
            </p>
            <h1 className="text-4xl font-extrabold text-white mb-4">Expand Your Skills</h1>
            <p className="max-w-xl mx-auto" style={{ color: "#9ca3af" }}>
              Browse our full catalogue of expert-crafted courses in AI, security, web development, and more.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              className="input-field flex-1"
              placeholder="Search courses…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="flex gap-2">
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                  style={level === l
                    ? { background: "rgba(124,58,237,0.3)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.5)" }
                    : { background: "#1a1a2e", color: "#9ca3af", border: "1px solid #2e2e4e" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">

          {loading && (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-44" style={{ background: "#1a1a2e" }} />
                  <div className="p-5 space-y-3">
                    <div className="h-4 rounded" style={{ background: "#1e1e3a", width: "80%" }} />
                    <div className="h-3 rounded" style={{ background: "#1e1e3a", width: "60%" }} />
                    <div className="h-3 rounded" style={{ background: "#1e1e3a", width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">⚠️</p>
              <p className="font-semibold text-white mb-2">Unable to load courses</p>
              <p className="text-sm" style={{ color: "#6b7280" }}>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-semibold text-white mb-2">No courses found</p>
              <p className="text-sm" style={{ color: "#6b7280" }}>Try adjusting your search or filters</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  Showing <span className="text-white font-semibold">{filtered.length}</span> courses
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(c => <CourseCard key={c.id} course={c} />)}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
