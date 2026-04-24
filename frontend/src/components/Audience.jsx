import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";

const Audience = () => {
  const { t } = useLang();

  return (
    <section className="section relative !pt-0">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="eyebrow mb-4">{t.audience.eyebrow}</div>
            <h2 className="h-section mb-4">{t.audience.title}</h2>
            <p className="sub-section">{t.audience.sub}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="lg:col-span-7 grid gap-4"
          >
            <div className="glass-strong rounded-2xl p-6">
              <div className="mono mb-4 text-[11px] uppercase tracking-[0.22em] text-[#7cc8ff]">
                Fokus
              </div>
              <div className="flex flex-wrap gap-2">
                {t.audience.groups.map((group) => (
                  <span key={group} className="tag">
                    {group}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {t.audience.problems.map((problem, index) => (
                <div
                  key={problem}
                  className={`rounded-2xl border border-white/7 bg-white/[0.025] p-5 ${
                    index === t.audience.problems.length - 1 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#7cc8ff]" />
                    <p className="text-[14.5px] leading-[1.6] text-[#c7d0de]">{problem}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Audience;
