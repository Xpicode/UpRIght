import { PageEnter } from "@/components/motion/route-transition";

// template.tsx re-mounts on every navigation, so the enter animation plays each time.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageEnter>{children}</PageEnter>;
}
