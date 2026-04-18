import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "../contexts/LanguageContext";

// Premium animated process timeline with ONE continuous flowing line
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

// ============ Process Timeline with ONE Continuous Line ============
const ProcessTimeline = ({ steps, scrollProgress }) => {
  return (
    <div className="relative py-10">
      {/* ONE continuous flowing line behind all nodes */}
      <ContinuousFlowingLine scrollProgress={scrollProgress} />

      {/* Row 1: Steps 1 & 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-32 relative">
        <ProcessStep step={steps[0]} index={0} scrollProgress={scrollProgress} threshold={0} />
        <ProcessStep step={steps[1]} index={1} scrollProgress={scrollProgress} threshold={0.15} />
      </div>

      {/* Row 2: Steps 3 & 4 - CORRECTED ORDER: 3 on RIGHT, 4 on LEFT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-32 relative">
        <ProcessStep step={steps[3]} index={3} scrollProgress={scrollProgress} threshold={0.5} order="md:order-1" />
        <ProcessStep step={steps[2]} index={2} scrollProgress={scrollProgress} threshold={0.35} order="md:order-2" />
      </div>

      {/* Row 3: Steps 5 & 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative">
        <ProcessStep step={steps[4]} index={4} scrollProgress={scrollProgress} threshold={0.7} />
        <ProcessStep step={steps[5]} index={5} scrollProgress={scrollProgress} threshold={0.85} />
      </div>
    </div>
  );
};

// ============ ONE Continuous Flowing Line ============
const ContinuousFlowingLine = ({ scrollProgress }) => {
  const pathLength = useTransform(scrollProgress, [0, 1], [0, 1]);

  // ONE path that flows through all 6 nodes
  // Adjusted coordinates to match actual grid positions
  const path = `
    M 15 8
    L 85 8
    C 92 8, 96 12, 96 20
    C 96 30, 92 38, 85 42
    L 85 96
    L 15 96
    C 8 96, 4 100, 4 108
    C 4 118, 8 126, 15 130
    L 15 184
    L 85 184
  `;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
      viewBox="0 0 100 280"
      preserveAspectRatio="none"
      style={{ zIndex: 0 }}
    >
      <motion.path
        d={path}
        fill="none"
        stroke="url(#flowGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          pathLength,
        }}
      />
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.8)" />
          <stop offset="50%" stopColor="rgba(34,211,238,0.9)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.8)" />
        </linearGradient>
      </defs>
    </svg>
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
      className={`relative z-10 ${order}`}
    >
      {/* Numbered Node */}
      <motion.div
        className="relative w-16 h-16 mb-6 mx-auto md:mx-0 z-20"
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

export default Process;
