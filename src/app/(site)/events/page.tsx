import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { EventCards } from "@/components/event-cards";
import { EventFeature } from "@/components/events";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Events",
  description: "Conferences and programmes Upright has led or supported — Crew Forward, Avior Forward, Seatrade Crew Connect.",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Learning happens in rooms, not just on screens."
        intro="Conferences and programmes we've led or supported with our partners at Atria Learning & Development."
        image="/images/photos/conference.webp"
        imagePosition="center 30%"
        imageShiftX="14%"
      />
      <EventCards />
      <EventFeature />
      <CtaBand title="Planning an event or programme?" text="We handle coordination, execution and the systems behind it." />
    </>
  );
}
