import Link from "next/link";
import { CourseResponse } from "@/lib/api";

const LEVEL_COLORS = {
  beginner: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  intermediate: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
  advanced: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

const CATEGORY_ICONS: Record<string, string> = {
  default: "⚡",
  ai: "🤖",
  web: "🌐",
  security: "🛡️",
  blockchain: "⛓️",
  design: "🎨",
};

function getCategoryIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("ai") || t.includes("machine") || t.includes("ml")) return "🤖";
  if (t.includes("web") || t.includes("react") || t.includes("next")) return "🌐";
  if (t.includes("security") || t.includes("cyber")) return "🛡️";
  if (t.includes("blockchain") || t.includes("web3")) return "⛓️";
  if (t.includes("design") || t.includes("ui") || t.includes("ux")) return "🎨";
  return "⚡";
}

interface CourseCardProps {
  course: CourseResponse;
}

export default function CourseCard({ course }: CourseCardProps) {
  const levelStyle = LEVEL_COLORS[course.level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.beginner;
  const icon = getCategoryIcon(course.title);
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalMins = course.sections.reduce(
    (acc, s) => acc + s.lessons.reduce((a, l) => a + l.duration_minutes, 0),
    0
  );

  return (
    <Link href={`/courses/${course.id}`} className="card block group">
      {/* Thumbnail */}
      <div className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #12121e 0%, #1e1040 100%)" }}>
        <span className="text-6xl">{icon}</span>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.2) 100%)" }} />
        <div className="absolute top-3 right-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ background: levelStyle.bg, color: levelStyle.text }}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-white text-base mb-2 line-clamp-2 leading-snug">
          {course.title}
        </h3>
        <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: "#9ca3af" }}>
          {course.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: "#6b7280" }}>
          <span className="flex items-center gap-1">
            <span>📚</span> {course.sections.length} sections
          </span>
          {totalLessons > 0 && (
            <span className="flex items-center gap-1">
              <span>🎓</span> {totalLessons} lessons
            </span>
          )}
          {totalMins > 0 && (
            <span className="flex items-center gap-1">
              <span>⏱</span> {Math.round(totalMins / 60)}h
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>
            {course.enrollments_count} students
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full transition-colors"
            style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
