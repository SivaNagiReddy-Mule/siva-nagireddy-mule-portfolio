import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalInfo, aboutContent, skillGroups } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

// Dynamically resolve portrait image asset if present
const portraitModules = import.meta.glob('../assets/about/about-portrait.*', {
  eager: true,
  import: 'default',
});
const portraitSrc = Object.values(portraitModules)[0] || null;

/**
 * About component
 * Displays developer background, high-contrast portrait, animated statistical
 * milestones, and organized technical skills with HUD styling.
 */
export default function About() {
  const sectionRef = useRef(null);
  const statsRefs = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // 1. Entrance reveal animation for section components
      if (prefersReducedMotion) {
        gsap.set('[data-about="reveal"]', { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          '[data-about="reveal"]',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }

      // 2. Metric numbers count-up animation
      statsRefs.current.forEach((el, index) => {
        if (!el) return;
        const targetValue = aboutContent.stats[index]?.value || 0;

        if (prefersReducedMotion) {
          el.textContent = String(targetValue);
          return;
        }

        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: targetValue,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = Math.round(counterObj.val);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Label */}
        <div data-about="reveal" className="mb-10">
          <ScrambleText
            text={aboutContent.label}
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold"
          />
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* LEFT: Grayscale Portrait with Signal Tint */}
          <div data-about="reveal" className="flex justify-center lg:justify-start">
            <div className="hud-frame aspect-[4/5] w-full max-w-[420px] border border-bone/10 bg-panel relative overflow-hidden">
              {portraitSrc ? (
                <img
                  src={portraitSrc}
                  alt={`${personalInfo.name} — ${personalInfo.role}`}
                  className="w-full h-full object-cover grayscale contrast-125 select-none"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-dim font-mono text-xs">
                  <span className="text-signal mb-2 text-base">NO SIGNAL</span>
                  <span>PORTRAIT UNAVAILABLE</span>
                </div>
              )}

              {/* Signal Orange Multiply Tint Layer */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-signal mix-blend-multiply opacity-25 pointer-events-none"
              />

              {/* Bottom-left ID Badge */}
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim absolute bottom-3 left-4 z-10 pointer-events-none select-none">
                ID · {personalInfo.brandName}
              </span>
            </div>
          </div>

          {/* RIGHT: Heading, Bio, Animated Stats & Skill Modules */}
          <div className="flex flex-col gap-10">
            {/* Heading */}
            <div data-about="reveal">
              <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone">
                {aboutContent.heading}
              </h2>
            </div>

            {/* Paragraph */}
            <div data-about="reveal">
              <p className="text-lg md:text-xl leading-relaxed text-bone/75 max-w-2xl font-normal">
                {aboutContent.paragraph}
              </p>
            </div>

            {/* Numeric Stats Grid */}
            <dl
              data-about="reveal"
              className="grid grid-cols-3 gap-4 border-y border-bone/10 py-8"
            >
              {aboutContent.stats.map((stat, idx) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <div className="text-4xl md:text-6xl font-bold text-bone flex items-baseline">
                    <span
                      ref={(el) => {
                        statsRefs.current[idx] = el;
                      }}
                    >
                      0
                    </span>
                    {stat.suffix && (
                      <span className="text-signal ml-0.5">{stat.suffix}</span>
                    )}
                  </div>
                  <dt className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-dim">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            {/* Technical Skill Groups Grid */}
            <div
              data-about="reveal"
              className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-bone/10 border border-bone/10"
            >
              {skillGroups.map((group, idx) => (
                <div
                  key={group.title}
                  className="bg-ink hover:bg-panel transition-colors duration-200 p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
                      {group.title}
                    </span>
                    <span className="font-mono text-[11px] text-dim">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="border border-bone/15 px-2.5 py-1 font-mono text-xs text-bone/90"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
