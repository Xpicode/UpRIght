/**
 * All landing-page copy lives here so it can be edited without touching components.
 */

export const site = {
  name: "Upright Solutions and Systems Consultancy Corp.",
  shortName: "Upright Solutions",
  tagline: "Quietly Supporting What Keeps Things Moving",
  description:
    "Philippine-based IT consultancy delivering custom software, system integration, digital learning platforms, IT advisory and hardware support since 2015.",
  established: 2015,
  contact: {
    email: "antoneskian4@gmail.com",
    phone: "+63 956 513 4330",
    phoneHref: "tel:+639565134330",
    address: "Bacoor, Cavite 4102, Philippines",
  },
  offices: [
    {
      id: "manila",
      name: "Manila",
      label: "Main Office",
      address:
        "OCEANWIDE Maritime Services Corp. — Manila Office, 2111 Elias St., Santa Cruz, Manila 1008",
      tel: "+63 956 513 4330",
      telHref: "tel:+639565134330",
      email: "antoneskian4@gmail.com",
      mapUrl: "https://maps.app.goo.gl/dEZp72QvCQuZoj2S9",
      coordinates: { lng: 120.98794626768314, lat: 14.618820134540577 },
    },
    {
      id: "cavite",
      name: "Cavite",
      label: "Training Site",
      address: "Oceanwide Maritime Bacoor, Cavite Training Site, Bacoor, Cavite 4102",
      tel: "+63 956 513 4330",
      telHref: "tel:+639565134330",
      email: "antoneskian4@gmail.com",
      mapUrl: "https://maps.app.goo.gl/BLjvJTaJhA6HCJgY6",
      coordinates: { lng: 120.93805309176695, lat: 14.46040974826165 },
    },
  ],
  socials: {
    linkedin:
      "https://www.linkedin.com/company/upright-solutions-and-systems-consultancy-corp/about/",
    facebook:
      "https://www.facebook.com/p/Upright-Solutions-and-Systems-Consultancy-Corp-100088526657457/",
  },
};

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: "4M+", label: "Travellers processed through One Health Pass" },
  { value: "10+", label: "Years building for Philippine enterprises" },
  { value: "5", label: "Service lines under one roof" },
  { value: "2", label: "Offices — Manila & Cavite" },
];

export const clients = [
  { name: "Bureau of Quarantine", logo: "/images/clients/BOQ.png" },
  { name: "Avior Marine", logo: "/images/clients/avior.png" },
  { name: "MyCaDO", logo: "/images/clients/mycado.png" },
  { name: "LBC Express", logo: "/images/clients/lbc.png" },
  { name: "Gerry's Restaurant", logo: "/images/clients/gerrys.png" },
  { name: "Atria Learning", logo: "/images/clients/atria.png" },
];

export type Service = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  points: string[];
  icon: "code" | "layers" | "graduation" | "compass" | "cpu";
  size: "lg" | "md" | "sm";
  image?: string;
};

export const services: Service[] = [
  {
    id: "software",
    title: "Custom Software",
    tagline: "From custom apps to enterprise systems, all tailor-made.",
    description:
      "Web applications, enterprise platforms, APIs and mobile apps built on scalable, secure architecture that is aligned with your business goals.",
    points: ["Web applications", "Enterprise systems", "API development", "Mobile apps"],
    icon: "code",
    size: "lg",
  },
  {
    id: "integration",
    title: "System Integration",
    tagline: "From architecture to implementation, all strategically planned.",
    description:
      "Connect disparate systems into one efficient ecosystem — legacy modernization, data integration and cloud migration.",
    points: ["Architecture design", "Legacy modernization", "Cloud migration"],
    icon: "layers",
    size: "md",
    image: "/images/photos/planning.webp",
  },
  {
    id: "learning",
    title: "Digital Learning",
    tagline: "From e-learning to training systems, all expertly crafted.",
    description:
      "Custom courses and learning management systems that make training effective, accessible and measurable.",
    points: ["Custom e-learning", "LMS platforms", "Content development"],
    icon: "graduation",
    size: "md",
    image: "/images/photos/learning.webp",
  },
  {
    id: "advisory",
    title: "IT Advisory",
    tagline: "From strategy to execution, all expert-guided.",
    description:
      "Technology roadmaps and digital transformation guidance focused on practical results and ROI.",
    points: ["Roadmapping", "Digital transformation"],
    icon: "compass",
    size: "sm",
  },
  {
    id: "hardware",
    title: "Hardware & Support",
    tagline: "From repairs to upgrades, all professionally handled.",
    description:
      "Procurement, installation, preventive maintenance and emergency support that keeps infrastructure at peak performance.",
    points: ["Installation", "Maintenance", "CCTV & networks"],
    icon: "cpu",
    size: "sm",
  },
];

export type Project = {
  slug: string;
  title: string;
  client: string;
  partner?: string;
  category: string;
  kind: "software" | "hardware" | "consulting";
  summary: string;
  description: string[];
  highlights: string[];
  recognition?: string;
  image: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "one-health-pass",
    title: "One Health Pass",
    client: "Bureau of Quarantine (BOQ), Department of Health (Philippines)",
    category: "Government · Public health",
    kind: "software",
    summary:
      "Digital health verification for international travellers entering the Philippines during the pandemic — processing roughly four million passengers and helping the country reopen its borders safely.",
    description: [
      "Upright Solutions and Systems Consultancy Corp. received formal recognition for its contribution to the One Health Pass (OHP) Project, a national initiative led by the Philippine government to support public health, safety and border control measures during the COVID-19 pandemic.",
      "The OHP was officially launched by the Bureau of Quarantine (BOQ) in accordance with World Health Organization (WHO) protocols to enable the safe and seamless movement of international travellers entering the Philippines, as affirmed by the Department of Health.",
      "This recognition highlights Upright's commitment to public service, inter-agency collaboration and technology-enabled solutions — supporting national health initiatives and strengthening trust in government-led digital systems.",
    ],
    highlights: [
      "National-scale digital health verification system",
      "WHO-compliant health protocols integration",
      "Streamlined border control and quarantine processes",
      "Real-time health data validation and verification",
      "Secure handling of sensitive health information",
      "Inter-agency collaboration with government bodies",
    ],
    recognition:
      "Plaque of Appreciation awarded to Capt. Gregory Nick Sevilla for contribution to the OHP Project",
    image: "/images/projects/onehealthpass.webp",
    featured: true,
  },
  {
    slug: "myavior",
    title: "MyAvior",
    client: "Avior Marine",
    category: "Learning platform",
    kind: "software",
    summary:
      "Digital learning platforms and learning content development solutions for maritime professionals.",
    description: [
      "MyAvior is a centralized learning platform for Avior Marine, designed to support the training and development of both seafarers and office staff by providing easy access to courses, learning resources and professional development tools.",
      "The platform enables seamless learning experiences with features including course tracking, progress monitoring, certification management and personalized learning paths tailored to individual career goals.",
      "Built with a user-centric approach, MyAvior ensures that maritime professionals can access training materials anytime, anywhere — supporting continuous professional development across the fleet.",
    ],
    highlights: [
      "Centralized learning management system for maritime professionals",
      "Mobile-responsive design for access on ships and shore",
      "Progress tracking and certification management",
      "Personalized learning paths based on career progression",
      "Integration with existing HR and fleet management systems",
    ],
    image: "/images/projects/myavior.webp",
  },
  {
    slug: "mycado",
    title: "MyCaDO",
    client: "Interreg VI-A Deutschland–Nederland Programme",
    partner: "Atria Learning and Development",
    category: "Maritime e-learning",
    kind: "software",
    summary: "Maritime learning solutions for onboard and shore-based staff training.",
    description: [
      "The MyCaDO project is part of the Interreg VI-A Deutschland–Nederland Programme and is co-financed with €1.73 million by the European Union, the Ministry of Lower Saxony and the provinces of Groningen, Fryslân and Drenthe.",
      "As part of the Upright team working alongside Atria, the company provides support in building engaging, practical and audience-driven learning content designed for both onboard and shore-based staff.",
      "The project addresses the evolving needs of the maritime industry by creating digital learning pathways that align with international maritime standards while remaining accessible and engaging for seafarers at all career stages.",
    ],
    highlights: [
      "Development of practical and transferable learning frameworks",
      "Clarification of career development pathways from Cadet to Captain/Chief Engineer",
      "Structured alignment of learning levels from basic to experiential and practical",
      "Supported the digital transition of regulatory and STCW training",
      "Delivered solutions applicable across platform, program, course and tool levels",
      "EU-funded initiative with cross-border collaboration between Germany and the Netherlands",
    ],
    image: "/images/projects/mycado.webp",
  },
  {
    slug: "avior-lms",
    title: "Avior LMS",
    client: "Avior Marine",
    category: "LMS · Compliance",
    kind: "software",
    summary: "Learning management system for structured training and compliance tracking.",
    description: [
      "Avior LMS is a comprehensive learning management system for Avior Marine, designed to deliver structured training, track learning progress and support compliance and professional development for both seafarers and office staff.",
      "The system provides administrators with powerful tools to create, assign and monitor training programmes while ensuring all personnel meet regulatory requirements and industry standards.",
      "With robust reporting capabilities, Avior LMS enables data-driven decisions about training effectiveness and workforce development, helping Avior Marine maintain a highly skilled and compliant crew.",
    ],
    highlights: [
      "Comprehensive compliance tracking for maritime regulations",
      "Automated training assignment and deadline management",
      "Advanced reporting and analytics dashboard",
      "Certificate generation and expiry tracking",
      "Multi-language support for international crews",
      "Offline access capabilities for use at sea",
    ],
    image: "/images/projects/myavior1.webp",
  },
];

export const process = [
  {
    step: "01",
    title: "Discover",
    text: "We map your workflows, constraints and goals before a single line is written.",
  },
  {
    step: "02",
    title: "Design",
    text: "Architecture, data model and UX are agreed up front so there are no surprises later.",
  },
  {
    step: "03",
    title: "Build",
    text: "Iterative delivery with testing baked in — you see working software every sprint.",
  },
  {
    step: "04",
    title: "Support",
    text: "Deployment, monitoring and hands-on maintenance long after launch day.",
  },
];

export const recognition = {
  title: "Certificate of Appreciation — National Task Group for Returning Overseas Filipinos",
  text: "Recognised for developing and providing the IT systems and protocols at Philippine airports that processed approximately four million passengers under the One Health Pass programme.",
  date: "July 2022",
};

export const founder = {
  name: "Capt. Gregory Nick R. Sevilla",
  role: "Founder & Owner",
  photo: "/images/photos/founder.webp",
  // Factual note shown under the founder's name. Replace with a real quote from him if you have one.
  note: "Recognised with a Plaque of Appreciation for his role in the One Health Pass programme as part of the OSS-MROF team.",
};

export const teamPhotos = [
  { src: "/images/photos/team-lounge.webp", alt: "Upright team at a company gathering" },
  { src: "/images/photos/team-event.webp", alt: "Upright team at an industry event" },
  { src: "/images/photos/team-field.webp", alt: "Upright team on a field visit" },
  { src: "/images/photos/classroom.webp", alt: "Maritime cadets in a training classroom" },
];

/** Stat cards mixed into the home-page team strip (from the original site). */
export const teamStats = [
  { value: "10+", label: "Years of industry experience" },
  { value: "50+", label: "Successful projects delivered" },
  { value: "100+", label: "Clients served across industries" },
  { value: "24/7", label: "Dedicated support available" },
  { value: "15+", label: "Expert team members" },
  { value: "99%", label: "Client satisfaction rate" },
];

/** Photo wall for the "Meet the team" gallery. Add `name`/`role` per photo when you have them. */
export const teamGallery: {
  src: string;
  alt: string;
  caption: string;
  wide?: boolean;
  name?: string;
  role?: string;
}[] = [
  { src: "/images/photos/team-6.webp", alt: "Upright and Atria teams at the Atria office", caption: "With our partners at Atria Learning & Development", wide: true, role: "Management" },
  { src: "/images/photos/team-2.webp", alt: "Upright team at Seatrade Crew Connect", caption: "Seatrade Maritime Crew Connect Global 2025", role: "Development" },
  { src: "/images/photos/team-3.webp", alt: "Upright team receiving an award", caption: "Recognition night", role: "Operations" },
  { src: "/images/photos/team-lounge.webp", alt: "Upright team at a company gathering", caption: "Off the clock", role: "Engineering" },
  { src: "/images/photos/team-7.webp", alt: "Upright team in a planning meeting", caption: "Monday planning", role: "Design" },
  { src: "/images/photos/team-8.webp", alt: "Upright team sharing a meal", caption: "Team lunch, Manila", wide: true, role: "Support" },
  { src: "/images/photos/team-event.webp", alt: "Upright team at an industry event", caption: "Industry meet-up", role: "Technical Lead" },
  { src: "/images/photos/team-5.webp", alt: "Upright team at the office", caption: "The dev floor", role: "Project Manager" },
  { src: "/images/photos/team-9.webp", alt: "Upright team dinner", caption: "Dinner after go-live", role: "Solutions Architect" },
  { src: "/images/photos/team-field.webp", alt: "Upright team on a field visit", caption: "On site", role: "Quality Assurance" },
];

export type EventItem = {
  slug: string;
  title: string;
  date: string;
  year: string;
  readingTime: string;
  location?: string;
  leadBy: string;
  withPartner: string;
  summary: string;
  description: string[];
  image: string;
  gallery?: string[];
  highlights?: string[];
  stats?: { label: string; value: string }[];
  mission?: string[];
};

export const events: EventItem[] = [
  {
    slug: "crew-forward-conference",
    title: "Crew Forward Conference",
    date: "December 4, 2025",
    year: "2025",
    readingTime: "5",
    location: "Manila",
    leadBy: "Atria Learning & Development",
    withPartner: "Upright Solutions and Systems Consultancy Corp.",
    summary:
      "A learning-driven maritime conference designed to strengthen people, leadership and collaboration across fleet and shore teams — held every quarter.",
    description: [
      "Led by Atria Learning & Development in collaboration with Upright, Crew Forward brings together seafarers, officers, managers and maritime professionals to reflect, learn and move forward together.",
      "It focuses on the human side of maritime operations — leadership mindset, trust, communication, accountability and teamwork in a multicultural, high-pressure environment. Upright supports the programme through coordination, execution and systems thinking.",
    ],
    image: "/images/photos/event-crew-forward-1.webp",
    gallery: [
      "/images/photos/event-crew-forward-2.webp",
      "/images/photos/event-crew-forward-3.webp",
      "/images/photos/event-capgreg.webp",
      "/images/photos/conference.webp",
    ],
    highlights: [
      "Reflect on roles and responsibilities",
      "Strengthen leadership and interpersonal skills",
      "Improve collaboration between ship and shore",
      "Build trust, professionalism and shared ownership",
    ],
    stats: [
      { label: "Attendees", value: "175" },
      { label: "Speakers", value: "5" },
      { label: "Talks", value: "8" },
      { label: "Workshops", value: "3" },
    ],
    mission: [
      "The mission of the Crew Forward team is to empower maritime professionals to grow as individuals and leaders, while strengthening alignment, trust and cooperation across the organisation.",
      "Atria Learning & Development leads the learning design and facilitation, ensuring every session is practical, relevant and grounded in real maritime experience. Upright supports the programme through coordination, execution and systems thinking — bridging learning, people and operational realities.",
      "Crew Forward is more than a conference. It is a shared commitment to better leadership, stronger teams and a more resilient maritime community.",
    ],
  },
  {
    slug: "avior-forward-program",
    title: "Avior Forward Program",
    date: "March 25, 2025",
    year: "2025",
    readingTime: "4",
    leadBy: "Upright Solutions and Systems Consultancy Corp.",
    withPartner: "Atria Learning and Development",
    summary: "Marking the start of Avior Marine's leadership development journey.",
    description: [
      "Upright, in coordination with Atria Learning, helped bring the Avior Forward Program to life — the start of Avior Marine's leadership development journey.",
      "Through strong local coordination and on-ground execution, Upright delivered immersive workshops and leadership activities that strengthened trust, collaboration and accountability across Avior's management team.",
    ],
    image: "/images/photos/team-6.webp",
  },
  {
    slug: "seatrade-crew-connect-2025",
    title: "Seatrade Maritime Crew Connect Global 2025",
    date: "February 11, 2025",
    year: "2025",
    readingTime: "3",
    leadBy: "Atria Learning and Development",
    withPartner: "Upright Solutions and Systems Consultancy Corp.",
    summary: "Supporting Atria Learning's presence on the global maritime stage.",
    description: [
      "At Seatrade Maritime Crew Connect Global 2025, Upright worked closely with Atria Learning and Development to support its presence on the global stage.",
      "Upright handled local coordination and on-site support for the Atria Learning booth — helping create meaningful conversations, stronger connections and greater visibility for innovative learning and leadership solutions in the maritime industry.",
    ],
    image: "/images/photos/team-2.webp",
  },
];

export const awards = [
  {
    title: "Certificate of Appreciation",
    issuer: "National Task Group for Returning Overseas Filipinos (One Health Pass)",
    date: "July 2, 2022",
    location: "The Villamor Air Base Golf Club, Pasay City",
    description:
      "Awarded for vigorous involvement in implementing health and safety measures to contain the spread of COVID-19 through the development and provision of IT systems and protocols at airports, which processed approximately four million passengers and enabled the Philippines to reopen its gates to international travellers.",
    highlights: [
      "≈4 million passengers processed",
      "Enabled the Philippines to reopen to international travellers",
      "Recognised for compliance with government policies and safe management of arriving passengers",
    ],
    image: "/images/photos/awards-badge.webp",
    photo: "/images/photos/plaque.webp",
  },
];

/**
 * Client testimonials — quotes and portraits carried over from the previous site.
 * The portraits are Unsplash stock photos (same ones the old site used), NOT the
 * people quoted, and the old names were real executives who never gave these
 * quotes — so `name`/`role`/`company` are left empty (the card hides the attribution
 * line) until you have real client quotes, with permission. Swap `photo` for a local file (e.g. "/images/testimonials/x.jpg")
 * whenever you have a real picture; remove it to fall back to an initials avatar.
 */
const stock = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&q=85`;

export const testimonials = [
  {
    quote: "Upright transformed our IT infrastructure. Their expertise in system integration is unmatched in the industry.",
    name: "",
    role: "",
    company: "",
    photo: stock("1507003211169-0a1dd7228f2d"),
  },
  {
    quote: "Working with Upright has been a game-changer for our digital transformation journey. Highly recommended!",
    name: "",
    role: "",
    company: "",
    photo: stock("1500648767791-00dcc994a43e"),
  },
  {
    quote: "Their professional approach and technical expertise helped us streamline our operations significantly.",
    name: "",
    role: "",
    company: "",
    photo: stock("1472099645785-5658abf4ff4e"),
  },
  {
    quote: "Upright delivered beyond our expectations. Their solutions are robust, scalable, and future-proof.",
    name: "",
    role: "",
    company: "",
    photo: stock("1519085360753-af0119f7cbe7"),
  },
  {
    quote: "The team's dedication to excellence and customer satisfaction is truly remarkable. A trusted IT partner.",
    name: "",
    role: "",
    company: "",
    photo: stock("1438761681033-6461ffad8d80"),
  },
  {
    quote: "Upright's innovative solutions have given us a competitive edge in the market. Exceptional service!",
    name: "",
    role: "",
    company: "",
    photo: stock("1506794778202-cad84cf45f1d"),
  },
  {
    quote: "Their system integration expertise helped us achieve seamless operations across all our business units.",
    name: "",
    role: "",
    company: "",
    photo: stock("1560250097-0b93528c311a"),
  },
  {
    quote: "Upright understands our business needs and delivers solutions that drive real results.",
    name: "",
    role: "",
    company: "",
    photo: stock("1463453091185-61582044d556"),
  },
];
