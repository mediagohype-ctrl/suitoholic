"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Paths are traced at half the source dimensions. The fabric color key protects
// skin, buttons and the neutral yarn inside the garment silhouette.
export const wovenStripePortraits = [
  { src: "/products/forest-green-bengal-model-studio.webp", label: "Seated studio model", width: 1170, height: 1345, yarnLight: 60,
    shirt: "M250 131Q271 155 288 156Q317 149 328 124L341 139Q401 154 422 180Q437 207 435 260Q437 313 410 345L343 396L319 423L291 406L341 358L247 358L245 398L216 414Q191 394 183 339L181 292L186 210Q184 177 226 159L264 144Z" },
  { src: "/products/forest-green-bengal-model-armchair.webp", label: "Model seated in an armchair", width: 1050, height: 1440, yarnLight: 74,
    shirt: "M244 205L268 210Q285 219 307 173L322 184Q368 192 392 210Q418 230 415 276L413 363L391 391L349 363L291 375L234 370L202 373Q191 348 157 360L149 381L146 358Q151 331 176 300L189 251Q201 221 244 205Z" },
  { src: "/products/forest-green-bengal-model-garden.webp", label: "Model at a garden event", width: 1063, height: 1440, yarnLight: 68,
    shirt: "M238 237Q228 290 256 322L280 303L310 231Q324 252 367 264Q411 276 418 328L421 397Q433 450 423 472L395 532L344 508L336 502L180 502L174 487L135 490Q130 478 139 444L149 390L146 325Q146 290 164 275L213 252Z" },
  { src: "/products/forest-green-bengal-model-short-sleeve.webp", label: "Standing model in a short-sleeve shirt", width: 1067, height: 1440, yarnLight: 67,
    shirt: "M236 202L238 251L265 301L301 250L307 193Q327 213 356 223Q425 244 438 290L466 393L394 414L382 384L372 504Q337 516 264 503L162 485Q177 463 178 409L111 399L126 341L134 283Q139 259 178 244L213 225Z" },
] as const;

type Portrait = (typeof wovenStripePortraits)[number];
type WovenYarn = { weights: Uint8Array; dyeLight: Uint8Array; whiteLight: Uint8Array };
const wovenSources = new Map<string, Promise<WovenYarn>>();
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const yarnNeighbors = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1]];
const yarnSampleDistances = [5, 10, 15];

function getWovenYarn(photo: Portrait) {
  const cached = wovenSources.get(photo.src);
  if (cached) return cached;
  const source = (async () => {
    const image = new window.Image();
    image.src = photo.src;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = photo.width;
    canvas.height = photo.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw Error("Canvas unavailable");
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, photo.width, photo.height);
    context.clearRect(0, 0, photo.width, photo.height);
    context.scale(2, 2);
    context.fill(new Path2D(photo.shirt));
    const mask = context.getImageData(0, 0, photo.width, photo.height).data;
    const weights = new Uint8Array(photo.width * photo.height);
    const dyeLight = new Uint8Array(weights.length);
    const whiteLight = new Uint8Array(weights.length);
    const light = new Uint8Array(weights.length);
    const green = new Uint8Array(weights.length);
    for (let i = 0; i < mask.length; i += 4) {
      if (!mask[i + 3]) continue;
      const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2];
      light[i / 4] = Math.round(.213 * r + .715 * g + .072 * b);
      green[i / 4] = Math.max(0, g - r);
    }
    for (let pixel = 0; pixel < weights.length; pixel++) {
      const i = pixel * 4;
      if (!mask[i + 3]) continue;
      const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2];
      // Warm pixels are skin or reflected light from the surroundings.
      if (r - g > 13 && r - b > 19) continue;
      const chroma = clamp((green[pixel] - 2) / Math.max(5, light[pixel] * .13));
      let dark = chroma > .75 ? light[pixel] : 255;
      let white = light[pixel];
      const x = pixel % photo.width;
      const y = Math.floor(pixel / photo.width);
      for (const [dx, dy] of yarnNeighbors) {
        for (const distance of yarnSampleDistances) {
          const nx = x + dx * distance, ny = y + dy * distance;
          if (nx < 0 || nx >= photo.width || ny < 0 || ny >= photo.height) continue;
          const neighbor = ny * photo.width + nx;
          if (mask[neighbor * 4 + 3] < 245) continue;
          if (green[neighbor] >= Math.max(6, light[neighbor] * .12)) dark = Math.min(dark, light[neighbor]);
          if (green[neighbor] <= 7) white = Math.max(white, light[neighbor]);
        }
      }
      const contrast = white - dark;
      const tone = contrast > 22 ? clamp((white - light[pixel]) / contrast) : 0;
      const coverage = Math.max(chroma, tone * clamp((green[pixel] + 1) / 6));
      weights[pixel] = Math.round(mask[i + 3] * coverage);
      dyeLight[pixel] = chroma > .75 || dark === 255 ? light[pixel] : Math.min(light[pixel], dark + 8);
      whiteLight[pixel] = white;
    }
    return { weights, dyeLight, whiteLight };
  })();
  wovenSources.set(photo.src, source);
  void source.catch(() => wovenSources.delete(photo.src));
  return source;
}

export default function WovenStripePortrait({ photo, color, alt, thumbnail = false }: {
  photo: Portrait;
  color?: string;
  alt: string;
  thumbnail?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context || !color) return;
    let active = true;
    const digits = color.slice(1);
    const hex = digits.length === 3 ? digits.replace(/./g, digit => digit + digit) : digits;
    const yarn = [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
    void getWovenYarn(photo).then(({ weights, dyeLight, whiteLight }) => {
      if (!active) return;
      const layer = context.createImageData(photo.width, photo.height);
      const max = Math.max(...yarn);
      const headroom = Math.max(12, 255 - max);
      const pale = clamp((Math.min(...yarn) - 105) / 90);
      for (let pixel = 0; pixel < weights.length; pixel++) {
        if (!weights[pixel]) continue;
        const i = pixel * 4;
        const dyeShade = dyeLight[pixel] / photo.yarnLight;
        const whiteShade = whiteLight[pixel] / 185;
        const shade = dyeShade + pale * .8 * (whiteShade - dyeShade);
        const shadow = Math.min(1, shade ** .85);
        const highlight = headroom * -Math.expm1(-Math.max(0, shade - 1) * 52 / headroom);
        for (let channel = 0; channel < 3; channel++) {
          layer.data[i + channel] = yarn[channel] * shadow + highlight;
        }
        layer.data[i + 3] = weights[pixel];
      }
      context.putImageData(layer, 0, 0);
    }).catch(() => {});
    return () => { active = false; };
  }, [color, photo]);

  return (
    <div className={thumbnail ? "relative mx-auto flex h-full items-center [container-type:size]" : "relative max-w-full"}>
      <div className="relative mx-auto"
        style={thumbnail ? { width: `min(100%, ${photo.width / photo.height * 100}cqh)` } : undefined}>
        <Image src={photo.src} alt={alt} width={photo.width} height={photo.height} unoptimized
          loading={thumbnail ? "lazy" : "eager"}
          className={thumbnail ? "block h-auto w-full" : "block h-auto max-h-[min(82svh,820px)] w-auto max-w-full"} />
        <canvas ref={canvas} aria-hidden="true" data-woven-yarn={color} width={photo.width} height={photo.height}
          className="pointer-events-none absolute inset-0 size-full" />
      </div>
    </div>
  );
}
