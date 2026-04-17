import React from "react";
import { motion } from "framer-motion";
import { useLang } from "../contexts/LanguageContext";
import { iconMap } from "../data/mock";

const WhyMe = () => {
  const { t } = useLang();
  return (
    <section className="section relative">
      <div className="container-x">
        <div className="max-w-[720px] mb-14">
          <div className="eyebrow mb-4">{t.why.eyebrow}</div>
          <h2 className="h-section mb-4">{t.why.title}</h2>
          <p className="sub-section">{t.why.sub}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.why.items.map((it, i) => {
            const Icon = iconMap[it.icon];
            return (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="relative rounded-2xl p-6 bg-gradient-to-b from-[#0b1220] to-[#080c16] border border-white/7 hover:border-[#264c74] transition-colors overflow-hidden"
              >
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#1c6fd0] opacity-[0.08] blur-3xl" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-[#0c1624] border border-[#1a2a3e] flex items-center justify-center text-[#7cc8ff] mb-5">
                    {Icon && <Icon size={18} strokeWidth={1.6} />}
                  </div>
                  <h3 className="text-[17px] font-semibold text-white tracking-tight mb-1.5">{it.title}</h3>
                  <p className="text-[13.5px] leading-[1.6] text-[#9aa4b6]">{it.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyMe;
