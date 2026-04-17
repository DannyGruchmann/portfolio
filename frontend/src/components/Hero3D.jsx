import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

// CSS/transform-based 3D scene: floating UI panels, dashboard mockups, grids.
// Perspective container tracks mouse for subtle parallax tilt.
const Hero3D = () => {
  const containerRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 70, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-8, 8]), { stiffness: 70, damping: 18 });

  const handleMove = (e) => {
    const r = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mx.set(x * 2);
    my.set(y * 2);
  };

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yParallax1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yParallax2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yParallax3 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      className="absolute inset-0 pointer-events-none"
      style={{ perspective: "1600px" }}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, opacity, transformStyle: "preserve-3d" }}
        className="absolute inset-0"
      >
        {/* Large dashboard mockup - right side */}
        <motion.div
          style={{ y: yParallax1, transform: "translateZ(60px)" }}
          initial={{ opacity: 0, x: 80, rotateZ: -6 }}
          animate={{ opacity: 1, x: 0, rotateZ: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 0.9, 0.3, 1] }}
          className="absolute right-[-80px] top-[22%] w-[640px] h-[400px] rounded-2xl overflow-hidden hidden md:block"
        >
          <div className="w-full h-full relative border border-[#1b2e4a] shadow-[0_40px_80px_-20px_rgba(14,90,200,0.35)] bg-gradient-to-br from-[#0b1526] to-[#060a12]">
            {/* dashboard chrome */}
            <div className="h-8 px-3 flex items-center gap-1.5 border-b border-white/5 bg-[#0a1220]">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              <span className="ml-3 mono text-[10px] text-[#6b7a92]">helix.ops / dashboard</span>
            </div>
            <div className="p-5 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg border border-white/5 bg-[#0a1424] p-3">
                  <div className="h-2 w-10 rounded-full bg-[#1e6fd0]/50 mb-2" />
                  <div className="mono text-[14px] text-[#c7e5ff]">
                    {["$ 24.8k", "187%", "9.2/10"][i]}
                  </div>
                  <div className="mt-2 flex items-end gap-1 h-7">
                    {[0.4, 0.6, 0.5, 0.8, 0.3, 0.9, 0.7].map((h, j) => (
                      <div key={j} className="flex-1 rounded-t bg-gradient-to-t from-[#1c6fd0] to-[#7cc8ff]" style={{ height: `${h * 100}%` }} />
                    ))}
                  </div>
                </div>
              ))}
              {/* Chart area */}
              <div className="col-span-3 mt-1 rounded-lg border border-white/5 bg-[#0a1424] p-3 h-[190px] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="mono text-[10.5px] text-[#6b7a92] tracking-wider">REVENUE / 30D</div>
                  <div className="flex gap-1.5">
                    <span className="tag !text-[9.5px] !py-0.5">Live</span>
                  </div>
                </div>
                <svg viewBox="0 0 400 120" className="w-full h-[140px] mt-1" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#7cc8ff" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#7cc8ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,90 C40,80 60,50 100,55 C140,60 160,30 200,35 C240,40 260,20 300,25 C340,30 360,10 400,15 L400,120 L0,120 Z"
                    fill="url(#chartGrad)"
                  />
                  <path
                    d="M0,90 C40,80 60,50 100,55 C140,60 160,30 200,35 C240,40 260,20 300,25 C340,30 360,10 400,15"
                    fill="none"
                    stroke="#7cc8ff"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Secondary floating card - upper right */}
        <motion.div
          style={{ y: yParallax2, transform: "translateZ(120px)" }}
          initial={{ opacity: 0, y: -30, rotateZ: 6 }}
          animate={{ opacity: 1, y: 0, rotateZ: 4 }}
          transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 0.9, 0.3, 1] }}
          className="absolute right-[-20px] top-[12%] w-[280px] rounded-xl overflow-hidden hidden md:block"
        >
          <div className="relative border border-[#264c74] bg-[#0a1322]/90 backdrop-blur-xl p-4 shadow-[0_30px_60px_-20px_rgba(124,200,255,0.35)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" />
              <div className="mono text-[10px] text-[#7cc8ff] tracking-[0.2em]">DEPLOY · READY</div>
            </div>
            <div className="mono text-[12px] leading-[1.7] text-[#c7e5ff]">
              <div><span className="text-[#6b7a92]">$</span> vercel --prod</div>
              <div><span className="text-[#6b7a92]">✓</span> Build completed</div>
              <div><span className="text-[#6b7a92]">✓</span> 42 routes</div>
              <div className="text-[#8ed6ff]">→ Live in 12s</div>
            </div>
          </div>
        </motion.div>

        {/* Mobile app mockup - bottom left */}
        <motion.div
          style={{ y: yParallax3, transform: "translateZ(90px)" }}
          initial={{ opacity: 0, y: 60, rotateZ: -8 }}
          animate={{ opacity: 1, y: 0, rotateZ: -5 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 0.9, 0.3, 1] }}
          className="absolute left-[-40px] bottom-[8%] w-[210px] h-[380px] rounded-[32px] overflow-hidden hidden lg:block"
        >
          <div className="w-full h-full relative border border-[#1b2e4a] bg-[#05080f] shadow-[0_40px_80px_-20px_rgba(14,90,200,0.45)]">
            <div className="absolute top-0 inset-x-0 h-6 flex items-center justify-center">
              <div className="w-24 h-5 bg-black rounded-b-2xl" />
            </div>
            <div className="px-4 pt-10 pb-4">
              <div className="mono text-[9px] text-[#6b7a92] tracking-wider mb-3">AURORA · HEALTH</div>
              <div className="text-[18px] font-semibold text-white leading-tight">Guten Morgen, Alex</div>
              <div className="text-[11px] text-[#8591a6] mt-0.5">3 Termine heute</div>

              <div className="mt-5 rounded-xl border border-white/6 bg-gradient-to-br from-[#0c1a2e] to-[#081020] p-3">
                <div className="flex items-center justify-between">
                  <div className="mono text-[9px] text-[#7cc8ff] tracking-wider">HEART · 30D</div>
                  <div className="text-[10px] text-[#c7e5ff]">68 bpm</div>
                </div>
                <svg viewBox="0 0 160 44" className="w-full h-10 mt-2">
                  <path d="M0,22 L20,22 L28,8 L36,36 L44,16 L52,22 L160,22" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                </svg>
              </div>

              {[0, 1].map((i) => (
                <div key={i} className="mt-2.5 rounded-lg bg-white/[0.03] border border-white/5 p-2.5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#1c6fd0] to-[#7cc8ff]" />
                  <div className="flex-1">
                    <div className="text-[11px] text-white">{["Dr. Müller", "Lab Results"][i]}</div>
                    <div className="text-[9px] text-[#8591a6] mono">{["09:30", "Verfügbar"][i]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Code panel floating mid-left (desktop only) */}
        <motion.div
          style={{ y: yParallax2, transform: "translateZ(40px)" }}
          initial={{ opacity: 0, scale: 0.9, rotateZ: 2 }}
          animate={{ opacity: 1, scale: 1, rotateZ: -2 }}
          transition={{ duration: 1.2, delay: 1, ease: [0.22, 0.9, 0.3, 1] }}
          className="absolute left-[4%] top-[62%] w-[240px] rounded-xl overflow-hidden hidden xl:block"
        >
          <div className="border border-[#1b2e4a] bg-[#0a1220]/90 backdrop-blur p-3 shadow-2xl">
            <div className="mono text-[10px] text-[#7cc8ff] tracking-wider mb-1.5">GIT · MAIN</div>
            <div className="mono text-[11px] leading-[1.7]">
              <div className="text-[#a8b2c3]"><span className="text-[#22d3ee]">+</span> feat(api): multi-tenant</div>
              <div className="text-[#a8b2c3]"><span className="text-[#22d3ee]">+</span> perf(ssr): -380ms TTFB</div>
              <div className="text-[#a8b2c3]"><span className="text-[#a78bfa]">~</span> refactor(auth): jwt</div>
            </div>
          </div>
        </motion.div>

        {/* Decorative grid plane tilted */}
        <div
          className="absolute inset-x-0 bottom-[-20%] h-[60%] opacity-40 pointer-events-none"
          style={{
            transform: "rotateX(60deg) translateZ(-50px)",
            transformOrigin: "50% 0%",
            backgroundImage:
              "linear-gradient(rgba(124,200,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(124,200,255,0.25) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Hero3D;
