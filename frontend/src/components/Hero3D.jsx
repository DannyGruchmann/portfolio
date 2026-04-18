import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// DNA/Helix structure made of code lines
// Continuous rotation, data flow particles, elegant and futuristic
const Hero3D = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end start"] 
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ perspective: "1600px" }}
    >
      <motion.div 
        style={{ opacity, scale }} 
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Main DNA Helix Structure */}
        <DNAHelix />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.08) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
};

// ============ DNA Helix Component ============
const DNAHelix = () => {
  // Generate helix points (double strand)
  const numPoints = 24;
  const points1 = [];
  const points2 = [];
  const connections = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 4; // 2 full rotations
    const y = (i / numPoints) * 600 - 100; // Vertical distribution
    const radius = 140;

    // First strand
    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    points1.push({ x: x1, y, z: z1, angle, index: i });

    // Second strand (180° offset)
    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;
    points2.push({ x: x2, y, z: z2, angle: angle + Math.PI, index: i });

    // Every 3rd point has a connection (like DNA base pairs)
    if (i % 3 === 0) {
      connections.push({ p1: { x: x1, y, z: z1 }, p2: { x: x2, y, z: z2 }, index: i });
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transformStyle: "preserve-3d",
          width: "600px",
          height: "600px",
          position: "relative",
        }}
      >
        {/* First helix strand */}
        {points1.map((point, i) => (
          <HelixNode
            key={`strand1-${i}`}
            point={point}
            delay={i * 0.05}
            strand={1}
          />
        ))}

        {/* Second helix strand */}
        {points2.map((point, i) => (
          <HelixNode
            key={`strand2-${i}`}
            point={point}
            delay={i * 0.05}
            strand={2}
          />
        ))}

        {/* Base pair connections */}
        {connections.map((conn, i) => (
          <BasePairConnection
            key={`connection-${i}`}
            p1={conn.p1}
            p2={conn.p2}
            delay={i * 0.15}
          />
        ))}

        {/* Flowing data particles */}
        <DataParticles points={points1} />
        <DataParticles points={points2} delay={1.5} />
      </motion.div>
    </div>
  );
};

// ============ Helix Node (Code snippet on each point) ============
const HelixNode = ({ point, delay, strand }) => {
  const codeSnippets = [
    "const", "async", "await", "=>", "function", "return", 
    "import", "export", "class", "interface", "type", "let",
    "if", "for", "map", "filter", "reduce", "promise"
  ];
  
  const snippet = codeSnippets[point.index % codeSnippets.length];
  const color = strand === 1 ? "rgba(34,211,238,0.9)" : "rgba(124,200,255,0.9)";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate3d(${point.x}px, ${point.y}px, ${point.z}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glowing sphere */}
      <div
        className="absolute"
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Code snippet label */}
      <div
        className="mono text-[9px] absolute whitespace-nowrap"
        style={{
          color,
          transform: "translate(-50%, 12px) rotateY(0deg)",
          textShadow: `0 0 10px ${color}`,
          fontWeight: "600",
          letterSpacing: "0.05em",
        }}
      >
        {snippet}
      </div>
    </motion.div>
  );
};

// ============ Base Pair Connection ============
const BasePairConnection = ({ p1, p2, delay }) => {
  // Calculate 2D projection for line
  const x1 = p1.x;
  const y1 = p1.y;
  const x2 = p2.x;
  const y2 = p2.y;

  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 0.4, scaleX: 1 }}
      transition={{ duration: 0.8, delay }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${length}px`,
        height: "1px",
        background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(124,200,255,0.6), rgba(34,211,238,0.6))",
        transform: `translate3d(${x1}px, ${y1}px, ${(p1.z + p2.z) / 2}px) rotate(${angle}deg)`,
        transformOrigin: "0 0",
        transformStyle: "preserve-3d",
        boxShadow: "0 0 10px rgba(34,211,238,0.5)",
      }}
    />
  );
};

// ============ Data Flow Particles ============
const DataParticles = ({ points, delay = 0 }) => {
  const particles = [0, 1, 2].map((i) => ({
    id: i,
    offset: (i / 3) * points.length,
  }));

  return (
    <>
      {particles.map((particle) => (
        <DataParticle
          key={particle.id}
          points={points}
          offset={particle.offset}
          delay={delay + particle.id * 0.5}
        />
      ))}
    </>
  );
};

const DataParticle = ({ points, offset, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transformStyle: "preserve-3d",
      }}
    >
      {points.map((point, i) => {
        const progress = ((i + offset) % points.length) / points.length;
        const isActive = progress > 0.45 && progress < 0.55; // Only show at specific position

        if (!isActive) return null;

        return (
          <motion.div
            key={i}
            animate={{
              x: [point.x, points[(i + 1) % points.length]?.x || point.x],
              y: [point.y, points[(i + 1) % points.length]?.y || point.y],
              z: [point.z, points[(i + 1) % points.length]?.z || point.z],
            }}
            transition={{
              duration: 0.5,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 20px rgba(34,211,238,1), 0 0 40px rgba(34,211,238,0.8)",
              transform: `translate3d(${point.x}px, ${point.y}px, ${point.z}px)`,
            }}
          />
        );
      })}
    </motion.div>
  );
};

export default Hero3D;
