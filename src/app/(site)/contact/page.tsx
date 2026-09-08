import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Contact } from "@/components/contact";
import { Offices } from "@/components/offices";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Upright — Manila and Cavite offices, phone, email and project inquiry form.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what needs to keep moving."
        intro="Share a few details and we'll reply within one business day with next steps — no sales pressure, just a clear plan."
        dark
        image="/images/photos/building.webp"
        imagePosition="right 40%"
      />
      <Contact />
      <Offices />
    </>
  );
}
