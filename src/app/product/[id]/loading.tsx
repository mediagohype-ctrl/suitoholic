export default function LoadingProduct() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-4 pb-8 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
      <p role="status" className="sr-only">Loading product details</p>
      <div aria-hidden="true" className="grid gap-6 motion-safe:animate-pulse lg:grid-cols-2">
        <div className="h-[min(65svh,700px)] rounded-xl bg-black/5" />
        <div className="space-y-4 pt-4">
          <div className="h-8 w-3/4 rounded bg-black/5" />
          <div className="h-5 w-1/3 rounded bg-black/5" />
          <div className="h-12 w-full rounded bg-black/5" />
        </div>
      </div>
    </main>
  );
}
