import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "../contexts/LanguageContext";
import { techIcons } from "../data/techIcons";

// Helper: hex → rgba with alpha
const rgba = (hex, a) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const Tile = ({ item, index }) => {
  const [hover, setHover] = useState(false);
  const entry = techIcons[item.icon] || techIcons.components;
  const { Icon, color } = entry;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative group aspect-square rounded-2xl overflow-hidden cursor-default"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))",
        border: `1px solid ${hover ? rgba(color, 0.45) : "rgba(255,255,255,0.08)"}`,
        boxShadow: hover
          ? `0 20px 45px -18px ${rgba(color, 0.55)}, inset 0 0 0 1px ${rgba(color, 0.12)}`
          : "0 10px 30px -20px rgba(0,0,0,0.6)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* Radial brand-color glow behind icon */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hover ? 1 : 0.55,
          background: `radial-gradient(circle at 50% 42%, ${rgba(color, 0.28)} 0%, ${rgba(color, 0.08)} 35%, transparent 65%)`,
        }}
      />
      {/* Subtle inner ring on hover */}
      <div
        className="absolute inset-[1px] rounded-[15px] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hover ? 0.5 : 0,
          background: `conic-gradient(from 180deg at 50% 50%, ${rgba(color, 0)}, ${rgba(color, 0.25)}, ${rgba(color, 0)})`,
          mixBlendMode: "screen",
        }}
      />

      {/* Content */}
      <div className="relative h-full w-full flex flex-col">
        {/* Top: index */}
        <div className="px-4 pt-3.5 flex items-center justify-between">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 10px ${rgba(color, 0.8)}`,
            }}
          />
          <div className="mono text-[10px] tracking-[0.22em] text-[#6b7a92]">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Center: big brand icon */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{
              scale: hover ? 1.08 : 1,
              rotate: hover ? [0, -3, 3, 0] : 0,
            }}
            transition={{ duration: hover ? 0.6 : 0.3, ease: "easeOut" }}
            style={{
              color,
              filter: `drop-shadow(0 0 ${hover ? 18 : 10}px ${rgba(color, hover ? 0.75 : 0.45)})`,
            }}
          >
            <Icon size={54} />
          </motion.div>
        </div>

        {/* Bottom: label + accent line */}
        <div className="px-4 pb-4">
          <div className="text-white font-semibold text-[13.5px] tracking-tight leading-tight">
            {item.name}
          </div>
          <div
            className="mt-2 h-[2px] rounded-full transition-all duration-400"
            style={{
              width: hover ? "100%" : "28px",
              background: `linear-gradient(90deg, ${color}, ${rgba(color, 0)})`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

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
        <div className="flex flex-wrap gap-2 mb-10">
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

        {/* Tiles */}
        <motion.div
          key={activeGroup}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {t.stack.groups[activeGroup].items.map((item, i) => (
            <Tile key={item.name + i} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
