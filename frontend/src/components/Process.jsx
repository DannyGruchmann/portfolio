import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "../contexts/LanguageContext";

// Simple VERTICAL timeline with thin line
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

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          <VerticalTimeline steps={t.process.steps} scrollProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
};

// ============ Vertical Timeline ============
const VerticalTimeline = ({ steps, scrollProgress }) => {
  const lineProgress = useTransform(scrollProgress, [0, 1], [0, 1]);

  return (
    <div className="relative">
      {/* Thin vertical line */}
      <div className="absolute left-8 top-0 bottom-0 w-[1.5px] bg-[#1a2a3e] hidden md:block">
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 to-cyan-500"
          style={{
            scaleY: lineProgress,
            transformOrigin: "top",
          }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-16">
        {steps.map((step, i) => (
          <ProcessStep
            key={step.n}
            step={step}
            index={i}
            scrollProgress={scrollProgress}
            threshold={i * 0.15}
          />
        ))}
      </div>
    </div>
  );
};

// ============ Individual Process Step ============
const ProcessStep = ({ step, index, scrollProgress, threshold }) => {
  const opacity = useTransform(scrollProgress, [threshold - 0.05, threshold], [0, 1]);
  const y = useTransform(scrollProgress, [threshold - 0.05, threshold], [20, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="relative flex items-start gap-8 md:gap-12"
    >
      {/* Numbered Circle */}
      <div className="relative flex-shrink-0 z-10">
        <motion.div
          className="relative w-16 h-16"
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
              delay: index * 0.2,
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
      </div>

      {/* Content */}
      <div className="flex-1 pt-3">
        {/* Duration badge */}
        <div className="inline-block px-3 py-1 mb-3 rounded-full bg-cyan-400/10 border border-cyan-400/20">
          <span className="text-xs text-cyan-300 mono tracking-wider">{step.duration}</span>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
          {step.title}
        </h3>
        <p className="text-base text-[#9aa4b6] leading-relaxed max-w-2xl">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
};

export default Process;
