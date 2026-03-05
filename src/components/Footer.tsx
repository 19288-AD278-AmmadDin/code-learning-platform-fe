import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#07070f", borderTop: "1px solid rgba(255,255,255,0.07)" }}
      className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
                CS
              </div>
              <span className="font-bold text-xl text-white">CodeSavvy</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#6b7280" }}>
              The future of education is here. Master the skills that matter in AI, Web3, cybersecurity, and beyond.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Platform</h4>
            <ul className="space-y-3">
              {[
                { label: "All Courses", href: "/courses" },
                { label: "Instructors", href: "/instructors" },
                { label: "Certifications", href: "/certificates" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm transition-colors hover:text-white"
                    style={{ color: "#6b7280" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Support</h4>
            <ul className="space-y-3">
              {[
                { label: "Help Center", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Contact Us", href: "#" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm transition-colors hover:text-white"
                    style={{ color: "#6b7280" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Stay Updated</h4>
            <p className="text-sm mb-3" style={{ color: "#6b7280" }}>Email address</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field text-sm flex-1"
                style={{ borderRadius: "0.5rem", padding: "0.5rem 0.75rem" }}
              />
              <button className="btn-primary text-sm px-3 py-2" style={{ borderRadius: "0.5rem" }}>
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-sm" style={{ color: "#4b5563" }}>
            © 2024 CodeSavvy Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["GitHub", "Twitter", "LinkedIn"].map(platform => (
              <a key={platform} href="#" className="text-sm transition-colors hover:text-white"
                style={{ color: "#4b5563" }}>
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
