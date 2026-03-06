import Link from "next/link";
import { CourseResponse } from "@/lib/api";

const LEVEL: Record<string, { bg: string; text: string }> = {
  beginner:     { bg: "rgba(45,140,140,.1)",  text: "#2D8C8C" },
  intermediate: { bg: "rgba(234,179,8,.1)",    text: "#b58b0a" },
  advanced:     { bg: "rgba(239,68,68,.1)",    text: "#dc2626" },
};

function icon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("ai") || t.includes("machine") || t.includes("neural")) return "🤖";
  if (t.includes("web") || t.includes("react") || t.includes("next") || t.includes("full")) return "🌐";
  if (t.includes("security") || t.includes("cyber")) return "🛡️";
  if (t.includes("blockchain") || t.includes("web3")) return "⛓️";
  if (t.includes("design") || t.includes("ui") || t.includes("ux")) return "🎨";
  if (t.includes("python") || t.includes("data")) return "🐍";
  if (t.includes("mobile") || t.includes("ios") || t.includes("android")) return "📱";
  return "💡";
}

export default function CourseCard({ course }: { course: CourseResponse }) {
  const lvl = LEVEL[course.level] ?? LEVEL.beginner;
  const emoji = icon(course.title);
  const lessons = course.sections.reduce((a, s) => a + s.lessons.length, 0);
  const mins = course.sections.reduce(
    (a, s) => a + s.lessons.reduce((acc, l) => acc + l.duration_minutes, 0),
    0,
  );

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* ── Thumbnail ── */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background: "var(--accent-bg)" }}
      >
        <span className="text-6xl transition-transform duration-500 group-hover:scale-110 relative z-10">
          {emoji}
        </span>

        {/* Level badge */}
        <span
          className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize z-10"
          style={{ background: lvl.bg, color: lvl.text }}
        >
          {course.level}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-5">
        <h3
          className="font-semibold text-[15px] mb-2 line-clamp-2 leading-snug tracking-tight transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          {course.title}
        </h3>
        <p
          className="text-sm mb-4 line-clamp-2 leading-relaxed"
          style={{ color: "var(--text-dim)" }}
        >
          {course.description}
        </p>

        {/* Stats */}
        <div
          className="flex items-center gap-4 text-xs mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10M4 18h6" />
            </svg>
            {course.sections.length} sections
          </span>
          {lessons > 0 && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {lessons} lessons
            </span>
          )}
          {mins > 0 && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {Math.round(mins / 60)}h
            </span>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid var(--border-default)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {course.enrollments_count} enrolled
          </span>
          <span
            className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0"
            style={{ color: "var(--accent)" }}
          >
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}
