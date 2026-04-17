import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { iconMap } from "../data/mock";

const Services = () => {
  const { t } = useLang();

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="services" className="section relative">
      <div className="container-x">
        <div className="max-w-[720px] mb-14">
          <div className="eyebrow mb-4">{t.services.eyebrow}</div>
          <h2 className="h-section mb-4">{t.services.title}</h2>
          <p className="sub-section">{t.services.sub}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.services.items.map((s, i) => {
            const Icon = iconMap[s.icon];
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                onMouseMove={handleMove}
                className="card-premium group"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-[#0c1624] border border-[#1a2a3e] text-[#7cc8ff] group-hover:text-[#a8e1ff] transition-colors">
                      {Icon && <Icon size={20} strokeWidth={1.6} />}
                    </div>
                    <ArrowUpRight size={18} className="text-[#4a5669] group-hover:text-[#7cc8ff] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="mt-6 text-[19px] font-semibold text-white tracking-tight">{s.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[#9aa4b6]">{s.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
