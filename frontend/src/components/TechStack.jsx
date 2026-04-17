import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "../contexts/LanguageContext";
import { iconMap } from "../data/mock";

const TechStack = () => {
  const { t } = useLang();
  const [activeGroup, setActiveGroup] = useState(0);

  return (
    <section id="stack" className="section relative">
      <div
        className="absolute inset-0 bg-grid opacity-[0.2] pointer-events-none"
        style={{ maskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)" }}
      />
      <div className="container-x relative">
        <div className="max-w-[720px] mb-14">
          <div className="eyebrow mb-4">{t.stack.eyebrow}</div>
          <h2 className="h-section mb-4">{t.stack.title}</h2>
          <p className="sub-section">{t.stack.sub}</p>
        </div>

        {/* Group tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {t.stack.groups.map((g, i) => (
            <button
              key={g.name}
              onClick={() => setActiveGroup(i)}
              className={`px-4 py-2 rounded-full text-[13px] border transition-all ${
                activeGroup === i
                  ? "bg-[#0d2033] border-[#2e5a85] text-[#c7e5ff]"
                  : "bg-transparent border-white/10 text-[#8591a6] hover:border-white/25 hover:text-white"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Grid tiles */}
        <motion.div
          key={activeGroup}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          {t.stack.groups[activeGroup].items.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.name + i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="relative group aspect-[1.1/1] rounded-xl glass hover:border-[#2e5a85] transition-all duration-300 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.18), transparent 70%)",
                  }}
                />
                <div className="relative h-full w-full p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#0c1624] border border-[#1a2a3e] text-[#7cc8ff] group-hover:text-[#a8e1ff] group-hover:border-[#2e5a85] transition-colors">
                      {Icon && <Icon size={17} strokeWidth={1.7} />}
                    </div>
                    <div className="mono text-[10px] tracking-[0.2em] text-[#6b7a92]">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[14px] tracking-tight leading-tight">
                      {item.name}
                    </div>
                    <div className="mt-2 h-[2px] w-8 bg-gradient-to-r from-[#7cc8ff] to-transparent group-hover:w-16 transition-all" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
