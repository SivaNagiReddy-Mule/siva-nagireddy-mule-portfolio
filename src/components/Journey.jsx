import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experience } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

/**
 * Journey component
 * Interactive career & education timeline featuring a scroll-driven progress line,
 * reactive milestone nodes, and sticky section typography.
 */
export default function Journey() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const fillLineRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const listEl = listRef.current;
      const fillEl = fillLineRef.current;
      if (!listEl || !fillEl) return;

      if (prefersReducedMotion) {
        gsap.set(fillEl, { scaleY: 1 });
        itemsRef.current.forEach((el) => {
          if (!el) return;
          el.classList.add('is-on');
          gsap.set(el, { opacity: 1, x: 0 });
        });
        return;
      }

      // Vertical line fill with scroll
      gsap.fromTo(
        fillEl,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: listEl,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: true,
          },
        }
      );

      // Timeline node activation and entry reveal
      itemsRef.current.forEach((itemEl) => {
        if (!itemEl) return;

        // Toggle active status as fill progress reaches each milestone
        ScrollTrigger.create({
          trigger: itemEl,
          start: 'top 65%',
          onEnter: () => itemEl.classList.add('is-on'),
          onLeaveBack: () => itemEl.classList.remove('is-on'),
        });

        // Entrance fade and slide-in (once)
        gsap.fromTo(
          itemEl,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: itemEl,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
        {/* LEFT: Sticky Section Header */}
        <div className="lg:sticky lg:top-28 lg:self-start flex flex-col gap-4">
          <ScrambleText
            text="03 / Journey"
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold mb-2 block"
          />
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone">
            Where I&apos;ve been learning and building.
          </h2>
        </div>

        {/* RIGHT: Animated Timeline Ordered List */}
        <div className="relative">
          <ol
            ref={listRef}
            className="relative pl-8 md:pl-10 space-y-12 md:space-y-16"
          >
            {/* Background 1px vertical line */}
            <div
              aria-hidden="true"
              className="w-px bg-bone/15 absolute left-0 top-0 bottom-0 pointer-events-none"
            />

            {/* Foreground filling signal-orange line */}
            <div
              ref={fillLineRef}
              aria-hidden="true"
              className="w-px bg-signal absolute left-0 top-0 bottom-0 origin-top pointer-events-none"
            />

            {experience.map((entry, idx) => (
              <li
                key={`${entry.org}-${entry.period}`}
                ref={(el) => {
                  itemsRef.current[idx] = el;
                }}
                className="relative group [&.is-on_.node]:bg-signal [&.is-on_.node]:scale-100 flex flex-col gap-2 transition-all duration-300"
              >
                {/* 15px Square Timeline Node */}
                <span
                  aria-hidden="true"
                  className="node absolute -left-8 md:-left-10 -translate-x-1/2 top-1.5 w-[15px] h-[15px] border border-signal bg-ink transition-all duration-300 transform scale-75"
                />

                {/* Period */}
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
                  {entry.period}
                </span>

                {/* Role */}
                <h3 className="text-2xl md:text-3xl font-bold text-bone">
                  {entry.role}
                </h3>

                {/* Organisation */}
                <span className="font-mono text-sm text-signal">
                  {entry.org}
                </span>

                {/* Description */}
                <p className="text-bone/70 leading-relaxed text-sm md:text-base pt-1">
                  {entry.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
