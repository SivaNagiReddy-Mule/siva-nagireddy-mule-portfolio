# Siva NagiReddy Mule — Portfolio

A high-performance, technical "Signal HUD" developer portfolio website showcasing full stack engineering, Telegram bots, and autonomous AI systems.

**Live site:** https://YOUR-SITE-URL/

Built during the placement training program at [TAP Academy](https://thetapacademy.com/) (full-stack development, AI and augmented reality training).

## Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **Animation:** GSAP (with ScrollTrigger)
- **Smooth Scroll:** Lenis
- **3D Graphics:** Three.js
- **Contact:** @emailjs/browser

## Run Locally

Clone the repository and launch the application:

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

To enable automated contact form delivery via EmailJS, configure the following variables in `.env.local`:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

*(If unconfigured, the contact interface automatically falls back to an encoded client `mailto:` link).*
