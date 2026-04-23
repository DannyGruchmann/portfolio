import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { generatedProjects } from "../data/generatedProjects";

const tabOrder = ["websites", "webapps", "shops", "scrollytelling", "other"];

const projectCardClass =
  "group relative overflow-hidden rounded-[28px] border border-white/8 bg-[#0a0e16]";
const allProjectsCardClass =
  "overflow-hidden rounded-[24px] border border-white/8 bg-[#0a0e16]";

const Projects = () => {
  const { t, lang } = useLang();
  const [hovered, setHovered] = useState(null);
  const [activeTab, setActiveTab] = useState("websites");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const items = useMemo(
    () => [...(generatedProjects[lang] || []), ...t.work.items],
    [lang, t.work.items]
  );

  const filteredItems = useMemo(
    () => items.filter((item) => item.type === activeTab),
    [activeTab, items]
  );
  const hasProjects = items.length > 0;

  useEffect(() => {
    if (!showAllProjects) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showAllProjects]);

  const handleTabClick = (tab) => {
    if (tab === "other") {
      setShowAllProjects(true);
      return;
    }

    setShowAllProjects(false);
    setActiveTab(tab);
  };

  return (
    <>
      <section id="work" className="section relative">
        <div className="container-x">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[680px]">
              <div className="eyebrow mb-4">{t.work.eyebrow}</div>
              <h2 className="h-section mb-4">{t.work.title}</h2>
              <p className="sub-section">{t.work.sub}</p>
            </div>
          </div>

          <div className="mb-8 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tabOrder.map((tab, index) => {
              const isOther = tab === "other";
              const isActive = !isOther && activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={[
                    "group relative shrink-0 rounded-[20px] border px-5 py-3 text-left transition-all duration-300",
                    isActive
                      ? "border-[#7cc8ff]/40 bg-[linear-gradient(180deg,rgba(116,203,255,0.16),rgba(18,25,37,0.92))] text-white shadow-[0_18px_45px_-24px_rgba(89,191,255,0.7)]"
                      : "border-white/8 bg-white/[0.025] text-[#aab6c8] hover:border-[#7cc8ff]/25 hover:bg-white/[0.045] hover:text-white",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`mono text-[11px] tracking-[0.22em] ${
                        isActive ? "text-[#7cc8ff]" : "text-[#5d697d] group-hover:text-[#7cc8ff]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] font-medium tracking-[-0.01em]">
                      {t.work.tabs[tab]}
                    </span>
                    {isOther ? <ArrowRight size={16} className="text-[#7cc8ff]" /> : null}
                  </div>
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((p, i) => (
                <motion.article
                  key={`${activeTab}-${p.name}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.7, delay: (i % 2) * 0.08 }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`${projectCardClass} ${p.url ? "cursor-pointer" : ""}`}
                >
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${p.name} öffnen`}
                      className="absolute inset-0 z-10"
                    />
                  ) : null}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.9,0.2,1)] group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/42 to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                      <span className="mono rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c7e5ff]">
                        {p.category}
                      </span>
                      <span className="mono rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] tracking-[0.18em] text-[#8591a6]">
                        {p.year}
                      </span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hovered === i ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#7cc8ff] text-[#06151f]"
                    >
                      <ArrowUpRight size={18} />
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[21px] font-semibold tracking-tight text-white">{p.name}</h3>
                    </div>
                    <p className="mt-2 text-[14.5px] leading-[1.6] text-[#9aa4b6]">{p.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span key={s} className="tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="md:col-span-2 rounded-[28px] border border-dashed border-white/12 bg-white/[0.02] p-8 text-center">
                <div className="mono text-[11px] uppercase tracking-[0.22em] text-[#7cc8ff]">
                  {t.work.emptyEyebrow}
                </div>
                <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-white">
                  {hasProjects ? t.work.emptyCategoryTitle : t.work.emptyTitle}
                </h3>
                <p className="mx-auto mt-3 max-w-[640px] text-[15px] leading-[1.7] text-[#9aa4b6]">
                  {hasProjects ? t.work.emptyCategorySub : t.work.emptySub}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showAllProjects ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[#05070c]/88 backdrop-blur-md"
          >
            <div className="h-full overflow-y-auto">
              <div className="container-x py-6 sm:py-10">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.28 }}
                  className="mx-auto max-w-[1180px] rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,22,0.98),rgba(8,10,16,0.98))] p-5 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)] sm:p-8"
                >
                  <div className="mb-8 flex flex-col gap-5 border-b border-white/8 pb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-[720px]">
                      <div className="eyebrow mb-4">{t.work.eyebrow}</div>
                      <h3 className="text-[30px] font-semibold tracking-[-0.03em] text-white sm:text-[42px]">
                        {t.work.allProjectsTitle}
                      </h3>
                      <p className="mt-3 max-w-[680px] text-[15px] leading-[1.7] text-[#9aa4b6] sm:text-[16px]">
                        {t.work.allProjectsSub}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAllProjects(false)}
                      className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-medium text-[#d9e6f5] transition hover:border-[#7cc8ff]/35 hover:text-white"
                    >
                      <X size={16} />
                      {t.work.closeProjects}
                    </button>
                  </div>

                  {items.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {items.map((p) => (
                        <article
                          key={`all-${p.name}`}
                          className={`${allProjectsCardClass} ${p.url ? "relative cursor-pointer" : "relative"}`}
                        >
                          {p.url ? (
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${p.name} öffnen`}
                              className="absolute inset-0 z-10"
                            />
                          ) : null}
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/30 to-transparent" />
                            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                              <span className="mono rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c7e5ff]">
                                {p.category}
                              </span>
                              <span className="mono rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] tracking-[0.18em] text-[#8591a6]">
                                {p.year}
                              </span>
                            </div>
                          </div>
                          <div className="p-5">
                            <h4 className="text-[20px] font-semibold tracking-tight text-white">{p.name}</h4>
                            <p className="mt-2 text-[14px] leading-[1.65] text-[#9aa4b6]">{p.desc}</p>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {p.stack.map((s) => (
                                <span key={`${p.name}-${s}`} className="tag">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
                      <div className="mono text-[11px] uppercase tracking-[0.22em] text-[#7cc8ff]">
                        {t.work.emptyEyebrow}
                      </div>
                      <h4 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-white">
                        {t.work.emptyTitle}
                      </h4>
                      <p className="mx-auto mt-3 max-w-[620px] text-[15px] leading-[1.7] text-[#9aa4b6]">
                        {t.work.emptySub}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-4 rounded-[24px] border border-[#7cc8ff]/15 bg-[linear-gradient(180deg,rgba(124,200,255,0.08),rgba(124,200,255,0.02))] p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="mono text-[11px] uppercase tracking-[0.22em] text-[#7cc8ff]">Next Step</div>
                      <p className="mt-2 text-[15px] text-[#dbe9f8]">{t.work.allProjectsCta}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAllProjects(false)}
                      className="btn-ghost w-fit"
                    >
                      {t.work.closeProjects}
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Projects;
