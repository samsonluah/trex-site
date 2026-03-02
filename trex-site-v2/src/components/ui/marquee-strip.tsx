"use client";

const REPEAT = 8;
const UNIT = "RUN HARD\u2002\u2014\u2002RUN TOGETHER\u2002\u2014\u2002TREX\u2002\u2014\u2002";

export function MarqueeStrip() {
  return (
    <div className="w-full overflow-hidden bg-[#F2C94C] py-3 select-none">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 18s linear infinite" }}
      >
        {/* Two copies so the loop is seamless */}
        {[0, 1].map((copy) => (
          <span
            key={copy}
            className="flex shrink-0"
            aria-hidden={copy === 1}
          >
            {Array.from({ length: REPEAT }).map((_, i) => (
              <span
                key={i}
                className="font-mono text-xs tracking-[0.25em] uppercase text-[#080808] pr-8"
              >
                {UNIT}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
