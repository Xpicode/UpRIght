import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { RouteCurtain } from "@/components/motion/route-transition";

/** Shared chrome for the public site (admin pages live outside this group). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <RouteCurtain />
      <Navbar />
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
