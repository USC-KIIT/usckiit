export type TeamCategory = "Leadership" | "Domain Leads";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  domain: string;
  category: TeamCategory;
  photoUrl: string;
  linkedinUrl: string;
  email: string;
}

export const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    id: "lead-president",
    name: "Aarav Deshmukh",
    role: "President & UiPath Student Champion",
    domain: "Core Leadership",
    category: "Leadership",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-president",
    email: "president.usckiit@gmail.com",
  },
  {
    id: "lead-vp",
    name: "Ananya Mohanty",
    role: "Vice President",
    domain: "Core Leadership",
    category: "Leadership",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-vp",
    email: "vp.usckiit@gmail.com",
  },
  {
    id: "lead-tech-director",
    name: "Rohan Chatterjee",
    role: "Technical Director",
    domain: "Core Leadership",
    category: "Leadership",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-tech",
    email: "tech.usckiit@gmail.com",
  },
  {
    id: "lead-ops-director",
    name: "Sneha Tripathy",
    role: "General Secretary",
    domain: "Core Leadership",
    category: "Leadership",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-sec",
    email: "secretary.usckiit@gmail.com",
  },
  {
    id: "domain-rpa",
    name: "Siddharth Nayak",
    role: "Domain Lead",
    domain: "RPA & Agentic AI",
    category: "Domain Leads",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-rpa",
    email: "rpa.usckiit@gmail.com",
  },
  {
    id: "domain-web",
    name: "Debayan Samal",
    role: "Domain Lead",
    domain: "Web & App Development",
    category: "Domain Leads",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-web",
    email: "web.usckiit@gmail.com",
  },
  {
    id: "domain-aiml",
    name: "Ishita Banerjee",
    role: "Domain Lead",
    domain: "AI / ML & Data Science",
    category: "Domain Leads",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-aiml",
    email: "aiml.usckiit@gmail.com",
  },
  {
    id: "domain-design",
    name: "Pranav Kulkarni",
    role: "Domain Lead",
    domain: "UI/UX & Graphic Design",
    category: "Domain Leads",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-design",
    email: "design.usckiit@gmail.com",
  },
  {
    id: "domain-content",
    name: "Meera Subramanian",
    role: "Domain Lead",
    domain: "Content & Technical Writing",
    category: "Domain Leads",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-content",
    email: "content.usckiit@gmail.com",
  },
  {
    id: "domain-marketing",
    name: "Kabir Malhotra",
    role: "Domain Lead",
    domain: "Marketing, PR & Sponsorship",
    category: "Domain Leads",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-pr",
    email: "marketing.usckiit@gmail.com",
  },
  {
    id: "domain-video",
    name: "Arjun Sengupta",
    role: "Domain Lead",
    domain: "Video Editing & Cinematography",
    category: "Domain Leads",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-video",
    email: "video.usckiit@gmail.com",
  },
  {
    id: "domain-events",
    name: "Tanya Das",
    role: "Domain Lead",
    domain: "Events & Operations",
    category: "Domain Leads",
    photoUrl: "",
    linkedinUrl: "https://linkedin.com/in/usc-kiit-events",
    email: "events.usckiit@gmail.com",
  },
];