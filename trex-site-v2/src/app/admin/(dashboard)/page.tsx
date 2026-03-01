import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const [
    { count: productCount },
    { count: orderCount },
    { count: paidOrderCount },
    { count: galleryCount },
  ] = await Promise.all([
    sb.from("products").select("*", { count: "exact", head: true }),
    sb.from("orders").select("*", { count: "exact", head: true }),
    sb
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid"),
    sb.from("gallery_images").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Products", value: productCount ?? 0 },
    { label: "Total Orders", value: orderCount ?? 0 },
    { label: "Paid Orders", value: paidOrderCount ?? 0 },
    { label: "Gallery Images", value: galleryCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="site-card p-6">
            <p className="text-trex-muted text-sm">{stat.label}</p>
            <p className="text-3xl font-semibold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
