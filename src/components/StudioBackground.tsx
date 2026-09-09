import React from "react";

export default function StudioBackground() {
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none bg-white"
      aria-hidden="true"
    >
      {/* Base White Canvas */}
      <div className="absolute inset-0 bg-white" />
    </div>
  );
}


