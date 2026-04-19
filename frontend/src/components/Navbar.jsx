import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import BrandLogo from "./BrandLogo";

const Navbar = () => {
  const { t, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#about", label: t.nav.about },
    { href: "#services", label: t.nav.services },
    { href: "#stack", label: t.nav.stack },
    { href: "#work", label: t.nav.work },
    { href: "#process", label: t.nav.process },
    { href: "#contact", label: t.nav.contact },
  ];

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-[rgba(7,8,12,0.75)] border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="container-x flex items-center justify-between h-[68px]">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-2.5 group"
          >
            <BrandLogo size="sm" />
            <div className="leading-tight">
              <div className="text-[14px] font-semibold tracking-tight text-white">Danny Gruchmann</div>
              <div className="text-[11px] text-[#7c8699] mono tracking-wider">FULLSTACK DEV</div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="relative px-3.5 py-2 text-[14px] text-[#b5becc] hover:text-white transition-colors duration-200 rounded-md hover:bg-white/5"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#b5becc] hover:text-white border border-white/10 rounded-md hover:border-white/20 transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              <span className="mono uppercase tracking-wider">{lang}</span>
            </button>
            <button
              onClick={() => scrollTo("#contact")}
              className="hidden sm:inline-flex btn-primary !py-2.5 !px-4 !text-[13.5px]"
            >
              {t.nav.cta}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden text-white p-2 rounded-md border border-white/10"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden backdrop-blur-xl bg-[rgba(7,8,12,0.95)] border-b border-white/5"
          >
            <div className="container-x py-4 flex flex-col gap-1">
              {links.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className="text-left px-3 py-3 text-[15px] text-[#cfd6e3] hover:text-white hover:bg-white/5 rounded-md"
                >
                  {l.label}
                </button>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={toggle} className="btn-ghost flex-1 justify-center">
                  <Globe size={14} /> <span className="mono uppercase">{lang}</span>
                </button>
                <button onClick={() => scrollTo("#contact")} className="btn-primary flex-1 justify-center">
                  {t.nav.cta}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
