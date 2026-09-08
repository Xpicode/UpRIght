import type { MetadataRoute } from "next";
import { events, nav, projects } from "@/data/site";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...nav.map((n) => ({
      url: `${base}${n.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
  const work = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  const evts = events.map((e) => ({
    url: `${base}/events/${e.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
  return [...statics, ...work, ...evts];
}
