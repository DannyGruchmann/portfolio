import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import Hero3D from "./Hero3D";

const Hero = () => {
  const { t } = useLang();

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-[120px] pb-[120px] min-h-[100svh] flex items-center">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-[0.35]" />
      <div className="orb w-[520px] h-[520px] bg-[#1e73c8] -top-40 -right-40" />
      <div className="orb w-[440px] h-[440px] bg-[#5b3cd8] top-1/3 -left-40 opacity-30" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 120%, rgba(10,14,22,0) 0%, #07080c 75%)" }} />

      {/* 3D Scene */}
      <div className="absolute inset-0 opacity-90">
        <Hero3D />
      </div>

      {/* Foreground content */}
      <div className="container-x relative z-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur text-[12.5px] text-[#b9c6d8] mb-7"
          >
            <Sparkles size={13} className="text-[#7cc8ff]" />
            <span className="mono tracking-wider">{t.hero.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(40px,7vw,88px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-white"
          >
            <span className="block">{t.hero.headline1}</span>
            <span className="block text-gradient">{t.hero.headline2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-7 max-w-[620px] text-[17px] leading-[1.65] text-[#a8b2c3]"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <button className="btn-primary" onClick={() => scrollTo("#contact")}>
              {t.hero.ctaPrimary} <ArrowRight size={16} />
            </button>
            <button className="btn-ghost" onClick={() => scrollTo("#work")}>
              {t.hero.ctaSecondary} <ArrowUpRight size={16} />
            </button>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-[560px]"
          >
            {t.hero.metrics.map((m) => (
              <div key={m.label} className="relative pl-4">
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-gradient-to-b from-[#7cc8ff] to-transparent" />
                <div className="text-[26px] font-semibold tracking-tight text-white leading-none">{m.value}</div>
                <div className="mt-1.5 text-[12px] text-[#8591a6] tracking-wide">{m.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue column (was code snippet - now handled by Hero3D mockups) */}
        <div className="hidden lg:block lg:col-span-4" />
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6b7280]">
        <div className="mono text-[10px] tracking-[0.3em] uppercase">Scroll</div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-gradient-to-b from-[#7cc8ff] to-transparent"
        />
      </div>
    </section>
  );
};

export default Hero;
