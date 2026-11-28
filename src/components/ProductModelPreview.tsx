import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { allProducts, type ProductItem } from "@/data/products";

const poses = [
  {
    label: "Seated studio model", width: 742, height: 852, fabricLight: 158,
    shirt: [
      [417, 152], [416, 164], [411, 176], [405, 184], [394, 192], [382, 198], [373, 201], [369, 211], [368, 215],
      [362, 203], [355, 199], [347, 196], [341, 190], [337, 183], [335, 177], [318, 190], [298, 199],
      [297, 201], [294, 201], [286, 207], [278, 209], [276, 212], [275, 211], [271, 215], [262, 219], [251, 229],
      [252, 230], [242, 250], [238, 270], [238, 319], [233, 344], [233, 391], [237, 388], [238, 389], [238, 393],
      [235, 396], [234, 406], [235, 414], [237, 412], [239, 413], [236, 418], [236, 431], [238, 436], [238, 443],
      [243, 457], [242, 458], [247, 469], [246, 476], [251, 480], [252, 486], [254, 488], [253, 489], [261, 497],
      [264, 507], [269, 516], [269, 520], [271, 522], [271, 518], [275, 515], [275, 512], [286, 500], [291, 498],
      [301, 498], [309, 502], [310, 499], [305, 483], [305, 470], [303, 466], [303, 456], [307, 450], [343, 450],
      [351, 447], [353, 450], [379, 450], [403, 453], [405, 456], [412, 457], [425, 456], [425, 463], [421, 468],
      [384, 502], [384, 506], [390, 507], [393, 511], [390, 515], [389, 514], [383, 518], [387, 517], [389, 514],
      [390, 515], [396, 512], [405, 522], [407, 521], [412, 526], [413, 531], [416, 535], [425, 526], [427, 526],
      [438, 517], [465, 502], [481, 486], [489, 484], [503, 469], [505, 470], [505, 465], [507, 462], [511, 460],
      [531, 437], [536, 410], [542, 389], [548, 343], [548, 323], [546, 315], [544, 284], [541, 275], [541, 266],
      [535, 240], [524, 219], [512, 208], [469, 186], [466, 186], [465, 184], [461, 184], [447, 176], [432, 171],
      [426, 166],
    ],
  },
  {
    label: "Model seated in an armchair", width: 620, height: 850, fabricLight: 151,
    shirt: [
      [476, 271], [467, 261], [463, 259], [464, 258], [437, 243], [432, 242], [424, 237], [410, 235], [383, 225],
      [370, 208], [369, 227], [365, 244], [358, 261], [353, 273], [348, 282], [345, 290], [343, 294],
      [340, 298], [336, 304], [333, 310], [330, 314], [327, 319], [325, 324], [323, 329],
      [321, 323], [319, 316], [316, 307], [313, 299], [308, 287],
      [303, 276], [298, 269], [293, 264], [289, 258], [285, 249], [273, 255], [266, 256], [248, 265],
      [239, 273], [232, 283], [219, 310],
      [219, 314], [215, 321], [215, 331], [210, 340], [211, 351], [209, 352], [210, 353], [208, 354], [209, 355],
      [206, 359], [202, 372], [203, 373], [199, 380], [195, 395], [193, 396], [193, 399], [188, 404], [186, 409],
      [181, 413], [179, 417], [180, 418], [176, 423], [175, 436], [172, 441], [172, 450], [174, 456], [180, 461],
      [178, 457], [180, 449], [180, 437], [183, 431], [190, 425], [200, 422], [216, 425], [226, 431], [237, 442],
      [238, 450], [239, 444], [244, 440], [251, 440], [280, 434], [287, 434], [290, 443], [304, 447], [319, 447],
      [328, 445], [354, 446], [355, 444], [373, 445], [375, 447], [387, 445], [398, 437], [419, 429], [427, 432],
      [455, 455], [460, 461], [462, 468], [473, 469], [475, 471], [480, 462], [486, 459], [493, 449], [493, 443],
      [482, 431], [488, 389], [488, 346], [491, 310], [487, 300], [485, 299], [483, 287],
    ],
  },
  {
    label: "Model at a garden event", width: 632, height: 857, fabricLight: 154,
    shirt: [
      [465, 357], [456, 347], [382, 301], [375, 292], [370, 282], [369, 289], [351, 318], [351, 321], [341, 329],
      [338, 340], [326, 353], [310, 379], [311, 382], [301, 393], [293, 406], [291, 384], [282, 345], [273, 326],
      [274, 312], [276, 308], [275, 298], [273, 296], [270, 298], [269, 297], [264, 304], [238, 317], [216, 325],
      [212, 329], [208, 329], [208, 331], [206, 330], [202, 332], [189, 350], [183, 372], [183, 428], [180, 456],
      [180, 474], [177, 492], [173, 498], [173, 508], [176, 511], [172, 515], [170, 520], [172, 525], [170, 528],
      [170, 533], [168, 535], [168, 547], [163, 554], [162, 571], [164, 579], [168, 581], [179, 577], [198, 577],
      [208, 580], [213, 587], [259, 598], [332, 596], [386, 597], [390, 595], [393, 597], [392, 594], [394, 593],
      [397, 603], [410, 600], [410, 604], [419, 606], [460, 629], [466, 628], [469, 622], [483, 606], [480, 600],
      [481, 595], [486, 590], [487, 585], [491, 583], [496, 577], [495, 569], [501, 554], [502, 546], [494, 469],
      [485, 420], [486, 403], [477, 380], [468, 367], [468, 363],
    ],
  },
  {
    label: "Standing model in a short-sleeve shirt", width: 617, height: 832, fabricLight: 165,
    shirt: [
      [472, 292], [417, 268], [379, 254], [359, 232], [361, 234], [361, 247], [351, 282], [341, 295], [341, 301],
      [316, 353], [312, 367], [309, 370], [288, 316], [277, 294], [269, 282], [268, 248], [256, 263], [248, 266],
      [240, 272], [208, 288], [179, 305], [168, 320], [158, 346], [152, 381], [150, 384], [144, 415], [130, 469],
      [163, 483], [187, 488], [202, 488], [206, 492], [204, 512], [208, 524], [209, 534], [188, 566], [212, 571],
      [219, 571], [236, 578], [266, 585], [277, 585], [282, 587], [319, 592], [383, 595], [422, 601], [426, 593],
      [442, 507], [442, 495], [434, 486], [436, 480], [436, 462], [438, 454], [443, 453], [445, 455], [452, 485],
      [459, 485], [476, 481], [538, 462], [513, 385], [507, 357], [499, 333], [490, 314],
    ],
  },
] as const;

export const productModelPhotos = poses.map(({ shirt, ...pose }, index) => ({
  ...pose,
  shirt,
  src: "/product-models/pose-" + (index + 1) + ".webp",
  clip: "polygon(" + shirt.map(([x, y]) => (x / pose.width * 100) + "% " + (y / pose.height * 100) + "%").join(",") + ")",
}));

type ModelPhoto = (typeof productModelPhotos)[number];

type FabricEdge = { cloth: number; background: number; coverage: number; confidence: number };
type ModelSource = { pixels: ImageData; mask: Uint8ClampedArray; edges: Map<number, FabricEdge> };
const modelSources = new Map<string, Promise<ModelSource>>();

// Unmix the original cloth and background at the source photograph's antialiased edge.
function sampleFabricEdges({ data, width, height }: ImageData, mask: Uint8ClampedArray) {
  const edges = new Map<number, FabricEdge>();
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
  for (let i = 0; i < mask.length; i += 4) {
    const coverage = mask[i + 3];
    if (coverage < 3 || coverage > 252) continue;
    const x = (i / 4) % width;
    const y = Math.floor(i / 4 / width);
    const clothSamples: number[] = [];
    const backgroundSamples: number[] = [];
    for (const [dx, dy] of directions) {
      for (let step = 1; step <= 9; step++) {
        const nx = x + dx * step;
        const ny = y + dy * step;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) break;
        const neighbor = (ny * width + nx) * 4;
        if (mask[neighbor + 3] > 252) {
          clothSamples.push(neighbor);
          break;
        }
        if (mask[neighbor + 3] < 3) {
          backgroundSamples.push(neighbor);
          break;
        }
      }
    }
    const geometry = coverage / 255;
    const distance = (offset: number) => {
      const pixel = offset / 4;
      return Math.abs(pixel % width - x) + Math.abs(Math.floor(pixel / width) - y);
    };
    let bestScore = Infinity;
    for (const cloth of clothSamples) {
      for (const background of backgroundSamples) {
        const dr = data[cloth] - data[background];
        const dg = data[cloth + 1] - data[background + 1];
        const db = data[cloth + 2] - data[background + 2];
        const r = data[i] - data[background];
        const g = data[i + 1] - data[background + 1];
        const b = data[i + 2] - data[background + 2];
        const contrast = dr * dr + dg * dg + db * db;
        if (contrast < 120) continue;
        const projected = unit((r * dr + g * dg + b * db) / contrast);
        const residual = (r - projected * dr) ** 2 + (g - projected * dg) ** 2 + (b - projected * db) ** 2;
        const score = residual + 2 * (distance(cloth) + distance(background)) + 140 * (projected - geometry) ** 2;
        if (score >= bestScore) continue;
        bestScore = score;
        const confidence = unit((contrast - 120) / 950) * unit(1 - residual / 700);
        edges.set(i, { cloth, background, coverage: (geometry + (projected - geometry) * confidence) * 255, confidence });
      }
    }
  }
  return edges;
}

function getModelSource(photo: ModelPhoto) {
  const cached = modelSources.get(photo.src);
  if (cached) return cached;

  const source = new Promise<ModelSource>((resolve, reject) => {
    const image = new window.Image();
    image.onerror = reject;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = photo.width;
      canvas.height = photo.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return reject();

      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, photo.width, photo.height);
      context.clearRect(0, 0, photo.width, photo.height);
      context.beginPath();
      photo.shirt.forEach(([x, y], index) => {
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.filter = "blur(1.5px)";
      context.fill();
      const mask = context.getImageData(0, 0, photo.width, photo.height).data;
      resolve({ pixels, mask, edges: sampleFabricEdges(pixels, mask) });
    };
    image.src = photo.src;
  });

  modelSources.set(photo.src, source);
  void source.catch(() => modelSources.delete(photo.src));
  return source;
}

const unit = (value: number) => Math.min(1, Math.max(0, value));

function fabricRGB(hex: string) {
  const digits = hex.slice(1);
  const full = digits.length === 3 ? digits.replace(/./g, (digit) => digit + digit) : digits;
  return [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16));
}

export function getModelStripeStyle(product: ProductItem) {
  const name = `${product.name} ${product.slug}`;
  if (/pinstripe|pin[ -]stripe/i.test(name)) return "pinstripe";
  if (/jacquard.*strip|strip.*jacquard/i.test(name)) return "jacquard";
  return /stripe|striped/i.test(name) ? "bengal" : undefined;
}

type ModelStripeStyle = ReturnType<typeof getModelStripeStyle>;

function FabricOnModel({ photo, color, fabric, stripeStyle, stripeColor }: {
  photo: ModelPhoto;
  color: string;
  fabric: string;
  stripeStyle?: ModelStripeStyle;
  stripeColor?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    let active = true;

    void getModelSource(photo).then(({ pixels, mask, edges }) => {
      if (!active) return;
      const layer = context.createImageData(photo.width, photo.height);
      const rgb = fabricRGB(color);
      const exposure = Math.min(1, 244 / Math.max(...rgb));
      const midtone = rgb.map(channel => channel * exposure);
      const headroom = 255 - Math.max(...midtone);
      const highlightStrength = Math.max(...midtone) * 0.29 + 45;
      const yarn = fabricRGB(stripeColor ?? "#f4f0ea").map(channel => channel * 0.95);
      const stripePeriod = photo.width * (stripeStyle === "pinstripe" ? 0.012 : 0.022);
      const stripeWidth = stripePeriod * (stripeStyle === "pinstripe" ? 0.17 : stripeStyle === "jacquard" ? 0.34 : 0.5);
      const yarnHeadroom = 255 - Math.max(...yarn);
      const yarnHighlightStrength = Math.max(...yarn) * 0.29 + 45;
      const darkFabric = unit((118 - Math.max(...midtone)) / 72);
      const isTwill = /twill/i.test(fabric);
      const isTextured = /linen|dobby|oxford/i.test(fabric);

      for (let i = 0; i < pixels.data.length; i += 4) {
        if (!mask[i + 3]) continue;
        const edge = edges.get(i);
        const sample = edge?.cloth ?? i;
        const [r, g, b] = [pixels.data[sample], pixels.data[sample + 1], pixels.data[sample + 2]];
        const light = 0.213 * r + 0.715 * g + 0.072 * b;
        const buttons = unit((light - 193) / 30) * unit((9 - Math.abs(r - b)) / 9);
        const alpha = (edge?.coverage ?? mask[i + 3]) * (1 - 0.85 * buttons);
        if (alpha < 1) continue;
        const recolorWeight = alpha / 255;
        // On dark cloth, a small remnant of the original light cloth reads as a pale rim.
        // Rebuild mixed pixels from the nearby background and the new cloth color.
        const spillCorrection = edge ? darkFabric * edge.confidence : 0;

        const x = (i / 4) % photo.width;
        const y = Math.floor(i / 4 / photo.width);
        const shade = light / photo.fabricLight;
        // Let the stripe direction follow the drape of the original shirt.
        const side = (x - photo.width / 2) / photo.width;
        const vertical = (y - photo.height * 0.37) / photo.height;
        const drape = y * 0.045 + side * vertical * 130 + (shade - 1) * 2.3;
        const stripeDistance = Math.abs(((x + drape) % stripePeriod + stripePeriod) % stripePeriod - stripePeriod / 2);
        const yarnWeight = stripeStyle ? unit(stripeWidth / 2 + 0.5 - stripeDistance) : 0;
        const weave = isTwill
          ? 1.6 * Math.sin(x * 1.56 + y * 1.22) + 0.55 * Math.cos(y * 2.2 - x * 0.38)
          : (isTextured ? 2.1 : 0.75) * Math.sin(x * 1.7) * Math.sin(y * 2.1);
        // Roll off bright folds to preserve detail on white and near-white shirts.
        const highlight = headroom * -Math.expm1(-Math.max(0, shade - 1) * highlightStrength / headroom);
        const yarnHighlight = yarnWeight ? yarnHeadroom * -Math.expm1(-Math.max(0, shade - 1) * yarnHighlightStrength / yarnHeadroom) : 0;
        for (let channel = 0; channel < 3; channel++) {
          const base = midtone[channel] + (yarn[channel] - midtone[channel]) * yarnWeight;
          const lit = shade < 1 ? base * shade ** 1.35 : base + highlight + (yarnHighlight - highlight) * yarnWeight;
          const recolored = lit + weave * Math.min(1, shade);
          const original = pixels.data[i + channel];
          const corrected = original + (recolored - pixels.data[sample + channel]) * recolorWeight;
          const background = edge ? pixels.data[edge.background + channel] : original;
          const blended = background + (recolored - background) * recolorWeight;
          layer.data[i + channel] = corrected + (blended - corrected) * spillCorrection;
        }
        layer.data[i + 3] = 255;
      }
      context.putImageData(layer, 0, 0);
    }).catch(() => {
      // The original portrait remains visible when the fabric layer cannot be rendered.
    });

    return () => { active = false; };
  }, [color, fabric, photo, stripeColor, stripeStyle]);

  return (
    <canvas ref={canvas} aria-hidden="true" data-model-fabric={color} width={photo.width} height={photo.height}
      className="pointer-events-none absolute inset-0 h-full w-full" />
  );
}

const catalogSwatches = new Map(allProducts.flatMap((product) =>
  (product.colorways ?? []).map(({ productSlug, hex }) => [productSlug, hex] as const),
));

const unlistedSwatches: Record<string, string> = {
  "mustard-ochre-bengal-striped-twill-shirt": "#B68C43",
  "royal-blue-classic-bengal-stripe-twill-shirt": "#456697",
  "dark-chocolate-brown-satin-twill-shirt": "#3C2721",
  "coral-red-bold-bengal-stripe-twill-shirt": "#E77775",
  "beige-textured-linen-cotton-shirt": "#C8B7A2",
  "pure-white-executive-pinpoint-oxford-shirt": "#FFFFFF",
  "navy-blue-fine-pinstripe-formal-shirt": "#23334C",
  "sage-mint-sartorial-stripe-shirt": "#91A99B",
  "imperial-charcoal-executive-twill-shirt": "#45464B",
  "french-blue-bengal-striped-twill-shirt": "#7580B9",
  "d-112-deep-wine-satin-twill-shirt": "#21101A",
  "italian-wool-navy-blazer": "#252E41",
  "british-houndstooth-sports-jacket": "#696157",
  "midnight-charcoal-dinner-jacket": "#313138",
  "sand-unstructured-linen-blazer": "#C7B69C",
  "camel-double-breasted-suit-jacket": "#A87750",
  "italian-pleated-beige-trousers": "#C4B392",
  "bespoke-gurkha-olive-pants": "#676448",
  "tailored-navy-stretch-chinos": "#26354D",
  "charcoal-sartorial-dress-pants": "#424448",
  "oatmeal-drawstring-linen-pants": "#C9BCA3",
  "supima-cream-heavyweight-tee": "#E5D8C3",
  "silk-cotton-knit-navy-polo": "#1D2D49",
  "obsidian-black-minimalist-tee": "#171719",
  "sage-green-textured-waffle-tee": "#85937F",
  "espresso-merino-knit-polo": "#44302A",
  "royal-silk-mulberry-kurta": "#64394D",
  "royal-bandhgala-nehru-jacket": "#28262B",
  "gold-raw-silk-celebration-attire": "#B68E57",
  "burgundy-velvet-smoking-jacket": "#652D3B",
};

export function getProductModelColor(product: ProductItem) {
  const slug = product.slug.replace(/^suitoholic-/, "");
  const selectedSwatch = product.colorways?.find(({ productSlug }) => productSlug?.replace(/^suitoholic-/, "") === slug)?.hex;
  return [selectedSwatch, catalogSwatches.get(slug), unlistedSwatches[slug]]
    .find((hex) => hex && /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(hex));
}

export function getFabricBackground(product: ProductItem, color?: string, scale = 1, stripeColor = "#f4f0ea") {
  if (!color) return undefined;
  const name = product.name + " " + product.slug;
  const light = stripeColor;
  if (/pinstripe|pin[ -]stripe/i.test(name)) {
    const stripeStart = 1.45 * scale + "%";
    return "repeating-linear-gradient(90deg, " + color + " 0 " + stripeStart + ", " + light + " " + stripeStart + " " + 1.6 * scale + "%)";
  }
  if (/stripe|striped/i.test(name)) {
    const stripeStart = 1.25 * scale + "%";
    return "repeating-linear-gradient(90deg, " + color + " 0 " + stripeStart + ", " + light + " " + stripeStart + " " + 2.5 * scale + "%)";
  }
  return undefined;
}

export function useProductModelFabric(product?: ProductItem, fabricPhoto?: string) {
  const configured = product && getProductModelColor(product);
  const src = (fabricPhoto ?? product?.image)?.trim().replace(/^https?:\/\/(localhost|127\.0\.0\.1):4000\//i, "/");
  const isStriped = /stripe/i.test((product?.name ?? "") + " " + (product?.slug ?? ""));
  const [sample, setSample] = useState<{ src: string; isStriped: boolean; color?: string; stripeColor?: string }>();

  useEffect(() => {
    if (!src) return;
    const photo = new window.Image();
    let active = true;
    photo.crossOrigin = "anonymous";
    const unavailable = () => {
      if (active) setSample({ src, isStriped });
    };
    photo.onerror = unavailable;
    photo.onload = () => {
      if (!active) return;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 32;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return unavailable();
      let pixels: Uint8ClampedArray;
      try {
        context.drawImage(photo, photo.naturalWidth * 0.35, photo.naturalHeight * 0.40,
          photo.naturalWidth * 0.30, photo.naturalHeight * 0.26, 0, 0, 32, 32);
        pixels = context.getImageData(0, 0, 32, 32).data;
      } catch {
        return unavailable();
      }
      const colors: number[][] = [];
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] > 220) colors.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
      }
      if (!colors.length) return unavailable();
      colors.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
      const hexAt = (quantile: number) => "#" + colors[Math.floor(colors.length * quantile)]
        .map((channel) => channel.toString(16).padStart(2, "0")).join("");
      setSample({
        src,
        isStriped,
        color: hexAt(isStriped ? 0.25 : 0.5),
        stripeColor: isStriped ? hexAt(0.78) : undefined,
      });
    };
    photo.src = src;
    return () => { active = false; };
  }, [isStriped, src]);

  const current = sample?.src === src && sample?.isStriped === isStriped ? sample : undefined;
  return {
    color: current?.color ?? configured,
    stripeColor: current?.stripeColor,
  };
}

export default function ProductModelPreview({
  photo, color, pattern, fabric, stripeStyle, stripeColor, alt, thumbnail = false,
}: {
  photo: ModelPhoto;
  color?: string;
  pattern?: string;
  fabric?: string;
  stripeStyle?: ModelStripeStyle;
  stripeColor?: string;
  alt: string;
  thumbnail?: boolean;
}) {
  const sizes = thumbnail ? "112px" : "(max-width: 1023px) 100vw, 50vw";

  return (
    <div className={thumbnail ? "relative mx-auto flex h-full items-center [container-type:size]" : "relative max-w-full"}>
      <div className="relative mx-auto"
        style={thumbnail ? { width: "min(100%, " + (photo.width / photo.height * 100) + "cqh)" } : undefined}>
        <Image
          src={photo.src}
          alt={alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          unoptimized={Boolean(fabric)}
          loading={thumbnail ? "lazy" : "eager"}
          className={thumbnail ? "block h-auto w-full" : "block h-auto max-h-[min(82svh,820px)] w-auto max-w-full"}
        />
        {color && fabric ? (
          <FabricOnModel key={photo.src} photo={photo} color={color} fabric={fabric} stripeStyle={stripeStyle} stripeColor={stripeColor} />
        ) : color && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 isolate"
            style={{ clipPath: photo.clip, backgroundColor: color, backgroundImage: pattern }}>
            <Image src={photo.src} alt="" fill sizes={sizes} loading={thumbnail ? "lazy" : "eager"}
              className="mix-blend-soft-light [filter:grayscale(1)_brightness(.8)_contrast(1.45)]" />
          </div>
        )}
      </div>
    </div>
  );
}
