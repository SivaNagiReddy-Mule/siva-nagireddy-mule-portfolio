import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { introVideo, personalInfo } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

/**
 * Parses YouTube video ID and detects whether URL is a vertical /shorts/ video.
 * Supports youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID, and youtube.com/embed/ID.
 */
function getYouTubeInfo(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return null;

  const isShorts = url.includes('/shorts/');
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/
  );

  if (!match || !match[1]) return null;

  return {
    id: match[1],
    isShorts,
  };
}

/**
 * IntroVideo component
 * Displays a technical Signal HUD video player for YouTube intro videos,
 * featuring an animated entrance, grayscale thumbnail, centered signal play trigger,
 * and lazy-loaded privacy-enhanced iframe replacement on click.
 */
export default function IntroVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const rawUrl = introVideo?.youtubeUrl;
  const ytInfo = getYouTubeInfo(rawUrl);

  useEffect(() => {
    if (!ytInfo || !playerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(playerRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        playerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: playerRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [ytInfo]);

  // If introVideo.youtubeUrl is empty or invalid, render nothing
  if (!rawUrl || !ytInfo) {
    return null;
  }

  return (
    <section id="intro" className="w-full px-5 md:px-10 py-24">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="mb-10">
          <ScrambleText
            text={`02 / ${introVideo.label || 'Intro'}`}
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold block mb-3"
          />
          <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold tracking-[-0.03em] text-bone">
            {introVideo.heading}
          </h2>
          {introVideo.description && (
            <p className="text-bone/70 text-base md:text-lg mt-3 max-w-2xl font-normal leading-relaxed">
              {introVideo.description}
            </p>
          )}
        </div>

        {/* Player Container */}
        <div
          ref={playerRef}
          className={`hud-frame border border-bone/10 bg-panel overflow-hidden relative group ${
            ytInfo.isShorts
              ? 'aspect-[9/16] max-w-sm mx-auto'
              : 'aspect-video max-w-5xl mx-auto'
          }`}
        >
          {isPlaying ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytInfo.id}?autoplay=1&rel=0&modestbranding=1`}
              title="Self-introduction video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsPlaying(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsPlaying(true);
                }
              }}
              className="w-full h-full relative cursor-pointer focus:outline-none"
              data-cursor="hot"
              aria-label="Play self-introduction video"
            >
              {/* Grayscale Video Thumbnail */}
              <img
                src={`https://i.ytimg.com/vi/${ytInfo.id}/hqdefault.jpg`}
                alt={`${personalInfo.name} self-introduction video`}
                loading="lazy"
                className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-700 select-none"
              />

              {/* Faint HUD Grid Overlay */}
              <div className="hud-grid absolute inset-0 opacity-20 pointer-events-none" />

              {/* Centered Square Signal-Orange Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(true);
                  }}
                  aria-label="Play introduction video"
                  className="w-20 h-20 bg-signal text-ink flex items-center justify-center hover:bg-bone transition-colors duration-200 shadow-2xl focus:outline-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 ml-1 text-ink"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Watch on YouTube Link */}
        <div
          className={`mt-4 ${
            ytInfo.isShorts
              ? 'max-w-sm mx-auto text-center'
              : 'max-w-5xl mx-auto text-right'
          }`}
        >
          <a
            href={`https://www.youtube.com/watch?v=${ytInfo.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-[0.2em] text-bone/70 hover:text-signal transition-colors inline-flex items-center gap-1"
          >
            Watch on YouTube ↗
          </a>
        </div>
      </div>
    </section>
  );
}
