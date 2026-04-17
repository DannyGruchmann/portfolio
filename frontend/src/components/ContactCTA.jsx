import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";

const ContactCTA = () => {
  const { t } = useLang();

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section relative">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-white/8"
        >
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, #0a1322 0%, #0b1830 40%, #0a0f1c 100%)",
          }} />
          <div className="absolute inset-0 bg-grid opacity-[0.25]" />
          <div className="absolute -top-20 -right-20 w-[380px] h-[380px] rounded-full bg-[#2779ea] opacity-20 blur-[80px]" />
          <div className="absolute -bottom-16 -left-10 w-[300px] h-[300px] rounded-full bg-[#6d4ae0] opacity-15 blur-[90px]" />

          <div className="relative px-8 sm:px-12 md:px-16 py-14 md:py-20 text-center max-w-[800px] mx-auto">
            <div className="eyebrow mb-5 justify-center">{t.cta.eyebrow}</div>
            <h2 className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.02em] text-white leading-[1.1]">
              {t.cta.title}
            </h2>
            <p className="mt-5 text-[16px] text-[#a8b2c3] leading-[1.6] max-w-[560px] mx-auto">
              {t.cta.sub}
            </p>
            <div className="mt-9">
              <button className="btn-primary" onClick={() => scrollTo("#contact")}>
                {t.cta.btn} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
