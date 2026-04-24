import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { iconMap } from "../data/mock";

const AutomationBlueprint = () => {
  const { t } = useLang();

  return (
    <section id="automation" className="section relative">
      <div className="container-x">
        <div className="mb-14 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="eyebrow mb-4">{t.automation.eyebrow}</div>
            <h2 className="h-section mb-4">{t.automation.title}</h2>
            <p className="sub-section">{t.automation.sub}</p>
          </div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-3 gap-3">
              {t.automation.stats.map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-4">
                  <div className="text-[24px] font-semibold leading-none tracking-tight text-white">{stat.value}</div>
                  <div className="mt-2 text-[11px] leading-[1.4] text-[#8591a6]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0e16] p-6 sm:p-7"
          >
            <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#1e73c8] opacity-15 blur-[70px]" />
            <div className="relative">
              <div className="mono mb-3 text-[11px] uppercase tracking-[0.22em] text-[#7cc8ff]">
                {t.automation.problemTitle}
              </div>
              <p className="text-[16px] leading-[1.75] text-[#c7d0de]">{t.automation.problem}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-[#2e5a85]/45 bg-[linear-gradient(180deg,rgba(12,27,43,0.9),rgba(8,13,22,0.96))] p-6 sm:p-7"
          >
            <div className="absolute -left-20 -bottom-24 h-56 w-56 rounded-full bg-[#7cc8ff] opacity-12 blur-[70px]" />
            <div className="relative">
              <div className="mono mb-3 text-[11px] uppercase tracking-[0.22em] text-[#7cc8ff]">
                {t.automation.resultTitle}
              </div>
              <p className="text-[16px] leading-[1.75] text-[#d9e6f5]">{t.automation.result}</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-5">
          {t.automation.flow.map((step, index) => {
            const Icon = iconMap[step.icon];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                className="relative rounded-2xl border border-white/8 bg-white/[0.025] p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1a2a3e] bg-[#0c1624] text-[#7cc8ff]">
                    {Icon ? <Icon size={19} strokeWidth={1.7} /> : null}
                  </div>
                  {index < t.automation.flow.length - 1 ? (
                    <ArrowRight className="hidden text-[#334155] lg:block" size={18} />
                  ) : null}
                </div>
                <h3 className="text-[17px] font-semibold tracking-tight text-white">{step.title}</h3>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-[#9aa4b6]">{step.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AutomationBlueprint;
