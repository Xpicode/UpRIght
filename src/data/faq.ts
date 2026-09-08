/**
 * FAQ content, carried over from the previous site and lightly updated to the
 * current company name. Pricing, payment terms and support hours are commercial
 * statements — keep them in sync with what sales actually offers.
 */
export type FaqItem = { q: string; a: string };
export type FaqCategory = { id: string; title: string; blurb: string; items: FaqItem[] };

export const faqCategories: FaqCategory[] = [
  {
    id: "general",
    title: "General",
    blurb: "Who we are and what we do.",
    items: [
      {
        q: "What services does Upright provide?",
        a: "We offer end-to-end IT solutions: system design and integration, custom software development, professional IT services, hardware deployment and maintenance, IT advisory, digital learning platforms (LMS) and maritime training content — plus ongoing support once everything is live.",
      },
      {
        q: "Which industries do you serve?",
        a: "Our work spans government, maritime, financial services, telecommunications, healthcare, energy, manufacturing, hospitality, logistics, education and corporate clients. Each engagement is adapted to the standards and constraints of that sector.",
      },
      {
        q: "Where is Upright located?",
        a: "Our main office is in Santa Cruz, Manila, with a training site in Bacoor, Cavite. We serve clients across the Philippines and work to international standards and best practices.",
      },
      {
        q: "How long has Upright been in business?",
        a: "Upright was established on 30 October 2015 as Upright Maritime Learning and Review Center Corp. Over the past decade we've grown from educational technology into a full IT consultancy, now operating as Upright Solutions and Systems Consultancy Corp. as part of the Oceanwide Group.",
      },
    ],
  },
  {
    id: "services",
    title: "Services & solutions",
    blurb: "What's included in each service line.",
    items: [
      {
        q: "What is included in your system integration services?",
        a: "A thorough review of your existing systems, custom integration work, API development, database synchronisation, legacy modernisation, cloud migration and the ongoing support needed to keep everything talking to each other.",
      },
      {
        q: "Do you provide custom software development?",
        a: "Yes. We build web applications, mobile apps, ERP and CRM platforms, inventory and records systems, and industry-specific tools — designed around how your organisation actually works.",
      },
      {
        q: "What is your Learning Management System (LMS) solution?",
        a: "A complete online learning platform with course management, learner tracking, assessments, certification management, interactive content, progress analytics and mobile access. We've deployed it for maritime training, corporate learning and professional certification programmes.",
      },
      {
        q: "Do you offer IT consulting?",
        a: "Yes — technology assessments, digital transformation strategy, system architecture, security reviews, compliance guidance, technology roadmaps and vendor selection. We act as a strategic partner so you can make informed decisions.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Projects & pricing",
    blurb: "Timelines, pricing models and payment terms.",
    items: [
      {
        q: "How long does a typical project take?",
        a: "It depends on scope. Smaller projects such as a website or a simple integration usually take 4–8 weeks; custom software or an LMS rollout 3–6 months; large enterprise integrations 6–12 months. You'll get a detailed timeline during the consultation.",
      },
      {
        q: "How do you price your services?",
        a: "We offer fixed-price projects, time-and-materials, monthly retainers and dedicated-team arrangements. Pricing reflects scope, complexity, timeline and the resources required, and you'll always receive a transparent, itemised quote after the free consultation.",
      },
      {
        q: "Do you offer payment plans?",
        a: "Yes. Larger projects are typically split into milestones — an initial deposit, payments through the development phases and a final payment on delivery. Long-running engagements can be billed monthly. Terms are agreed per project.",
      },
      {
        q: "Is there a minimum project size or budget?",
        a: "We work with organisations of all sizes and there's no strict minimum. For smaller needs we can start with an advisory engagement and recommend the right-sized solution — get in touch and we'll tell you honestly what it takes.",
      },
    ],
  },
  {
    id: "support",
    title: "Support & maintenance",
    blurb: "What happens after launch.",
    items: [
      {
        q: "What support do you provide after a project is completed?",
        a: "Every project includes a warranty period (typically 3–6 months) covering bug fixes, plus user training, documentation and technical support by phone or email. Optional maintenance contracts cover monitoring, updates and enhancements beyond that.",
      },
      {
        q: "Do you offer maintenance contracts?",
        a: "Yes — monthly retainers, SLA-based packages with guaranteed response times, proactive monitoring, regular patches and updates, performance tuning and priority handling for critical issues.",
      },
      {
        q: "What are your support hours?",
        a: "Standard support runs Monday to Friday, 9:00 AM to 6:00 PM Philippine time. Clients on maintenance contracts can add extended hours and 24/7 emergency cover for critical systems.",
      },
      {
        q: "How do you handle system updates and upgrades?",
        a: "Routine updates cover security patches, fixes and improvements. Major upgrades are tested first, backed up, scheduled for low-traffic windows and shipped with a rollback plan — and always communicated in advance.",
      },
    ],
  },
  {
    id: "start",
    title: "Getting started",
    blurb: "How an engagement begins.",
    items: [
      {
        q: "How do I get started with Upright?",
        a: "Reach out by phone, email or the contact form; we schedule a free consultation, send a detailed proposal and quote, agree the terms, and kick off with your team. We guide you through every step.",
      },
      {
        q: "What information do you need for a quote?",
        a: "Your business objectives, current systems and infrastructure, the features you need, expected timeline, budget range, number of users, integration requirements and any compliance or security needs. The more detail, the more accurate the quote.",
      },
      {
        q: "Do you offer free consultations?",
        a: "Yes — an initial consultation of one to two hours where we discuss your needs, review your current situation and outline possible solutions, so both sides can see whether it's a good fit.",
      },
      {
        q: "Can you work with our existing IT team?",
        a: "Absolutely. We regularly work alongside in-house teams — as an extension of your team, as specialists on a specific project, or by taking full ownership while coordinating closely with your people.",
      },
    ],
  },
  {
    id: "security",
    title: "Technology & security",
    blurb: "Our stack and how we protect your data.",
    items: [
      {
        q: "What technologies do you work with?",
        a: "Modern web (React, Next.js, Node.js, PHP, .NET), mobile (React Native, Flutter), databases (PostgreSQL, MySQL, MongoDB), cloud (AWS, Azure, Google Cloud) and a range of enterprise platforms. We recommend the stack that fits your needs, not the other way round.",
      },
      {
        q: "How do you ensure data security?",
        a: "Encrypted transport (TLS), secure authentication and authorisation, secure coding practices, regular security reviews, backups and disaster-recovery plans, and compliance with data-protection requirements — including support for specific standards you need to meet.",
      },
      {
        q: "Do you sign Non-Disclosure Agreements?",
        a: "Yes. We're happy to sign an NDA before discussing project details — either our standard template or your company's own agreement.",
      },
      {
        q: "Are your solutions scalable?",
        a: "Scalability is designed in from day one: systems that handle growing user loads, accept new modules and integrations, and scale infrastructure horizontally or vertically using cloud-native architectures.",
      },
    ],
  },
];
