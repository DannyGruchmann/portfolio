import React from "react";
import { motion } from "framer-motion";
import { useLang } from "../contexts/LanguageContext";

const About = () => {
  const { t } = useLang();
  return (
    <section id="about" className="section relative">
      <div className="container-x grid lg:grid-cols-12 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <div className="eyebrow mb-5">{t.about.eyebrow}</div>
          <h2 className="h-section">{t.about.title}</h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-7 space-y-5"
        >
          <p className="text-[17px] leading-[1.75] text-[#c7d0de]">{t.about.p1}</p>
          <p className="text-[17px] leading-[1.75] text-[#a3adbe]">{t.about.p2}</p>

          <div className="grid sm:grid-cols-3 gap-4 pt-6">
            {t.about.pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.08 }}
                className="glass rounded-xl p-5"
              >
                <div className="mono text-[11px] tracking-[0.2em] text-[#7cc8ff] mb-2">0{i + 1}</div>
                <div className="text-white font-semibold text-[15.5px] mb-1.5">{p.title}</div>
                <div className="text-[13.5px] text-[#9aa4b6] leading-[1.55]">{p.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
