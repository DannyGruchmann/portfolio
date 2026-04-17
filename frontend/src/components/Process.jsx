import React from "react";
import { motion } from "framer-motion";
import { useLang } from "../contexts/LanguageContext";

const Process = () => {
  const { t } = useLang();
  return (
    <section id="process" className="section relative">
      <div className="container-x">
        <div className="max-w-[720px] mb-14">
          <div className="eyebrow mb-4">{t.process.eyebrow}</div>
          <h2 className="h-section">{t.process.title}</h2>
        </div>

        <div className="relative">
          {/* vertical/horizontal rail */}
          <div className="hidden md:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2a3a55] to-transparent" />
          <div className="grid md:grid-cols-4 gap-6">
            {t.process.steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#0a1220] border border-[#1a2a3e] relative z-10">
                  <span className="mono text-[13px] text-[#7cc8ff] tracking-wider">{step.n}</span>
                </div>
                <h3 className="mt-5 text-[18px] font-semibold text-white tracking-tight">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-[#9aa4b6] pr-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
