import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Audience from "./components/Audience";
import Services from "./components/Services";
import AutomationBlueprint from "./components/AutomationBlueprint";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import WhyMe from "./components/WhyMe";
import Process from "./components/Process";
import ContactCTA from "./components/ContactCTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { ImprintPage, PrivacyPage } from "./components/LegalPage";
import ScrollProgress from "./components/ScrollProgress";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "./components/ui/toaster";

const Home = () => {
  return (
    <div className="App">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Audience />
        <Services />
        <AutomationBlueprint />
        <TechStack />
        <Projects />
        <WhyMe />
        <Process />
        <ContactCTA />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/impressum" element={<ImprintPage />} />
          <Route path="/datenschutz" element={<PrivacyPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
