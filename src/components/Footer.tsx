import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border-default)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* ── Brand ── */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <span
                className="heading-font text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                Code<span style={{ color: "var(--accent)" }}>Savvy</span>
              </span>
            </div>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "var(--text-muted)" }}
            >
              The future of tech education. Master the skills that shape
              tomorrow&apos;s world.
            </p>
            <div className="flex gap-3">
              {[
                { label: "G", name: "GitHub" },
                { label: "X", name: "Twitter" },
                { label: "in", name: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: "var(--bg-elevated)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border-default)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent-bg)";
                    e.currentTarget.style.color = "var(--accent)";
                    e.currentTarget.style.borderColor = "var(--accent-border)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--bg-elevated)";
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.borderColor = "var(--border-default)";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Platform ── */}
          <div>
            <h4
              className="font-semibold mb-5 uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: ".1em",
                color: "var(--text-primary)",
              }}
            >
              Platform
            </h4>
            <ul className="space-y-3">
              {[
                { l: "All Courses", h: "/courses" },
                { l: "Instructors", h: "#" },
                { l: "Certifications", h: "#" },
                { l: "Resources", h: "#" },
              ].map((i) => (
                <li key={i.l}>
                  <Link
                    href={i.h}
                    className="text-sm transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-muted)")
                    }
                  >
                    {i.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ── */}
          <div>
            <h4
              className="font-semibold mb-5 uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: ".1em",
                color: "var(--text-primary)",
              }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-muted)")
                    }
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter ── */}
          <div>
            <h4
              className="font-semibold mb-5 uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: ".1em",
                color: "var(--text-primary)",
              }}
            >
              Stay Updated
            </h4>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Weekly insights on tech education delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="input-field text-xs flex-1"
                style={{ padding: ".6rem .75rem" }}
              />
              <button className="btn-primary text-xs px-3 py-2">→</button>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border-default)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 CodeSavvy Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((t) => (
              <a
                key={t}
                href="#"
                className="text-xs transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
