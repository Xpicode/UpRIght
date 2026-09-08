import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Preloader } from "@/components/motion/preloader";
import { RouteCurtain } from "@/components/motion/route-transition";

/** Shared chrome for the public site (admin pages live outside this group). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <ScrollProgress />
      <RouteCurtain />
      <Navbar />
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
