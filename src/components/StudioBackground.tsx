import React from "react";

export default function StudioBackground() {
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base Warm Sand Foundation (#D7C2AD) */}
      <div className="absolute inset-0 bg-[#D7C2AD]" />

      {/* Ultra-High-Definition Master Studio Backdrop (Sun Disk + Palm Leaf Shadows) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/studio_master_backdrop.jpg"
        alt=""
        className="w-full h-full object-cover object-center opacity-100 block"
        loading="eager"
      />
    </div>
  );
}

