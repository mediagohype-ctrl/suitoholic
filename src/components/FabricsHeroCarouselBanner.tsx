export default function FabricsHeroCarouselBanner() {
  return (
    <section aria-label="Suitoholic fabric collection banner" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[#30271F]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/banners/fabrics-atelier-hero.webp"
        alt="A tailor's table filled with folded and draped shirting fabrics in blue, pink, olive, cream, and striped patterns."
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
      />
    </section>
  );
}
