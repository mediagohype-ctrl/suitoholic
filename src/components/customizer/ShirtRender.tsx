"use client";

import React, { useEffect, useState } from "react";
import { collarKind, cuffKind } from "./StyleIllustrations";

/**
 * Flat-lay shirt drawing used for the collar/cuff/monogram and review steps.
 * Every selection redraws part of the shirt: collar shape, sleeve length, cuff type,
 * chest pocket, fit width, length and the embroidered initials in the thread colour.
 * The fabric colour is sampled from the product photo.
 */

export interface ShirtRenderProps {
  fabricSrc?: string;
  bodyFit: "lean" | "regular" | "tummy";
  heightScale?: number;
  sleeve: "full" | "half";
  collarStyle: string;
  cuffStyle: string;
  pocket?: boolean;
  initials?: string;
  threadHex?: string;
  className?: string;
}

type RGB = { r: number; g: number; b: number };
const FALLBACK: RGB = { r: 244, g: 241, b: 236 };

/** Average colour of an image (the product photo), used as the shirt's fabric colour. */
function useFabricColor(src?: string): RGB {
  const [color, setColor] = useState<RGB>(FALLBACK);
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 24;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
        }
        if (!cancelled && n) setColor({ r: r / n, g: g / n, b: b / n });
      } catch {
        /* cross-origin image: keep the fallback colour */
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);
  return color;
}

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
const mix = (c: RGB, target: number, amount: number): string =>
  `rgb(${clamp(c.r + (target - c.r) * amount)}, ${clamp(c.g + (target - c.g) * amount)}, ${clamp(c.b + (target - c.b) * amount)})`;

export default function ShirtRender({
  fabricSrc,
  bodyFit,
  heightScale = 1,
  sleeve,
  collarStyle,
  cuffStyle,
  pocket = true,
  initials = "",
  threadHex = "#14110E",
  className = "",
}: ShirtRenderProps) {
  const base = useFabricColor(fabricSrc);
  const luminance = (0.299 * base.r + 0.587 * base.g + 0.114 * base.b) / 255;
  const fabric = mix(base, 255, 0.08);
  const fabricLight = mix(base, 255, luminance > 0.8 ? 0.4 : 0.22);
  const fabricDark = mix(base, 0, 0.14);
  const outline = mix(base, 0, luminance > 0.75 ? 0.35 : 0.45);
  const buttonFill = luminance > 0.6 ? "#F5F0E8" : "#E9E2D6";

  const fitX = { lean: 0.94, regular: 1, tummy: 1.07 }[bodyFit];
  const half = sleeve === "half";
  const collar = collarKind(collarStyle || "spread");
  const cuff = cuffKind(cuffStyle || "classic");

  // Sleeves hang straight down beside the torso; x position of each edge at a given y.
  const sleeveBottom = half ? 262 : 400;
  const leftOuter = (y: number) => 42 - 12 * ((y - 140) / 260);
  const leftInner = (y: number) => 100 - 8 * ((y - 118) / 282);
  const mirror = (x: number) => 400 - x;

  const sleevePath = (side: "L" | "R") => {
    const o = (y: number) => (side === "L" ? leftOuter(y) : mirror(leftOuter(y)));
    const i = (y: number) => (side === "L" ? leftInner(y) : mirror(leftInner(y)));
    return `M ${i(118)} 118 L ${o(140)} 140 L ${o(sleeveBottom)} ${sleeveBottom} L ${i(sleeveBottom)} ${sleeveBottom} L ${i(215)} 215 Z`;
  };

  const cuffShapes = (side: "L" | "R") => {
    const o = (y: number) => (side === "L" ? leftOuter(y) : mirror(leftOuter(y)));
    const i = (y: number) => (side === "L" ? leftInner(y) : mirror(leftInner(y)));
    const band = (y1: number, y2: number, rx = 0) => {
      const x1 = Math.min(o(y1), i(y1));
      const x2 = Math.max(o(y1), i(y1));
      return <rect key={`${side}${y1}`} x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx={rx} fill={fabricLight} stroke={outline} strokeWidth={1.6} />;
    };
    const buttonX = side === "L" ? i(380) - 14 : i(380) + 14;
    if (half) {
      return <g>{band(236, 262)}</g>;
    }
    if (cuff === "french") {
      const cx = (o(382) + i(382)) / 2;
      return (
        <g>
          {band(342, 372)}
          {band(370, 400)}
          <line x1={o(371)} y1={371} x2={i(371)} y2={371} stroke={outline} strokeWidth={1.2} strokeDasharray="3 3" />
          <rect x={cx - 7} y={379} width={14} height={12} rx={2} fill="#C9C2B6" stroke={outline} strokeWidth={1.2} />
          <line x1={cx - 3} y1={385} x2={cx + 3} y2={385} stroke={outline} strokeWidth={1.2} />
        </g>
      );
    }
    if (cuff === "rounded") {
      return (
        <g>
          {band(366, 400, 11)}
          <circle cx={buttonX} cy={384} r={3.4} fill={buttonFill} stroke={outline} strokeWidth={1} />
        </g>
      );
    }
    return (
      <g>
        {band(366, 400)}
        <line x1={o(372)} y1={372} x2={i(372)} y2={372} stroke={outline} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
        <circle cx={buttonX} cy={384} r={3.4} fill={buttonFill} stroke={outline} strokeWidth={1} />
      </g>
    );
  };

  const collarPoints = (() => {
    switch (collar) {
      case "cutaway":
        return { left: "M 196 124 L 108 150 L 158 98 Z", right: "M 204 124 L 292 150 L 242 98 Z" };
      case "buttonDown":
        return { left: "M 196 124 L 170 194 L 158 98 Z", right: "M 204 124 L 230 194 L 242 98 Z" };
      case "band":
        return null;
      default:
        return { left: "M 196 124 L 134 182 L 158 98 Z", right: "M 204 124 L 266 182 L 242 98 Z" };
    }
  })();

  const monogramY = pocket ? 300 : 232;
  const text = initials.trim().toUpperCase();

  return (
    <svg viewBox="0 0 400 480" className={className} role="img" aria-label="Preview of your bespoke shirt">
      <defs>
        <linearGradient id="shirtShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.13" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
        <filter id="shirtShadow" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#14110E" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter="url(#shirtShadow)" transform={`translate(200 270) scale(${fitX} ${heightScale}) translate(-200 -270)`}>
        {/* Sleeves */}
        {(["L", "R"] as const).map((side) => (
          <g key={side}>
            <path d={sleevePath(side)} fill={fabric} stroke={outline} strokeWidth={1.8} strokeLinejoin="round" />
            <path d={sleevePath(side)} fill="url(#shirtShade)" />
            {cuffShapes(side)}
          </g>
        ))}

        {/* Torso */}
        <path
          d="M 100 118 C 130 102, 168 96, 196 124 L 204 124 C 232 96, 270 102, 300 118 L 312 215 L 306 438 Q 200 462 94 438 L 88 215 Z"
          fill={fabric}
          stroke={outline}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <path d="M 100 118 C 130 102, 168 96, 196 124 L 204 124 C 232 96, 270 102, 300 118 L 312 215 L 306 438 Q 200 462 94 438 L 88 215 Z" fill="url(#shirtShade)" />
        {/* yoke seam */}
        <path d="M 104 136 Q 200 150 296 136" fill="none" stroke={outline} strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />

        {/* Placket & buttons */}
        <rect x={190} y={120} width={20} height={322} fill={fabricLight} stroke={outline} strokeWidth={1.2} opacity={0.95} />
        {[160, 210, 260, 310, 360, 410].map((y) => (
          <circle key={y} cx={200} cy={y} r={4} fill={buttonFill} stroke={outline} strokeWidth={1} />
        ))}

        {/* Chest pocket */}
        {pocket && (
          <g>
            <path d="M 118 186 h 52 v 60 q -26 12 -52 0 z" fill={fabric} stroke={outline} strokeWidth={1.4} strokeLinejoin="round" />
            <path d="M 118 186 h 52 v 60 q -26 12 -52 0 z" fill="url(#shirtShade)" />
            <line x1={118} y1={196} x2={170} y2={196} stroke={outline} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
          </g>
        )}

        {/* Collar stand + points */}
        <path d="M 150 100 Q 200 80 250 100 L 246 118 Q 200 100 154 118 Z" fill={fabricLight} stroke={outline} strokeWidth={1.6} strokeLinejoin="round" />
        {collarPoints ? (
          <g>
            <path d={collarPoints.left} fill={fabricLight} stroke={outline} strokeWidth={1.6} strokeLinejoin="round" />
            <path d={collarPoints.right} fill={fabricLight} stroke={outline} strokeWidth={1.6} strokeLinejoin="round" />
            {collar === "buttonDown" && (
              <>
                <circle cx={171} cy={190} r={3} fill={buttonFill} stroke={outline} strokeWidth={1} />
                <circle cx={229} cy={190} r={3} fill={buttonFill} stroke={outline} strokeWidth={1} />
              </>
            )}
          </g>
        ) : (
          <path d="M 146 92 Q 200 70 254 92 L 250 110 Q 200 90 150 110 Z" fill={fabricLight} stroke={outline} strokeWidth={1.6} strokeLinejoin="round" />
        )}
        <circle cx={200} cy={108} r={3.6} fill={buttonFill} stroke={outline} strokeWidth={1} />

        {/* Embroidered monogram */}
        {text && (
          <text
            x={144}
            y={monogramY}
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontStyle="italic"
            fontWeight={600}
            fontSize={26}
            letterSpacing={2}
            fill={threadHex}
            stroke={fabricDark}
            strokeWidth={0.3}
          >
            {text}
          </text>
        )}
      </g>
    </svg>
  );
}
