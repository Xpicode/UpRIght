import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Services } from "@/components/services";
import { ServiceDetails } from "@/components/service-details";
import { Process } from "@/components/process";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software, system integration, digital learning, IT advisory and hardware support — five service lines from one accountable team.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything from the first line of code to the last cable."
        intro="Five service lines, one accountable team. Pick what you need today — we'll make sure it still fits when you grow."
        image="/images/photos/consulting.webp"
        imagePosition="center 30%"
        imageShiftX="16%"
      />
      <Services />
      <ServiceDetails />
      <Process />
      <CtaBand title="Not sure which service you need?" text="Describe the problem — we'll tell you honestly what it takes, and what it doesn't." />
    </>
  );
}
