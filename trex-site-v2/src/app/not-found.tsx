import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-trex-bg text-trex-fg">
      <h1 className="text-[10rem] leading-none font-semibold tracking-tight text-trex-accent">
        404
      </h1>
      <p className="text-lg text-trex-muted mb-8">
        Page not found.
      </p>
      <Link href="/" className="site-button">
        Go home
      </Link>
    </div>
  );
}
