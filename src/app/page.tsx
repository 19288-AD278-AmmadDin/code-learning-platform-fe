"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCourses, CourseResponse } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";

const STATS = [
  { value: "45k+", label: "Active Students" },
  { value: "1,200+", label: "Premium Courses" },
  { value: "280+", label: "Expert Instructors" },
  { value: "45", label: "Global Partners" },
];

const CATEGORIES = [
  { icon: "🤖", label: "Artificial Intelligence" },
  { icon: "🛡️", label: "Cybersecurity" },
  { icon: "⛓️", label: "Blockchain" },
  { icon: "🎨", label: "Creative Design" },
  { icon: "💻", label: "Full Stack" },
  { icon: "🏆", label: "Leadership" },
];

const FEATURES = [
  {
    icon: "🎯",
    title: "Personalised AI Tutoring",
    desc: "Our 24/7 AI mentor analyses your progress and offers real-time guidance and resource suggestions.",
  },
  {
    icon: "🌍",
    title: "Global Certification",
    desc: "Earn verified blockchain-backed certificates recognised by top Fortune 500 tech companies.",
  },
  {
    icon: "🏗️",
    title: "Collaborative Sandbox",
    desc: "Work on live industry projects in our integrated cloud IDE and design environments.",
  },
];

const INSTRUCTORS = [
  {
    name: "Prof. Helena Rivera",
    title: "Machine Learning AI Guru",
    desc: "With over 15 years in AI research and 40+ published papers, Helena brings unparalleled depth to our machine learning curriculum. She specialises in large-scale model optimisation and ethical AI implementation.",
    avatar: "👩‍🔬",
    color: "#7c3aed",
  },
  {
    name: "Jonathan Wu",
    title: "Lead Security Architect @ CyberGeo",
    desc: "Jonathan has defended critical infrastructure against state-sponsored attacks. In his courses you'll learn offensive and defensive tactics that go far beyond standard certifications.",
    avatar: "👨‍💻",
    color: "#06b6d4",
  },
];

const PLANS = [
  {
    name: "FREE STARTER",
    price: "$0",
    period: "/mo",
    highlight: false,
    cta: "Get Started",
    ctaHref: "/register",
    features: ["Access to 8 free courses", "Community forum access", "Public profile", "Standard certificates"],
  },
  {
    name: "PROFESSIONAL",
    price: "$29",
    period: "/mo",
    highlight: true,
    badge: "MOST POPULAR",
    cta: "Get Started",
    ctaHref: "/register",
    features: ["Access to ALL 1,200+ courses", "AI Tutor: Unlimited access", "Unlimited industry projects", "Verified NFT Certificates", "Priority support", "Monthly group mentorship"],
  },
  {
    name: "ENTERPRISE",
    price: "$Custom",
    period: "/mo",
    highlight: false,
    cta: "Contact Sales",
    ctaHref: "#",
    features: ["Everything in Pro", "Team analytics dashboard", "Custom learning paths", "Dedicated success manager", "White-label options", "Sub-licensing discounts"],
  },
];

export default function LandingPage() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#0a0a12" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-32 px-4"
        style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0f0820 50%, #0a0f1a 100%)" }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
                style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}>
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                Best Immersive Learning Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight" style={{ color: "white" }}>
                Master the <span className="gradient-text">Skills</span><br />of the Future
              </h1>
              <p className="text-lg mb-8 max-w-md leading-relaxed" style={{ color: "#9ca3af" }}>
                CodeSavvy combines industry-leading curriculum with high-tech immersive tools to help you build the career of your dreams in AI, Web3, and beyond.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/courses" className="btn-primary text-base px-8 py-3">
                  Start Learning →
                </Link>
                <button className="btn-outline text-base px-8 py-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.1)" }}>▶</span>
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["🧑‍💻","👩‍🔬","👨‍🎨","🧑‍🚀","👩‍💼"].map((e, i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-base border-2"
                      style={{ background: "#1a1a2e", borderColor: "#0a0a12" }}>{e}</div>
                  ))}
                </div>
                <p className="text-sm" style={{ color: "#9ca3af" }}>
                  <span className="font-bold text-white">13k+</span> students already joined
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 rounded-3xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1a1040, #0f1a2e)", border: "1px solid rgba(124,58,237,0.3)" }}>
                  <span className="text-9xl">🤖</span>
                </div>
                <div className="absolute -bottom-4 -right-4 px-4 py-3 rounded-2xl text-sm"
                  style={{ background: "#1a1040", border: "1px solid rgba(124,58,237,0.4)", color: "white" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-lg">🏆</span>
                    <div>
                      <p className="font-bold text-xs">New Achievement!</p>
                      <p className="text-xs" style={{ color: "#a78bfa" }}>Neural Net Basics</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 px-4 py-3 rounded-2xl text-sm"
                  style={{ background: "#0f1a2e", border: "1px solid rgba(6,182,212,0.4)", color: "white" }}>
                  <p className="font-bold">98%</p>
                  <p className="text-xs" style={{ color: "#67e8f9" }}>Course Completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4"
        style={{ background: "#0d0d18", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-extrabold mb-1 gradient-text">{s.value}</p>
              <p className="text-sm uppercase tracking-wider" style={{ color: "#6b7280" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ECOSYSTEM ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7c3aed" }}>
                Our Ecosystem
              </p>
              <h2 className="text-3xl font-bold text-white">Explore Our Ecosystem</h2>
            </div>
            <Link href="/courses" className="hidden md:flex items-center gap-1 text-sm font-medium"
              style={{ color: "#a78bfa" }}>
              Browse All Categories →
            </Link>
          </div>
          <p className="mb-10" style={{ color: "#6b7280" }}>
            Diverse domains designed for the architects of tomorrow. Start your specialised path today.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link href="/courses" key={cat.label}
                className="card flex flex-col items-center gap-3 py-6 px-4 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: "rgba(124,58,237,0.15)" }}>
                  {cat.icon}
                </div>
                <span className="text-xs font-medium" style={{ color: "#9ca3af" }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR COURSES ───────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: "#0d0d18" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7c3aed" }}>
              Curated for you
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              Launch Your Journey With Our Most Popular Picks
            </h2>
            <p style={{ color: "#6b7280" }}>
              Curated by industry veterans to ensure you're learning exactly what the market demands.
            </p>
          </div>

          {loadingCourses ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-44" style={{ background: "#1a1a2e" }} />
                  <div className="p-5 space-y-3">
                    <div className="h-4 rounded" style={{ background: "#1e1e3a", width: "80%" }} />
                    <div className="h-3 rounded" style={{ background: "#1e1e3a", width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {courses.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🚀</p>
              <p style={{ color: "#6b7280" }}>No courses yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/courses" className="btn-primary px-8 py-3 text-base">
              Explore All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7c3aed" }}>
              Why Choose Us
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              Why the World's Best Talent Chooses{" "}
              <span className="gradient-text">CodeSavvy</span>
            </h2>
            <p className="mb-10" style={{ color: "#6b7280" }}>
              We don't just sell videos. We build professional trajectories through a high-fidelity learning infrastructure.
            </p>
            <div className="space-y-6">
              {FEATURES.map(f => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 mt-1"
                    style={{ background: "rgba(124,58,237,0.15)" }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["👩‍💻 Team Learning", "📊 Analytics", "🎓 Certificates", "🚀 Projects"].map((item, i) => (
              <div key={i} className="card p-8 flex flex-col gap-3 items-center justify-center text-center h-40"
                style={{ background: i % 2 === 0 ? "rgba(124,58,237,0.1)" : "rgba(6,182,212,0.1)" }}>
                <span className="text-3xl">{item.split(" ")[0]}</span>
                <span className="text-sm font-medium text-white">{item.split(" ").slice(1).join(" ")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTRUCTORS ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: "#0d0d18" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7c3aed" }}>
              Meet the Experts
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">Learn From Industry Veterans</h2>
            <p style={{ color: "#6b7280" }}>Our instructors don't just teach. They build. They lead. They innovate.</p>
          </div>
          <div className="space-y-6 max-w-3xl mx-auto">
            {INSTRUCTORS.map(inst => (
              <div key={inst.name} className="card p-6 flex gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: `${inst.color}22`, border: `1px solid ${inst.color}44` }}>
                  {inst.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{inst.name}</h3>
                  <p className="text-sm mb-3" style={{ color: inst.color }}>{inst.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{inst.desc}</p>
                  <div className="flex gap-3 mt-4">
                    <button className="text-sm font-medium px-4 py-2 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}>
                      Follow
                    </button>
                    <button className="text-sm font-medium px-4 py-2 rounded-lg"
                      style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7c3aed" }}>
              Pricing
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p style={{ color: "#6b7280" }}>Choose the path that fits your ambition. No hidden fees, cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name} className={`card p-8 flex flex-col relative`}
                style={plan.highlight ? { boxShadow: "0 0 40px rgba(124,58,237,0.3)", borderColor: "rgba(124,58,237,0.5)" } : {}}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "white" }}>
                    {plan.badge}
                  </div>
                )}
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-sm" style={{ color: "#6b7280" }}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "#9ca3af" }}>
                      <span className="text-green-400 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.ctaHref}
                  className={`text-center py-3 rounded-lg font-semibold transition-all block ${plan.highlight ? "btn-primary" : "btn-outline"}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 50%, #0c1a36 100%)" }}>
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 70% 50%, rgba(124,58,237,0.3) 0%, transparent 70%)" }} />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to Transform<br />Your Career?
            </h2>
            <p className="text-lg mb-10 max-w-md mx-auto" style={{ color: "#c4b5fd" }}>
              Join thousands of students building the future today on CodeSavvy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="btn-primary px-8 py-3 text-base">
                Get Started Free →
              </Link>
              <Link href="#" className="btn-outline px-8 py-3 text-base">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
