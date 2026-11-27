import Image from "next/image";
import { useEffect, useState } from "react";
import { allProducts, type ProductItem } from "@/data/products";

const poses = [
  {
    label: "Seated studio model", width: 742, height: 852,
    shirt: [[329,163],[344,194],[364,204],[394,192],[415,151],[428,168],[482,190],[511,207],[531,231],[542,267],[549,311],[548,347],[537,403],[524,444],[499,482],[465,505],[414,538],[399,512],[374,501],[421,466],[422,456],[311,451],[312,503],[289,503],[276,517],[260,492],[248,457],[237,426],[231,399],[235,358],[235,309],[237,270],[248,235],[267,215],[303,196],[327,183]],
  },
  {
    label: "Model seated in an armchair", width: 620, height: 850,
    shirt: [[283,239],[302,260],[316,271],[332,267],[346,254],[360,230],[370,212],[386,228],[430,241],[457,251],[479,273],[490,307],[488,343],[490,383],[485,428],[492,445],[477,467],[458,475],[452,460],[438,440],[416,432],[394,442],[363,451],[324,444],[296,447],[270,439],[242,451],[234,443],[219,429],[195,424],[186,430],[177,457],[172,450],[178,420],[194,390],[205,363],[211,323],[221,294],[240,270],[260,258]],
  },
  {
    label: "Model at a garden event", width: 632, height: 857,
    shirt: [[277,279],[282,295],[275,320],[276,355],[286,402],[301,379],[322,343],[325,326],[346,307],[370,281],[390,301],[416,315],[448,333],[472,353],[483,383],[493,438],[498,488],[503,529],[498,560],[481,599],[455,629],[411,608],[417,583],[397,595],[365,600],[319,603],[266,598],[223,591],[208,582],[192,578],[164,583],[163,566],[168,540],[173,507],[176,473],[181,446],[179,408],[185,368],[203,340],[237,326],[258,313]],
  },
  {
    label: "Standing model in a short-sleeve shirt", width: 617, height: 832,
    shirt: [[271,242],[270,269],[280,297],[299,337],[309,369],[327,325],[343,292],[356,261],[355,231],[371,248],[389,258],[427,271],[464,286],[491,311],[509,348],[517,391],[538,463],[454,488],[444,465],[433,531],[430,562],[424,598],[387,601],[339,594],[288,587],[247,581],[208,572],[189,566],[202,541],[203,509],[207,478],[194,487],[174,484],[130,470],[139,438],[147,403],[148,366],[158,333],[179,306],[208,287],[240,273]],
  },
] as const;

export const productModelPhotos = poses.map(({ shirt, ...pose }, index) => ({
  ...pose,
  src: "/product-models/pose-" + (index + 1) + ".webp",
  clip: "polygon(" + shirt.map(([x, y]) => (x / pose.width * 100) + "% " + (y / pose.height * 100) + "%").join(",") + ")",
}));

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

export function useProductModelFabric(product?: ProductItem) {
  const configured = product && getProductModelColor(product);
  const src = product?.image.trim().replace(/^https?:\/\/(localhost|127\.0\.0\.1):4000\//i, "/");
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
  photo, color, pattern, alt, thumbnail = false,
}: {
  photo: (typeof productModelPhotos)[number];
  color?: string;
  pattern?: string;
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
          loading={thumbnail ? "lazy" : "eager"}
          className={thumbnail ? "block h-auto w-full" : "block h-auto max-h-[min(82svh,820px)] w-auto max-w-full"}
        />
        {color && (
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
