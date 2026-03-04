import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#080808] text-white overflow-hidden">
      <div className="site-container-wide py-20 relative">
        {/* Large muted watermark */}
        <div
          aria-hidden
          className="editorial-heading text-[12rem] md:text-[20rem] text-white/[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none whitespace-nowrap"
        >
          TREX
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display font-extrabold text-3xl uppercase tracking-tight mb-3">
              TREX.
            </h3>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed font-mono">
              Athletics Club — Singapore
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">
              Navigate
            </p>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Shop" },
                { href: "/gallery", label: "Gallery" },
                { href: "/coaching", label: "Coaching" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-trex-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">
              Connect
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/trex_sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-trex-accent transition-colors duration-200"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="mailto:trex.sg.run@gmail.com"
                  className="text-sm text-white/50 hover:text-trex-accent transition-colors duration-200"
                >
                  trex.sg.run@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="relative z-10 border-t border-white/10 mt-16 pt-6">
          <p className="text-white/30 text-xs font-mono">
            &copy; {new Date().getFullYear()} TREX Athletics Club. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
