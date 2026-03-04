"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 300, damping: 28 };
  const dotX = useSpring(mouseX, springConfig);
  const dotY = useSpring(mouseY, springConfig);

  const ringSpring = { stiffness: 150, damping: 22 };
  const ringX = useSpring(mouseX, ringSpring);
  const ringY = useSpring(mouseY, ringSpring);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover]")) {
        setIsHovering(true);
      }
    };

    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover]")) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Dot */}
      <motion.div
        ref={cursorRef}
        style={{ x: dotX, y: dotY }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: isHovering ? 0 : 1, opacity: isHovering ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </motion.div>

      {/* Ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        animate={{
          width: isHovering ? 48 : 0,
          height: isHovering ? 48 : 0,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-full h-full rounded-full border border-white/80 flex items-center justify-center">
          <span className="text-white text-[10px] font-mono tracking-widest uppercase select-none">
            →
          </span>
        </div>
      </motion.div>
    </>
  );
}
