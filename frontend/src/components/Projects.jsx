import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";

const Projects = () => {
  const { t } = useLang();
  const [hovered, setHovered] = useState(null);

  return (
    <section id="work" className="section relative">
      <div className="container-x">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-[680px]">
            <div className="eyebrow mb-4">{t.work.eyebrow}</div>
            <h2 className="h-section mb-4">{t.work.title}</h2>
            <p className="sub-section">{t.work.sub}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {t.work.items.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.08 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative rounded-2xl overflow-hidden border border-white/8 bg-[#0a0e16]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.9,0.2,1)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/40 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="mono text-[11px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full bg-black/50 border border-white/10 text-[#c7e5ff]">
                    {p.category}
                  </span>
                  <span className="mono text-[11px] tracking-[0.18em] px-2.5 py-1 rounded-full bg-black/50 border border-white/10 text-[#8591a6]">
                    {p.year}
                  </span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hovered === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#7cc8ff] text-[#06151f] flex items-center justify-center"
                >
                  <ArrowUpRight size={18} />
                </motion.div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[21px] font-semibold text-white tracking-tight">{p.name}</h3>
                </div>
                <p className="mt-2 text-[14.5px] text-[#9aa4b6] leading-[1.6]">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
