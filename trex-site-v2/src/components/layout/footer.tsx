import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-trex-fg/5 bg-trex-bg">
      <div className="site-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-semibold text-xl mb-3">TREX.</h3>
            <p className="text-trex-muted text-sm max-w-xs leading-relaxed">
              Athletics Club
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="site-label mb-4">Navigate</p>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-trex-muted hover:text-trex-fg transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-trex-muted hover:text-trex-fg transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-trex-muted hover:text-trex-fg transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/coaching" className="text-sm text-trex-muted hover:text-trex-fg transition-colors">
                  Coaching
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="site-label mb-4">Connect</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/trex_sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-trex-muted hover:text-trex-fg transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-divider" />

        <p className="text-trex-muted text-xs">
          &copy; {new Date().getFullYear()} TREX Athletics Club
        </p>
      </div>
    </footer>
  );
}
