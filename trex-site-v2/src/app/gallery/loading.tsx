export default function GalleryLoading() {
  return (
    <div className="site-container py-24">
      <div className="h-4 w-16 bg-trex-card rounded animate-pulse mb-2" />
      <div className="h-10 w-36 bg-trex-card rounded animate-pulse" />
      <div className="h-5 w-64 bg-trex-card rounded animate-pulse mt-4 mb-12" />

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {[300, 400, 250, 350, 280, 320].map((h, i) => (
          <div key={i} className="break-inside-avoid">
            <div
              className="bg-trex-card rounded-2xl animate-pulse"
              style={{ height: h }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
