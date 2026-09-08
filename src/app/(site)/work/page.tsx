import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Projects } from "@/components/projects";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects — One Health Pass, MyAvior, MyCaDO, Avior LMS and more.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title="Systems that carried real weight."
        intro="From a national border-health platform to fleet-wide learning systems — a few of the projects we're proud to have shipped."
        image="/images/photos/planning.webp"
        imagePosition="center 45%"
        imageShiftX="12%"
      />
      <Projects />
      <CtaBand title="Want something like this for your organisation?" />
    </>
  );
}
