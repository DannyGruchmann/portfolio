import React, { useState } from "react";

const fallbackClassesBySize = {
  sm: "w-10 h-10 text-[14px]",
  md: "w-12 h-12 text-[15px]",
};

const imageClassesBySize = {
  sm: "h-10 w-auto max-w-[156px]",
  md: "h-12 w-auto max-w-[180px]",
};

const BrandLogo = ({ size = "sm", className = "", alt = "Danny Gruchmann logo" }) => {
  const [imageMissing, setImageMissing] = useState(false);

  if (!imageMissing) {
    return (
      <img
        src="/brand/dg-logo.png?v=2"
        alt={alt}
        className={`${imageClassesBySize[size] || imageClassesBySize.sm} ${className}`}
        onError={() => setImageMissing(true)}
      />
    );
  }

  return (
    <div
      className={`relative rounded-md border border-white/10 bg-gradient-to-br from-[#0b1622] to-[#07080c] overflow-hidden ${fallbackClassesBySize[size] || fallbackClassesBySize.sm} ${className}`}
      aria-label={alt}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,200,255,0.55),transparent_60%)]" />
      <div className="absolute inset-0 flex items-center justify-center mono font-semibold text-[#cfe8ff]">DG</div>
    </div>
  );
};

export default BrandLogo;
