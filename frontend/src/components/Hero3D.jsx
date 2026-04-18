import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Floating 3D Particles: Code symbols, brackets, tech icons
// Slow movement through space with parallax, subtle rotation, cyan/blue glow
const Hero3D = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <motion.div style={{ opacity }} className="absolute inset-0">
        {/* Floating particles */}
        <FloatingParticles scrollYProgress={scrollYProgress} />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(34,211,238,0.08) 0%, rgba(14,165,233,0.04) 50%, transparent 80%)",
          }}
        />
      </motion.div>
    </div>
  );
};

// ============ Floating Particles Component ============
const FloatingParticles = ({ scrollYProgress }) => {
  // Generate random particles with different types
  const particles = useMemo(() => {
    const codeSymbols = [
      "{", "}", "[", "]", "<", ">", "(", ")",
      "const", "let", "async", "await", "=>", 
      "function", "return", "import", "export",
      "class", "interface", "type", "void",
      "if", "for", "map", "filter",
    ];

    const techSymbols = [
      "⚛", // React-like
      "◆", // Database
      "⬡", // Hexagon (API)
      "▲", // Triangle (Vercel-like)
      "●", // Circle
      "■", // Square
      "◇", // Diamond
    ];

    const allSymbols = [...codeSymbols, ...techSymbols];
    const particleCount = 40;
    
    return Array.from({ length: particleCount }, (_, i) => {
      const isTechSymbol = Math.random() > 0.7;
      const symbol = isTechSymbol
        ? techSymbols[Math.floor(Math.random() * techSymbols.length)]
        : codeSymbols[Math.floor(Math.random() * codeSymbols.length)];

      return {
        id: i,
        symbol,
        isTechSymbol,
        // Random position
        x: Math.random() * 100, // percentage
        y: Math.random() * 100,
        // Random depth (z-index simulation)
        z: Math.random() * 300 - 150, // -150 to 150
        // Random scale based on depth
        scale: 0.4 + Math.random() * 0.8,
        // Random animation duration
        duration: 20 + Math.random() * 20,
        // Random delay
        delay: Math.random() * 5,
        // Random rotation speed
        rotationDuration: 15 + Math.random() * 25,
      };
    });
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <FloatingParticle
          key={particle.id}
          particle={particle}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </>
  );
};

// ============ Individual Floating Particle ============
const FloatingParticle = ({ particle, scrollYProgress }) => {
  // Parallax movement based on depth
  const parallaxFactor = particle.z / 300; // -0.5 to 0.5
  const yParallax = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100 * parallaxFactor]
  );

  // Color based on type and depth
  const baseColor = particle.isTechSymbol
    ? "rgba(34, 211, 238, 0.9)" // Cyan for tech symbols
    : "rgba(124, 200, 255, 0.85)"; // Light blue for code

  const glowIntensity = particle.z > 0 ? 0.8 : 0.5; // Closer = brighter
  const fontSize = particle.isTechSymbol ? 24 : 14;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: particle.delay }}
      style={{
        position: "absolute",
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        y: yParallax,
        transform: `translateZ(${particle.z}px) scale(${particle.scale})`,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          rotateZ: [0, 360],
        }}
        transition={{
          y: {
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          },
          x: {
            duration: particle.duration * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotateZ: {
            duration: particle.rotationDuration,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        className="mono"
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: particle.isTechSymbol ? "400" : "600",
          color: baseColor,
          textShadow: `
            0 0 ${20 * glowIntensity}px ${baseColor},
            0 0 ${40 * glowIntensity}px ${baseColor},
            0 0 ${60 * glowIntensity}px rgba(34, 211, 238, ${0.3 * glowIntensity})
          `,
          filter: `blur(${particle.z < -50 ? 0.5 : 0}px)`, // Slight blur for far particles
          opacity: particle.z < -100 ? 0.4 : particle.z > 100 ? 1 : 0.7,
        }}
      >
        {particle.symbol}
      </motion.div>
    </motion.div>
  );
};

export default Hero3D;
