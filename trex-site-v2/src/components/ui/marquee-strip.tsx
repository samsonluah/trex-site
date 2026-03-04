"use client";

const REPEAT = 8;
const UNIT = "TREX\u2002\u2014\u2002ATHLETICS\u2002\u2014\u2002CLUB";

export function MarqueeStrip() {
  return (
    <div className="w-full overflow-hidden bg-[#F2C94C] py-3 select-none border-y border-[#080808]/10">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 18s linear infinite" }}
      >
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
