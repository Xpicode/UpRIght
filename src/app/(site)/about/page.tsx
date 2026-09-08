import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AboutStory } from "@/components/about-story";
import { TeamGallery } from "@/components/team-gallery";
import { Awards } from "@/components/awards";
import { CtaBand } from "@/components/cta-band";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} — ${site.tagline}. Our story, our team and our recognition.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Upright"
        title={site.tagline}
        intro={`Founded in ${site.established}, we grew from maritime training content into a full IT consultancy serving enterprises and government from Manila and Cavite.`}
        image="/images/photos/team-6.webp"
        imagePosition="center 40%"
        imageShiftX="18%"
      />
      <AboutStory />
      <TeamGallery />
      <Awards />
      <CtaBand title="Like how we work?" text="We're always up for a conversation — about a project, a partnership, or joining the team." />
    </>
  );
}
