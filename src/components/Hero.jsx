import { lazy, Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { personalInfo, heroContent } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

// Lazy-load Three.js 3D scene into a dedicated split chunk
const HeroScene = lazy(() => import('./HeroScene'));

/**
 * Hero component
 * High-impact Signal HUD landing section featuring custom typography,
 * interactive 3D signal core, and GSAP entrance sequencing.
 */
export default function Hero() {
  const heroRef = useRef(null);

  // Split name: First word solid, rest outlined
  const nameParts = (personalInfo.name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const restName = nameParts.slice(1).join(' ');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('[data-hero="fade"]', { opacity: 1, y: 0 });
        gsap.set('[data-hero="line"]', { scaleX: 1 });
        return;
      }

      // Entrance fade & rise
      gsap.fromTo(
        '[data-hero="fade"]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.3,
        }
      );

      // Divider line scale from left
      gsap.fromTo(
        '[data-hero="line"]',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left',
          duration: 1.2,
          ease: 'power3.inOut',
          delay: 0.3,
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="hud-grid min-h-screen flex flex-col justify-between overflow-hidden px-5 md:px-10 pt-24 pb-10"
    >
      <div className="w-full max-w-[1440px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-10">
        {/* LEFT COLUMN: Metadata, Headlines & Calls to Action */}
        <div className="flex flex-col gap-6">
          {/* Eyebrow */}
          <div data-hero="fade">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold">
              {heroContent.eyebrow}
            </span>
          </div>

          {/* Dual-Tone Headline */}
          <div data-hero="fade">
            <h1 className="text-[clamp(3.2rem,11vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] flex flex-col">
              <span className="text-bone">
                <ScrambleText text={firstName} trigger="mount" delay={200} />
              </span>
              <span className="text-transparent [-webkit-text-stroke:1.5px_#e8e6df]">
                <ScrambleText text={restName} trigger="mount" delay={500} />
              </span>
            </h1>
          </div>

          {/* Divider Line */}
          <div
            data-hero="line"
            className="h-px max-w-xl bg-bone/25 origin-left w-full my-2"
          />

          {/* Role & Intro Sentence */}
          <div data-hero="fade" className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              {personalInfo.role}
            </span>
            <p className="text-lg md:text-xl text-bone/85 max-w-xl font-normal leading-relaxed">
              {heroContent.intro}
            </p>
          </div>

          {/* Action CTAs */}
          <div data-hero="fade" className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={heroContent.ctaPrimary.href}
              className="group bg-signal text-ink hover:bg-bone font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 transition-colors duration-200 flex items-center gap-3 focus:outline-none"
            >
              <span>{heroContent.ctaPrimary.label}</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href={heroContent.ctaSecondary.href}
              className="border border-bone/30 text-bone hover:border-signal hover:text-signal font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 transition-colors duration-200 focus:outline-none"
            >
              {heroContent.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Signal Core Frame */}
        <div
          data-hero="fade"
          className="hud-frame border border-bone/10 bg-panel/40 h-[48vh] min-h-[320px] lg:h-[70vh] relative flex items-center justify-center overflow-hidden"
        >
          {/* Top-left HUD label */}
          <span className="absolute top-3 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none z-10">
            core.view — drag to rotate
          </span>

          {/* 3D Scene */}
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>

          {/* Bottom-right HUD location */}
          <span className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none z-10">
            {personalInfo.city}
          </span>
        </div>
      </div>

      {/* BOTTOM STRIP: Live Status & Scroll Indicator */}
      <div
        data-hero="fade"
        className="w-full max-w-[1440px] mx-auto mt-10 border-t border-bone/10 pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-dim flex justify-between items-center"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
          <span>{personalInfo.availability}</span>
        </div>
        <span className="hidden sm:inline">Scroll ↓</span>
      </div>
    </section>
  );
}
