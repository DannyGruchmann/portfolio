import React from "react";
import { Github, Mail, ArrowUpRight } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { contactInfo } from "../data/mock";

const Footer = () => {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative pt-20 pb-10 border-t border-white/5 bg-[#05070b]">
      <div className="absolute inset-x-0 top-0 h-px divider-glow" />
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-10 mb-14">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-9 h-9 rounded-md border border-white/10 bg-gradient-to-br from-[#0b1622] to-[#07080c] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,200,255,0.55),transparent_60%)]" />
                <div className="absolute inset-0 flex items-center justify-center mono text-[14px] font-semibold text-[#cfe8ff]">DG</div>
              </div>
              <div className="text-white font-semibold tracking-tight">Danny Gruchmann</div>
            </div>
            <p className="text-[14.5px] text-[#9aa4b6] leading-[1.65] max-w-[380px]">
              {t.footer.tagline}
            </p>
            <div className="flex gap-2 mt-6">
              <a href={`mailto:${contactInfo.email}`} className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#b5becc] hover:text-[#7cc8ff] hover:border-[#2e5a85] transition-colors">
                <Mail size={16} />
              </a>
              <a href={contactInfo.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#b5becc] hover:text-[#7cc8ff] hover:border-[#2e5a85] transition-colors">
                <Github size={16} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-[#7c8699] mb-4">Sitemap</div>
            <ul className="space-y-2.5 text-[14px]">
              <li><a href="#about" className="text-[#b5becc] hover:text-white">{t.nav.about}</a></li>
              <li><a href="#services" className="text-[#b5becc] hover:text-white">{t.nav.services}</a></li>
              <li><a href="#work" className="text-[#b5becc] hover:text-white">{t.nav.work}</a></li>
              <li><a href="#process" className="text-[#b5becc] hover:text-white">{t.nav.process}</a></li>
              <li><a href="#contact" className="text-[#b5becc] hover:text-white">{t.nav.contact}</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="mono text-[11px] tracking-[0.2em] uppercase text-[#7c8699] mb-4">Contact</div>
            <a href={`mailto:${contactInfo.email}`} className="inline-flex items-center gap-2 text-[16px] text-white hover:text-[#a8e1ff] transition-colors group">
              {contactInfo.email}
              <ArrowUpRight size={15} className="text-[#7cc8ff] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <div className="text-[13px] text-[#8591a6] mt-3">{contactInfo.location}</div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-[12.5px] text-[#6b7280] mono">
            © {year} Danny Gruchmann · {t.footer.rights}
          </div>
          <div className="flex gap-5 text-[12.5px] text-[#8591a6]">
            <a href="#" className="hover:text-white">{t.footer.imprint}</a>
            <a href="#" className="hover:text-white">{t.footer.privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
