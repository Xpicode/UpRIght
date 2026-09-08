import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/site";
import { ProjectDetail } from "@/components/project-detail";
import { CtaBand } from "@/components/cta-band";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const idx = projects.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  return (
    <>
      <ProjectDetail project={projects[idx]} next={projects[(idx + 1) % projects.length]} />
      <CtaBand title="Want something like this for your organisation?" />
    </>
  );
}
