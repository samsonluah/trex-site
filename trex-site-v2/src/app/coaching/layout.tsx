import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
