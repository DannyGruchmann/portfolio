import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

// Interactive hologram scene with:
// - Hologram screen (floating code + wireframe shapes)
// - Two wireframe figures (man left, woman right)
// - Eye/head tracking following cursor
// - Click ripple effect on hologram
const Hero3D = () => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [clickPos, setClickPos] = useState(null);
  const [isHoverHologram, setIsHoverHologram] = useState(false);

  // Mouse tracking
  const handleMove = (e) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setMousePos({ x, y });

    // Check if hovering hologram screen (center area)
    const centerX = r.width / 2;
    const centerY = r.height / 2;
    const distX = Math.abs(e.clientX - r.left - centerX);
    const distY = Math.abs(e.clientY - r.top - centerY);
    setIsHoverHologram(distX < 200 && distY < 180);
  };

  const handleClick = (e) => {
    if (!isHoverHologram) return;
    const r = containerRef.current.getBoundingClientRect();
    setClickPos({
      x: e.clientX - r.left,
      y: e.clientY - r.top,
    });
    setTimeout(() => setClickPos(null), 1200);
  };

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onClick={handleClick}
      className="absolute inset-0 pointer-events-none"
      style={{ perspective: "1600px" }}
    >
      <motion.div style={{ opacity }} className="absolute inset-0">
        {/* Hologram Screen (center-back) */}
        <HologramScreen clickPos={clickPos} />

        {/* Wireframe Figures */}
        <WireframeFigures mousePos={mousePos} isHoverHologram={isHoverHologram} />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 45%, rgba(34,211,238,0.08) 0%, transparent 60%)",
          }}
        />
      </motion.div>
    </div>
  );
};

// ============ Hologram Screen Component ============
const HologramScreen = ({ clickPos }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[420px] hidden md:block"
      style={{
        transform: "translateX(-50%) translateY(-50%) translateZ(-80px) rotateY(-8deg)",
      }}
    >
      {/* Screen frame */}
      <div className="relative w-full h-full rounded-2xl border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-950/20 to-blue-950/10 backdrop-blur-sm overflow-hidden">
        {/* Scan lines */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.1) 2px, rgba(34,211,238,0.1) 4px)",
          }}
        />

        {/* Floating code snippets */}
        <div className="absolute inset-0 p-6 font-mono text-xs text-cyan-300/70 overflow-hidden">
          <FloatingCode />
        </div>

        {/* Wireframe shapes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 360" preserveAspectRatio="none">
          <WireframeShapes />
        </svg>

        {/* Ripple effect on click */}
        {clickPos && <RippleEffect x={clickPos.x} y={clickPos.y} />}

        {/* Corner accents */}
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
          <div
            key={pos}
            className={`absolute w-4 h-4 border-cyan-400 ${
              pos.includes("top") ? "top-2" : "bottom-2"
            } ${pos.includes("left") ? "left-2 border-l-2 border-t-2" : "right-2 border-r-2 border-t-2"} ${
              pos.includes("bottom") ? "border-t-0 border-b-2" : ""
            }`}
          />
        ))}

        {/* Glow effect */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 60px rgba(34,211,238,0.3), 0 0 80px rgba(34,211,238,0.2)",
          }}
        />
      </div>
    </motion.div>
  );
};

// ============ Floating Code Component ============
const FloatingCode = () => {
  const codeLines = [
    "const build = async () => {",
    "  await deploy();",
    "  return success;",
    "};",
    "",
    "interface User {",
    "  id: string;",
    "  role: Role;",
    "}",
  ];

  return (
    <div className="space-y-1">
      {codeLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
};

// ============ Wireframe Shapes Component ============
const WireframeShapes = () => {
  return (
    <g>
      {/* Rotating cube wireframe */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "300px 100px" }}
      >
        <path
          d="M 280,80 L 320,80 L 320,120 L 280,120 Z"
          fill="none"
          stroke="rgba(34,211,238,0.4)"
          strokeWidth="1.5"
        />
        <path
          d="M 290,90 L 330,90 L 330,130 L 290,130 Z"
          fill="none"
          stroke="rgba(34,211,238,0.3)"
          strokeWidth="1.5"
        />
        <path d="M 280,80 L 290,90 M 320,80 L 330,90 M 320,120 L 330,130 M 280,120 L 290,130" stroke="rgba(34,211,238,0.3)" strokeWidth="1.5" />
      </motion.g>

      {/* Floating sphere grid */}
      <motion.circle
        cx="100"
        cy="280"
        r="30"
        fill="none"
        stroke="rgba(34,211,238,0.35)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </g>
  );
};

// ============ Ripple Effect Component ============
const RippleEffect = ({ x, y }) => {
  return (
    <motion.div
      className="absolute rounded-full border-2 border-cyan-300"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ width: 0, height: 0, opacity: 1 }}
      animate={{ width: 300, height: 300, opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
};

// ============ Wireframe Figures Component ============
const WireframeFigures = ({ mousePos, isHoverHologram }) => {
  // Calculate rotation angles based on mouse position
  const getRotation = (baseX, baseY) => {
    const dx = mousePos.x - baseX;
    const dy = mousePos.y - baseY;
    const angle = Math.atan2(dy, dx);
    const headRotate = angle * (180 / Math.PI) - 90;
    const bodyRotate = headRotate * 0.3; // Body rotates less than head
    return { headRotate, bodyRotate };
  };

  return (
    <>
      {/* Man (left) */}
      <WireframeFigure
        position="left"
        gender="male"
        mousePos={mousePos}
        rotation={getRotation(0.25, 0.5)}
        isPointing={isHoverHologram}
      />

      {/* Woman (right) */}
      <WireframeFigure
        position="right"
        gender="female"
        mousePos={mousePos}
        rotation={getRotation(0.75, 0.5)}
        isPointing={false}
      />
    </>
  );
};

// ============ Individual Wireframe Figure ============
const WireframeFigure = ({ position, gender, rotation, isPointing }) => {
  const positionStyles = {
    left: "left-[8%] bottom-[8%]",
    right: "right-[8%] bottom-[8%]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: position === "left" ? 0.6 : 0.8 }}
      className={`absolute ${positionStyles[position]} hidden md:block`}
    >
      <svg
        width="220"
        height="380"
        viewBox="0 0 180 320"
        className="drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]"
        style={{
          filter: "drop-shadow(0 0 30px rgba(34,211,238,0.6)) drop-shadow(0 0 10px rgba(34,211,238,0.8))",
        }}
      >
        <g
          style={{
            transform: `rotate(${rotation.bodyRotate * 0.5}deg)`,
            transformOrigin: "90px 160px",
            transition: "transform 0.3s ease-out",
          }}
        >
          {/* Body */}
          <WireframeBody />

          {/* Head (rotates more) */}
          <g
            style={{
              transform: `rotate(${rotation.headRotate * 0.8}deg)`,
              transformOrigin: "90px 50px",
              transition: "transform 0.3s ease-out",
            }}
          >
            <WireframeHead gender={gender} />
          </g>

          {/* Arms (left arm points if hovering hologram) */}
          <WireframeArms isPointing={isPointing} position={position} />
        </g>
      </svg>
    </motion.div>
  );
};

// ============ Wireframe Body Parts ============
const WireframeHead = ({ gender }) => (
  <g>
    {/* Head ellipse */}
    <ellipse cx="90" cy="50" rx="25" ry="30" fill="none" stroke="rgba(34,211,238,0.8)" strokeWidth="2" />
    {/* Grid pattern on head */}
    <path
      d="M 65,40 Q 90,40 115,40 M 65,50 Q 90,50 115,50 M 65,60 Q 90,60 115,60"
      stroke="rgba(34,211,238,0.4)"
      strokeWidth="1"
      fill="none"
    />
    <path d="M 80,25 L 80,75 M 90,25 L 90,75 M 100,25 L 100,75" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
    
    {/* Eyes */}
    <circle cx="80" cy="48" r="3" fill="rgba(34,211,238,0.8)" />
    <circle cx="100" cy="48" r="3" fill="rgba(34,211,238,0.8)" />

    {/* Long hair for female */}
    {gender === "female" && (
      <>
        {/* Left hair strands */}
        <path
          d="M 65,55 Q 55,75 58,105 L 60,120"
          stroke="rgba(34,211,238,0.7)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 70,60 Q 65,80 68,105 L 70,115"
          stroke="rgba(34,211,238,0.6)"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Right hair strands */}
        <path
          d="M 115,55 Q 125,75 122,105 L 120,120"
          stroke="rgba(34,211,238,0.7)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 110,60 Q 115,80 112,105 L 110,115"
          stroke="rgba(34,211,238,0.6)"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Back hair volume */}
        <path
          d="M 75,65 Q 90,75 105,65"
          stroke="rgba(34,211,238,0.5)"
          strokeWidth="1.5"
          fill="none"
        />
      </>
    )}
  </g>
);

const WireframeBody = () => (
  <g>
    {/* Neck */}
    <line x1="85" y1="80" x2="85" y2="95" stroke="rgba(34,211,238,0.8)" strokeWidth="2" />
    <line x1="95" y1="80" x2="95" y2="95" stroke="rgba(34,211,238,0.8)" strokeWidth="2" />

    {/* Torso wireframe */}
    <path
      d="M 70,95 L 110,95 L 105,180 L 75,180 Z"
      fill="none"
      stroke="rgba(34,211,238,0.8)"
      strokeWidth="2"
    />
    {/* Torso grid */}
    <path d="M 75,110 L 105,110 M 75,130 L 105,130 M 75,150 L 105,150" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
    <path d="M 80,95 L 78,180 M 90,95 L 90,180 M 100,95 L 102,180" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />

    {/* Legs */}
    <path d="M 80,180 L 75,260 L 70,280" stroke="rgba(34,211,238,0.8)" strokeWidth="2" fill="none" />
    <path d="M 100,180 L 105,260 L 110,280" stroke="rgba(34,211,238,0.8)" strokeWidth="2" fill="none" />
    
    {/* Leg grid */}
    <path d="M 78,200 L 72,200 M 77,220 L 72,220 M 76,240 L 71,240" stroke="rgba(34,211,238,0.35)" strokeWidth="0.8" />
    <path d="M 102,200 L 107,200 M 103,220 L 107,220 M 104,240 L 108,240" stroke="rgba(34,211,238,0.35)" strokeWidth="0.8" />

    {/* Feet */}
    <ellipse cx="70" cy="285" rx="8" ry="4" fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" />
    <ellipse cx="110" cy="285" rx="8" ry="4" fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" />
  </g>
);

const WireframeArms = ({ isPointing, position }) => (
  <g>
    {/* Left arm (crosses arms or points) */}
    {isPointing && position === "left" ? (
      <motion.g
        initial={{ rotate: 0 }}
        animate={{ rotate: -45 }}
        transition={{ duration: 0.4 }}
        style={{ transformOrigin: "70px 110px" }}
      >
        <path d="M 70,110 L 50,140 L 30,150" stroke="rgba(34,211,238,0.8)" strokeWidth="2" fill="none" />
        <circle cx="30" cy="150" r="4" fill="rgba(34,211,238,0.9)" />
      </motion.g>
    ) : (
      <path d="M 70,110 L 85,130 L 90,145" stroke="rgba(34,211,238,0.8)" strokeWidth="2" fill="none" />
    )}

    {/* Right arm (always crossed) */}
    <path d="M 110,110 L 95,130 L 90,145" stroke="rgba(34,211,238,0.8)" strokeWidth="2" fill="none" />

    {/* Hand markers */}
    <circle cx="90" cy="145" r="3" fill="rgba(34,211,238,0.8)" />
    {!isPointing || position !== "left" ? (
      <circle cx="90" cy="145" r="3" fill="rgba(34,211,238,0.8)" />
    ) : null}
  </g>
);

export default Hero3D;
