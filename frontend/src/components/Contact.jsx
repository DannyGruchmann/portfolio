import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Github, MapPin, Send, Check } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { contactInfo } from "../data/mock";
import { useToast } from "../hooks/use-toast";

const configuredBackendUrl =
  process.env.REACT_APP_BACKEND_URL && process.env.REACT_APP_BACKEND_URL !== "undefined"
    ? process.env.REACT_APP_BACKEND_URL
    : "";
const API = configuredBackendUrl ? `${configuredBackendUrl}/api` : "/api";
const EMAIL_PATTERN = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
const PHONE_PATTERN = "^[+]?[- 0-9()/]{6,30}$";

const Contact = () => {
  const { t } = useLang();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    goal: "",
    timeline: "",
    budget: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/inquiries`, form, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });
      setSent(true);
      toast({ title: t.contact.form.sent });
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        industry: "",
        goal: "",
        timeline: "",
        budget: "",
        message: "",
      });
      setTimeout(() => setSent(false), 3500);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail || err.message || "Error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section relative">
      <div className="container-x grid lg:grid-cols-12 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <div className="eyebrow mb-4">{t.contact.eyebrow}</div>
          <h2 className="h-section mb-5">{t.contact.title}</h2>
          <p className="sub-section mb-10">{t.contact.sub}</p>

          <div className="space-y-3">
            <a href={`mailto:${contactInfo.email}`} className="glass rounded-xl p-4 flex items-center gap-3 hover:border-[#2e5a85] transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#0c1624] border border-[#1a2a3e] flex items-center justify-center text-[#7cc8ff]">
                <Mail size={17} />
              </div>
              <div>
                <div className="text-[11px] mono tracking-wider text-[#7c8699]">EMAIL</div>
                <div className="text-[14.5px] text-white group-hover:text-[#a8e1ff] transition-colors">{contactInfo.email}</div>
              </div>
            </a>
            <a href={contactInfo.github} target="_blank" rel="noreferrer" className="glass rounded-xl p-4 flex items-center gap-3 hover:border-[#2e5a85] transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#0c1624] border border-[#1a2a3e] flex items-center justify-center text-[#7cc8ff]">
                <Github size={17} />
              </div>
              <div>
                <div className="text-[11px] mono tracking-wider text-[#7c8699]">GITHUB</div>
                <div className="text-[14.5px] text-white group-hover:text-[#a8e1ff] transition-colors">github.com/dannygrmn</div>
              </div>
            </a>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0c1624] border border-[#1a2a3e] flex items-center justify-center text-[#7cc8ff]">
                <MapPin size={17} />
              </div>
              <div>
                <div className="text-[11px] mono tracking-wider text-[#7c8699]">LOCATION</div>
                <div className="text-[14.5px] text-white">{contactInfo.location}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="lg:col-span-7 glass-strong rounded-2xl p-6 sm:p-8 space-y-4 border-glow"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t.contact.form.name} name="name" value={form.name} onChange={handleChange} required />
            <Field
              label={t.contact.form.email}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              pattern={EMAIL_PATTERN}
              title="Bitte gib eine gültige E-Mail-Adresse ein."
              required
            />
          </div>
          <Field label={t.contact.form.company} name="company" value={form.company} onChange={handleChange} />

          <ChoiceGroup
            label={t.contact.form.industry}
            options={t.contact.industries}
            value={form.industry}
            onSelect={(industry) => setForm({ ...form, industry })}
          />

          <ChoiceGroup
            label={t.contact.form.goal}
            options={t.contact.goals}
            value={form.goal}
            onSelect={(goal) => setForm({ ...form, goal })}
          />

          <ChoiceGroup
            label={t.contact.form.timeline}
            options={t.contact.timelines}
            value={form.timeline}
            onSelect={(timeline) => setForm({ ...form, timeline })}
          />

          <ChoiceGroup
            label={t.contact.form.budget}
            options={t.contact.budgets}
            value={form.budget}
            onSelect={(budget) => setForm({ ...form, budget })}
          />

          <div>
            <label className="mono text-[11px] tracking-[0.18em] uppercase text-[#7c8699] mb-2 block">{t.contact.form.message}</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
              className="w-full bg-[#0a0f18] border border-white/10 rounded-xl px-4 py-3 text-[14.5px] text-white placeholder:text-[#4a5669] focus:outline-none focus:border-[#2e5a85] focus:ring-2 focus:ring-[#1c6fd0]/25 transition-colors resize-none"
              placeholder="..."
            />
          </div>

          <Field
            label={t.contact.form.phone}
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            pattern={PHONE_PATTERN}
            title="Bitte gib eine gültige Telefonnummer ein oder lasse das Feld leer."
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || sent}
              className="btn-primary w-full sm:w-auto justify-center disabled:opacity-70"
            >
              {sent ? <><Check size={16} /> {t.contact.form.sent}</> : <>{t.contact.form.submit} <Send size={15} /></>}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

const Field = ({ label, name, value, onChange, type = "text", required, pattern, title }) => (
  <div>
    <label className="mono text-[11px] tracking-[0.18em] uppercase text-[#7c8699] mb-2 block">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      pattern={pattern}
      title={title}
      className="w-full bg-[#0a0f18] border border-white/10 rounded-xl px-4 py-3 text-[14.5px] text-white placeholder:text-[#4a5669] focus:outline-none focus:border-[#2e5a85] focus:ring-2 focus:ring-[#1c6fd0]/25 transition-colors"
    />
  </div>
);

const ChoiceGroup = ({ label, options, value, onSelect }) => (
  <div>
    <label className="mono text-[11px] tracking-[0.18em] uppercase text-[#7c8699] mb-2 block">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`px-3.5 py-2 rounded-full text-[13px] border transition-all ${
            value === option
              ? "bg-[#0d2033] border-[#2e5a85] text-[#c7e5ff]"
              : "bg-transparent border-white/10 text-[#8591a6] hover:border-white/25 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

export default Contact;
