export default function GalleryLoading() {
  return (
    <div>
      <section className="bg-[#080808] pt-32 pb-16">
        <div className="site-container-wide">
          <div className="h-3 w-32 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-20 w-64 bg-white/10 rounded animate-pulse" />
        </div>
      </section>

      <section className="bg-[#080808] pb-24">
        <div className="site-container-wide">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {[300, 400, 250, 350, 280, 320, 380, 260].map((h, i) => (
              <div key={i} className="break-inside-avoid">
                <div
                  className="bg-white/5 rounded animate-pulse"
                  style={{ height: h }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
