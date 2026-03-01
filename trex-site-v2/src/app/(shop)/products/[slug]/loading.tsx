export default function ProductDetailLoading() {
  return (
    <div className="site-container py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-trex-card rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 w-20 bg-trex-card rounded animate-pulse" />
          <div className="h-10 w-64 bg-trex-card rounded animate-pulse" />
          <div className="h-8 w-24 bg-trex-card rounded animate-pulse" />
          <div className="h-20 w-full bg-trex-card rounded animate-pulse mt-4" />
          <div className="h-12 w-full bg-trex-card rounded-xl animate-pulse mt-8" />
        </div>
      </div>
    </div>
  );
}
