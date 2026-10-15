import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger once
gsap.registerPlugin(ScrollTrigger);

/**
 * useSmoothScroll hook
 * Sets up Lenis smooth scrolling driven by GSAP ticker,
 * binds smooth anchor navigation, and syncs ScrollTrigger.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Respect reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    // Update ScrollTrigger on scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's shared animation loop
    const tick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Smooth anchor navigation for # links
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -60 });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Refresh ScrollTrigger calculations after initial layout loads
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleLoad);
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('load', handleLoad);
      clearTimeout(timeoutId);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
