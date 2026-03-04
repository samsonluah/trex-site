import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080808] text-white">
      <h1 className="editorial-heading text-[10rem] md:text-[14rem] leading-none text-trex-accent">
        404
      </h1>
      <p className="font-mono text-sm tracking-widest uppercase text-white/40 mb-8">
        Page not found.
      </p>
      <Link
        href="/"
        className="font-mono text-xs tracking-[0.15em] uppercase text-white border border-white/20 px-6 py-3 rounded-full hover:border-trex-accent hover:text-trex-accent transition-all duration-200"
      >
        Go home
      </Link>
    </div>
  );
}
