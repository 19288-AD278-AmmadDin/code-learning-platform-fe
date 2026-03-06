"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCourses, CourseResponse } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const STATS = [
  { value: "700+", label: "Hours of content", icon: "⚡" },
  { value: "575K+", label: "Active Users", icon: "⚡" },
];

const CATEGORIES = [
  { icon: "🤖", label: "Artificial Intelligence", count: 120 },
  { icon: "🛡️", label: "Cybersecurity", count: 85 },
  { icon: "⛓️", label: "Blockchain & Web3", count: 64 },
  { icon: "🎨", label: "Design Systems", count: 90 },
  { icon: "💻", label: "Full-Stack Dev", count: 200 },
  { icon: "📊", label: "Data Science", count: 110 },
];

const FEATURES = [
  {
    icon: "🎯",
    title: "AI-Powered Learning Paths",
    desc: "Our intelligent system adapts to your pace, identifies knowledge gaps, and creates personalized curricula that evolve with you in real time.",
  },
  {
    icon: "🌍",
    title: "Verified Certificates",
    desc: "Earn industry-recognized certificates validated by leading tech companies. Stand out in any job market with proof of mastery.",
  },
  {
    icon: "🏗️",
    title: "Live Project Sandbox",
    desc: "Code, build, and deploy real applications in our cloud-based IDE with instant feedback, collaboration tools, and mentorship.",
  },
];

const PLANS = [
  {
    name: "STARTER",
    price: "$0",
    period: "/mo",
    highlight: false,
    cta: "Get Started Free",
    href: "/register",
    features: [
      "Access to 8 free courses",
      "Community forum access",
      "Public learner profile",
      "Standard certificates",
    ],
  },
  {
    name: "PROFESSIONAL",
    price: "$29",
    period: "/mo",
    highlight: true,
    badge: "MOST POPULAR",
    cta: "Upgrade to Pro",
    href: "/register",
    features: [
      "Access to ALL 1,200+ courses",
      "AI Tutor: Unlimited access",
      "Unlimited industry projects",
      "Verified Certificates",
      "Priority 1-on-1 support",
      "Monthly group mentorship",
    ],
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    period: "",
    highlight: false,
    cta: "Contact Sales",
    href: "#",
    features: [
      "Everything in Professional",
      "Team analytics dashboard",
      "Custom learning paths",
      "Dedicated success manager",
      "White-label options",
      "Volume discounts",
    ],
  },
];

export default function LandingPage() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    getCourses()
      .then((d) => setCourses(d.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
  }, []);

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ════════════════════════════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 px-4">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column */}
            <div className="animate-fade-up">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{
                  background: "var(--accent-bg)",
                  color: "var(--accent)",
                  border: "1px solid var(--accent-border)",
                }}
              >
                E-COURSE PLATFORM
              </div>

              <h1
                className="heading-font text-4xl lg:text-5xl xl:text-[3.5rem] mb-6 leading-[1.15]"
                style={{ color: "var(--text-primary)" }}
              >
                Learning and teaching online,{" "}
                <span style={{ color: "var(--accent)" }}>made easy.</span>
              </h1>

              <p
                className="text-base lg:text-lg mb-8 max-w-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Practice your skills with an interactive e-learning platform.
                Learn from world-class engineers and build real projects.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/login"
                  className="text-sm font-semibold flex items-center gap-1 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-primary)")
                  }
                >
                  Sign In →
                </Link>
                <Link
                  href="/courses"
                  className="btn-outline text-sm px-6 py-2.5"
                >
                  Learn more →
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-8">
                {STATS.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span
                      className="text-lg"
                      style={{ color: "var(--accent)" }}
                    >
                      {s.icon}
                    </span>
                    <div>
                      <p
                        className="text-xl font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {s.value}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — Hero Image */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative animate-float">
                <Image
                  src="/HeroImage.png"
                  alt="Student learning online"
                  width={520}
                  height={520}
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CATEGORIES
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4" style={{ background: "var(--bg-alt)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[.15em] mb-2"
                style={{ color: "var(--accent)" }}
              >
                Explore Domains
              </p>
              <h2
                className="heading-font text-2xl lg:text-3xl"
                style={{ color: "var(--text-primary)" }}
              >
                Choose Your Path
              </h2>
            </div>
            <Link
              href="/courses"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "var(--accent)" }}
            >
              All Categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                href="/courses"
                key={cat.label}
                className="rounded-2xl p-5 flex flex-col items-center gap-3 text-center group transition-all hover:-translate-y-1"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                  style={{ background: "var(--accent-bg)" }}
                >
                  {cat.icon}
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cat.label}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {cat.count}+ courses
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          POPULAR COURSES
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold uppercase tracking-[.15em] mb-2"
              style={{ color: "var(--accent)" }}
            >
              Curated For You
            </p>
            <h2
              className="heading-font text-2xl lg:text-3xl mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Most Popular Courses
            </h2>
            <p
              className="max-w-xl mx-auto text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Handpicked by industry veterans to ensure you learn exactly what
              the market demands.
            </p>
          </div>

          {loadingCourses ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div
                    className="h-44"
                    style={{ background: "var(--bg-elevated)" }}
                  />
                  <div className="p-5 space-y-3">
                    <div
                      className="h-4 rounded"
                      style={{ background: "var(--bg-elevated)", width: "75%" }}
                    />
                    <div
                      className="h-3 rounded"
                      style={{ background: "var(--bg-elevated)", width: "55%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🚀</p>
              <p style={{ color: "var(--text-muted)" }}>
                No courses yet — check back soon!
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/courses" className="btn-primary px-8 py-3 text-sm">
              Explore All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURES
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4" style={{ background: "var(--bg-alt)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold uppercase tracking-[.15em] mb-2"
              style={{ color: "var(--accent)" }}
            >
              Why CodeSavvy
            </p>
            <h2
              className="heading-font text-2xl lg:text-3xl mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Built for the Builders of Tomorrow
            </h2>
            <p
              className="max-w-lg mx-auto text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              We don&apos;t just sell videos. We engineer professional
              trajectories through high-fidelity learning infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl p-8 relative group transition-all hover:-translate-y-1"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <span
                  className="absolute top-6 right-6 text-6xl font-extrabold opacity-[0.04] select-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  0{i + 1}
                </span>

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                  style={{ background: "var(--accent-bg)" }}
                >
                  {f.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-dim)" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PRICING
          ════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold uppercase tracking-[.15em] mb-2"
              style={{ color: "var(--accent)" }}
            >
              Pricing
            </p>
            <h2
              className="heading-font text-2xl lg:text-3xl mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Simple, Transparent Pricing
            </h2>
            <p
              className="max-w-lg mx-auto text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Choose the path that fits your ambition. No hidden fees, cancel
              anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col relative transition-all ${
                  plan.highlight ? "md:scale-105 md:-my-2" : ""
                }`}
                style={{
                  background: "var(--bg-card)",
                  border: plan.highlight
                    ? "2px solid var(--accent)"
                    : "1px solid var(--border-default)",
                  boxShadow: plan.highlight
                    ? "0 8px 30px rgba(45,140,140,.1)"
                    : "var(--shadow-card)",
                }}
              >
                {plan.badge && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white"
                    style={{
                      background: "var(--accent)",
                      boxShadow: "0 2px 8px rgba(45,140,140,.3)",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <p
                  className="text-[11px] font-bold uppercase tracking-[.12em] mb-5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {plan.name}
                </p>

                <div className="flex items-baseline gap-1 mb-7">
                  <span
                    className="text-4xl font-extrabold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: "var(--success)" }}
                      >
                        ✓
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`text-center py-3.5 rounded-full font-semibold transition-all block text-sm ${
                    plan.highlight
                      ? "btn-primary justify-center"
                      : "btn-outline"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CTA
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div
          className="max-w-5xl mx-auto rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
          style={{
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
          }}
        >
          <div className="relative">
            <h2
              className="heading-font text-3xl md:text-4xl mb-5 leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to Transform
              <br />
              <span style={{ color: "var(--accent)" }}>Your Career?</span>
            </h2>
            <p
              className="text-base mb-8 max-w-md mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Join thousands of students building the future today on CodeSavvy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="btn-primary px-8 py-3.5 text-sm"
              >
                Get Started Free →
              </Link>
              <Link
                href="/courses"
                className="btn-outline px-8 py-3.5 text-sm"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
