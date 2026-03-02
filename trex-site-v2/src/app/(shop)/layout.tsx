import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cursor-none">
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </div>
  );
}
