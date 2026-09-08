import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Faq } from "@/components/faq";
import { TransitionLink } from "@/components/motion/route-transition";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about Upright's services, pricing, support and how to get started.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Frequently asked questions"
        title="We're here to help."
        intro="Find answers to common questions about our IT solutions, services, pricing and support. Can't find what you're looking for? Contact our team."
        dark
        image="/images/photos/hands.webp"
        imagePosition="center 45%"
      >
        <TransitionLink href="/contact" label="Contact" className="btn btn-brand mt-8">
          Contact us <ArrowRight size={16} />
        </TransitionLink>
      </PageHeader>
      <Faq />
    </>
  );
}
