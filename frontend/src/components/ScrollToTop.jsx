import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 22, restDelta: 0.001 });
  // Circle circumference for r=26 → 2*PI*26 ≈ 163.36
  const CIRC = 163.36;
  const strokeDashoffset = useTransform(smooth, (v) => CIRC - v * CIRC);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={scrollTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 group"
        >
          <div className="relative w-[60px] h-[60px] flex items-center justify-center">
            {/* Backdrop / glass button */}
            <div className="absolute inset-[6px] rounded-full bg-[rgba(10,18,32,0.8)] backdrop-blur-md border border-white/10 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] group-hover:border-[#2e5a85] transition-colors" />

            {/* Progress ring */}
            <svg
              viewBox="0 0 60 60"
              className="absolute inset-0 w-full h-full -rotate-90"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="scrollGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="55%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              {/* track */}
              <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
              {/* progress */}
              <motion.circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke="url(#scrollGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                style={{ strokeDashoffset }}
              />
            </svg>

            {/* Icon */}
            <ArrowUp
              size={17}
              strokeWidth={2}
              className="relative text-[#c7e5ff] group-hover:text-white group-hover:-translate-y-0.5 transition-all"
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
