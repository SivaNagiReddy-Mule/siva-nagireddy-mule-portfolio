import { useState, useEffect } from 'react';
import { introVideo } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

/**
 * Format video URL for embedding in an iframe
 * Supports Google Drive preview and YouTube embed formats.
 */
function getEmbedUrl(url) {
  if (!url) return '';

  // Google Drive file link
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }

  // YouTube standard or short links
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
    const ytIdMatch = url.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytIdMatch && ytIdMatch[1]) {
      return `https://www.youtube.com/embed/${ytIdMatch[1]}?autoplay=1`;
    }
  }

  return url;
}

/**
 * IntroVideo component
 * Displays a technical HUD video teaser that expands into a focused
 * modal player on click, supporting Escape key, click-outside, and close triggers.
 */
export default function IntroVideo() {
  const [isOpen, setIsOpen] = useState(false);

  // Close modal when Escape key is pressed
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!introVideo || !introVideo.youtubeUrl) {
    return null;
  }

  const embedUrl = getEmbedUrl(introVideo.youtubeUrl);

  return (
    <section id="intro" className="w-full px-5 md:px-10 py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col gap-3 mb-10">
          <ScrambleText
            text={introVideo.label || 'Intro'}
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold block"
          />
          <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone">
            {introVideo.heading}
          </h2>
          {introVideo.description && (
            <p className="text-lg text-bone/70 max-w-2xl font-normal leading-relaxed pt-1">
              {introVideo.description}
            </p>
          )}
        </div>

        {/* Video Teaser Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
          className="hud-frame aspect-video w-full max-w-4xl mx-auto border border-bone/10 bg-panel/60 overflow-hidden relative group cursor-pointer flex items-center justify-center transition-all duration-300 hover:border-signal/50 focus:outline-none"
          data-cursor="hot"
          aria-label="Play self-introduction video"
        >
          {/* Subtle Grid Canvas Backdrop */}
          <div className="hud-grid absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" />

          {/* Top-left & Bottom-right HUD telemetry badges */}
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim absolute top-3 left-4 z-10 pointer-events-none select-none">
            STREAM · SELF_INTRO.MP4
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim absolute bottom-3 right-4 z-10 pointer-events-none select-none">
            SIGNAL ACTIVE
          </span>

          {/* Centered Play Button */}
          <div className="relative flex items-center justify-center z-10">
            <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-signal opacity-25 group-hover:opacity-40" />
            <div className="w-16 h-16 md:w-20 md:h-20 border border-signal bg-ink/90 flex items-center justify-center text-signal group-hover:bg-signal group-hover:text-ink transition-all duration-300 transform group-hover:scale-105 shadow-xl">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 md:w-9 md:h-9 ml-1"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Video Player */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Self-introduction video player"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
          className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 transition-opacity"
        >
          {/* Close Button (✕) */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-20 w-11 h-11 border border-bone/20 bg-ink hover:border-signal text-bone hover:text-signal font-mono text-xl flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close video player"
          >
            ✕
          </button>

          {/* Video Iframe Container */}
          <div className="aspect-video w-full max-w-5xl border border-bone/20 bg-black relative shadow-2xl overflow-hidden">
            <iframe
              src={embedUrl}
              title="Siva NagiReddy Mule — Introduction Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </section>
  );
}
