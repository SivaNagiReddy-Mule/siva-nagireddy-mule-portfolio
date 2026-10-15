// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

export const personalInfo = {
  name: "Siva NagiReddy Mule",
  brandName: "Siva NagiReddy Mule",
  role: "Java Full Stack Developer",
  city: "Bengaluru, India",
  timezone: "Asia/Kolkata", // IANA timezone used by the live clock in the HUD
  email: "sivanagireddy.mule@gmail.com",
  phone: "+919391720805",
  availability: "Working as Technical Trainer At Tap Academy",
};

export const academy = {
  name: "TAP Academy",
  url: "https://thetapacademy.com/",
};

export const socialLinks = {
  github: "https://github.com/SivaNagiReddy-Mule",
  linkedin: "https://www.linkedin.com/in/siva-nagireddy-m-7491bb404/",
  instagram: "",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const heroContent = {
  eyebrow: "PORTFOLIO — 2026",
  intro: "I design Telegram Bots and full stack applications from end to end.",
  statusLines: ["Building with Java & Python", "Learning DSA", "Working on AI Agents"],
  ctaPrimary: { label: "View projects", href: "#projects" },
  ctaSecondary: { label: "Get in touch", href: "#contact" },
};

export const aboutContent = {
  label: "01 / About",
  heading: "Engineering robust systems end to end.",
  paragraph:
    "I am a Java Full Stack Developer and Technical Trainer passionate about building scalable backends, autonomous AI agents, and Telegram bots. I enjoy solving algorithmic challenges and transforming ideas into end-to-end applications. I built and refined my foundation through the placement training program at TAP Academy.",
  stats: [
    { value: 6, suffix: "+", label: "Projects completed" },
    { value: 7, suffix: "+", label: "Technologies used" },
    { value: 250, suffix: "+", label: "HackerRank problems solved" },
  ],
};

export const introVideo = {
  label: "Intro",
  heading: "Hear it from me.",
  description: "A short self-introduction discussing my background, engineering philosophy, and aspirations.",
  youtubeUrl: "",
};

export const skillGroups = [
  { title: "Frontend", items: ["HTML", "CSS"] },
  { title: "Backend", items: ["Java", "Python"] },
  { title: "Database", items: ["MySQL"] },
  { title: "Tools", items: ["GitHub", "AI Agents"] },
];

export const projects = [
  {
    id: "project-1",
    number: "01",
    title: "Pedestrian Vision Pro AI Detection",
    description: "Computer vision and real-time pedestrian detection system built with Python.",
    tags: ["Python", "Computer Vision", "AI Detection"],
    year: "2026",
    liveUrl: "",
    githubUrl: "https://github.com/SivaNagiReddy-Mule",
  },
  {
    id: "project-2",
    number: "02",
    title: "Telegram Bot",
    description: "Automated intelligent bot delivering custom workflows, utilities, and integrations on Telegram.",
    tags: ["Python", "Telegram API", "Automation"],
    year: "2026",
    liveUrl: "",
    githubUrl: "https://github.com/SivaNagiReddy-Mule",
  },
  {
    id: "project-3",
    number: "03",
    title: "AI based ECommerce",
    description: "Full-stack e-commerce application powered by Java and intelligent recommendation features.",
    tags: ["Java", "Full Stack", "AI"],
    year: "2026",
    liveUrl: "",
    githubUrl: "https://github.com/SivaNagiReddy-Mule",
  },
];

export const experience = [
  {
    period: "2026 — Present",
    role: "Technical Trainer",
    org: "TAP Academy",
    description: "Mentoring students in Java full stack development, programming fundamentals, and technical problem-solving.",
  },
  {
    period: "2022 — 2026",
    role: "B.Tech CSE",
    org: "Vaagdevi Institute of Technology & Science",
    description: "Studied core computer science concepts, object-oriented programming, and system fundamentals.",
  },
  {
    period: "2020 — 2022",
    role: "Intermediate",
    org: "Medha Jr College",
    description: "Higher secondary education with a concentration in mathematics and physical sciences.",
  },
  {
    period: "2019 — 2020",
    role: "SSC",
    org: "ZP Boys High School",
    description: "Secondary school certificate education.",
  },
];

export const contactContent = {
  label: "05 / Contact",
  heading: "Let's build something.",
  note: "Have a role, a project or a question? Send a message — I reply within a day.",
};

export const footerContent = {
  tagline: "Designed & built by hand.",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
