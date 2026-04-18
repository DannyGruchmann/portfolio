import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "../contexts/LanguageContext";

// Premium animated process timeline with scroll-driven snake line
const Process = () => {
  const { t } = useLang();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section id="process" className="section relative" ref={containerRef}>
      <div className="container-x">
        <div className="max-w-[720px] mb-20">
          <div className="eyebrow mb-4">{t.process.eyebrow}</div>
          <h2 className="h-section mb-4">{t.process.title}</h2>
          <p className="sub-section">{t.process.sub}</p>
        </div>

        {/* Animated Timeline */}
        <div className="relative max-w-5xl mx-auto">
          <ProcessTimeline steps={t.process.steps} scrollProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
};

// ============ Process Timeline with Snake Line ============
const ProcessTimeline = ({ steps, scrollProgress }) => {
  // Calculate line progress for each segment
  const line1Progress = useTransform(scrollProgress, [0, 0.2], [0, 1]); // Step 1 → 2
  const curve1Progress = useTransform(scrollProgress, [0.2, 0.35], [0, 1]); // Curve down
  const line2Progress = useTransform(scrollProgress, [0.35, 0.55], [0, 1]); // Step 4 → 3 (right to left)
  const curve2Progress = useTransform(scrollProgress, [0.55, 0.7], [0, 1]); // Curve down
  const line3Progress = useTransform(scrollProgress, [0.7, 1], [0, 1]); // Step 5 → 6

  return (
    <div className="relative py-10">
      {/* Row 1: Steps 1 & 2 (left to right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-24 relative">
        <ProcessStep step={steps[0]} index={0} scrollProgress={scrollProgress} threshold={0} />
        <ProcessStep step={steps[1]} index={1} scrollProgress={scrollProgress} threshold={0.15} />
        
        {/* Horizontal Line 1 (Step 1 → 2) */}
        <AnimatedLine
          className="hidden md:block absolute top-[32px] left-[15%] right-[15%]"
          progress={line1Progress}
          direction="horizontal"
        />
      </div>

      {/* Large outer curve from right (after step 2) down to row 2 */}
      <div className="hidden md:block relative h-32 -my-16">
        <AnimatedOuterCurve progress={curve1Progress} direction="right-to-bottom" />
      </div>

      {/* Row 2: Steps 3 & 4 (right to left) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-24 relative">
        <ProcessStep step={steps[3]} index={3} scrollProgress={scrollProgress} threshold={0.5} order="md:order-2" />
        <ProcessStep step={steps[2]} index={2} scrollProgress={scrollProgress} threshold={0.35} order="md:order-1" />
        
        {/* Horizontal Line 2 (Step 4 → 3, reverse) */}
        <AnimatedLine
          className="hidden md:block absolute top-[32px] left-[15%] right-[15%]"
          progress={line2Progress}
          direction="horizontal-reverse"
        />
      </div>

      {/* Large outer curve from left (after step 3) down to row 3 */}
      <div className="hidden md:block relative h-32 -my-16">
        <AnimatedOuterCurve progress={curve2Progress} direction="left-to-bottom" />
      </div>

      {/* Row 3: Steps 5 & 6 (left to right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative">
        <ProcessStep step={steps[4]} index={4} scrollProgress={scrollProgress} threshold={0.7} />
        <ProcessStep step={steps[5]} index={5} scrollProgress={scrollProgress} threshold={0.85} />
        
        {/* Horizontal Line 3 (Step 5 → 6) */}
        <AnimatedLine
          className="hidden md:block absolute top-[32px] left-[15%] right-[15%]"
          progress={line3Progress}
          direction="horizontal"
        />
      </div>
    </div>
  );
};

// ============ Individual Process Step ============
const ProcessStep = ({ step, index, scrollProgress, threshold, order = "" }) => {
  const opacity = useTransform(scrollProgress, [threshold - 0.05, threshold], [0, 1]);
  const y = useTransform(scrollProgress, [threshold - 0.05, threshold], [20, 0]);
  const scale = useTransform(scrollProgress, [threshold - 0.05, threshold], [0.95, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`relative ${order}`}
    >
      {/* Numbered Node */}
      <motion.div
        className="relative w-16 h-16 mb-6 mx-auto md:mx-0"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/40"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Inner circle */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0a1220] to-[#0d1a2d] border border-cyan-400/30 flex items-center justify-center"
          style={{
            boxShadow: "0 0 30px rgba(34,211,238,0.3), inset 0 0 20px rgba(34,211,238,0.1)",
          }}
        >
          <span className="mono text-lg font-bold text-cyan-300">{step.n}</span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="text-center md:text-left">
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
          {step.title}
        </h3>
        <p className="text-sm text-[#9aa4b6] leading-relaxed">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
};

// ============ Animated Line ============
const AnimatedLine = ({ className, progress, direction }) => {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className={className}>
      <motion.div
        style={{
          scaleX,
          transformOrigin: direction === "horizontal-reverse" ? "right" : "left",
        }}
        className="h-[2px] w-full bg-gradient-to-r from-cyan-400/80 via-cyan-300/60 to-cyan-400/80 relative"
      >
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300"
          style={{
            boxShadow: "0 0 20px rgba(34,211,238,0.8), 0 0 40px rgba(34,211,238,0.5)",
          }}
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

// ============ Animated Outer Curve (Large S-curve around nodes) ============
const AnimatedOuterCurve = ({ progress, direction }) => {
  const pathLength = useTransform(progress, [0, 1], [0, 1]);

  // Different paths for right-side and left-side curves
  const path = direction === "right-to-bottom"
    ? "M 85 0 Q 110 20, 110 50 Q 110 80, 85 100" // Goes right-outside, curves down, comes back
    : "M 15 0 Q -10 20, -10 50 Q -10 80, 15 100"; // Goes left-outside, curves down, comes back

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
    >
      <motion.path
        d={path}
        fill="none"
        stroke="url(#outerCurveGradient)"
        strokeWidth="2"
        style={{
          pathLength,
        }}
      />
      
      {/* Glowing dot at the end of the line */}
      <motion.circle
        r="2"
        fill="rgba(34,211,238,1)"
        style={{
          offsetDistance: useTransform(pathLength, [0, 1], ["0%", "100%"]),
          offsetPath: `path('${path}')`,
        }}
      >
        <animate
          attributeName="r"
          values="2;3;2"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </motion.circle>

      <defs>
        <linearGradient id="outerCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.8)" />
          <stop offset="50%" stopColor="rgba(34,211,238,0.7)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.8)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Process;
