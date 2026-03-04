import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "default" | "dark";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: Variant;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, variant = "default", ...props }, ref) => {
  const isDark = variant === "dark";

  return (
    <button
      ref={ref}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-full border px-6 py-2.5 text-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        isDark
          ? "border-white/20 bg-transparent text-white"
          : "border-trex-fg/20 bg-trex-bg text-trex-fg",
        className,
      )}
      {...props}
    >
      {/* Static text — slides out right on hover */}
      <span className="relative inline-block transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0">
        {text}
      </span>

      {/* Hover state: text + arrow slide in from right */}
      <div
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center gap-2 translate-x-10 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100",
          isDark ? "text-trex-fg" : "text-trex-bg",
        )}
      >
        <span>{text}</span>
        <ArrowRight className="w-4 h-4" />
      </div>

      {/* Fill bubble */}
      <div
        className={cn(
          "absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-full transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8]",
          isDark ? "bg-trex-accent" : "bg-trex-fg",
        )}
      />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
