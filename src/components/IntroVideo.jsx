import { useState, useEffect, useRef } from 'react';
import { introVideo } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

/**
 * Format video URL for embedding when an external link is provided.
 */
function getEmbedUrl(url) {
  if (!url) return '';

  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }

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
 * Displays a technical HUD video viewfinder preview that expands into
 * a focused modal player with sound, telemetry badges, and full controls.
 */
export default function IntroVideo() {
  const [isOpen, setIsOpen] = useState(false);
  const modalVideoRef = useRef(null);

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

  // Autoplay modal video when opened
  useEffect(() => {
    if (isOpen && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {
        // Handle browser autoplay policy gracefully
      });
    }
  }, [isOpen]);

  const rawUrl = introVideo?.videoUrl || introVideo?.youtubeUrl;
  if (!rawUrl) {
    return null;
  }

  const isLocalVideo = rawUrl.endsWith('.mp4') || rawUrl.endsWith('.webm') || rawUrl.startsWith('/');
  const embedUrl = isLocalVideo ? rawUrl : getEmbedUrl(rawUrl);

  return (
    <section id="intro" className="w-full px-5 md:px-10 py-24 md:py-36 border-t border-bone/5">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Description & Telemetry Log */}
          <div className="flex flex-col">
            <ScrambleText
              text={introVideo.label || '02 / Intro'}
              trigger="view"
              className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold block mb-3"
            />
            <h2 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone mb-6">
              {introVideo.heading}
            </h2>
            {introVideo.description && (
              <p className="text-base md:text-lg text-bone/70 leading-relaxed font-normal mb-8 max-w-xl">
                {introVideo.description}
              </p>
            )}

            {/* HUD Telemetry Data Panel */}
            <div className="hud-frame border border-bone/10 bg-panel/40 p-5 max-w-xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                AV_TELEMETRY // STREAM_INFO
              </div>
              <dl className="grid grid-cols-2 gap-y-2 gap-x-4 font-mono text-xs text-bone/70">
                <div>
                  <dt className="text-[10px] text-dim uppercase tracking-wider">Feed Type</dt>
                  <dd className="text-bone font-medium">Self-Introduction</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-dim uppercase tracking-wider">Resolution</dt>
                  <dd className="text-bone font-medium">720 × 1280 (9:16)</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-dim uppercase tracking-wider">Frame Rate</dt>
                  <dd className="text-bone font-medium">24.00 FPS</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-dim uppercase tracking-wider">Audio</dt>
                  <dd className="text-bone font-medium">Stereo Active</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column: Interactive HUD Viewfinder Card */}
          <div className="flex justify-center lg:justify-end">
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
              className="hud-frame aspect-[9/16] w-full max-w-[320px] md:max-w-[340px] border border-bone/20 bg-ink relative overflow-hidden group cursor-pointer transition-all duration-300 hover:border-signal focus:outline-none shadow-2xl"
              data-cursor="hot"
              aria-label="Play self-introduction video"
            >
              {/* Background Video Preview (Muted Loop) */}
              {isLocalVideo ? (
                <video
                  src={rawUrl}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover filter contrast-[1.08] brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 pointer-events-none"
                />
              ) : (
                <div className="absolute inset-0 bg-ink flex items-center justify-center font-mono text-xs text-dim">
                  EXTERNAL FEED
                </div>
              )}

              {/* Faint HUD Grid Overlay */}
              <div className="hud-grid absolute inset-0 opacity-30 group-hover:opacity-10 transition-opacity pointer-events-none" />

              {/* Top HUD Telemetry Bar */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 font-mono text-[10px] tracking-[0.2em] bg-ink/80 px-2.5 py-1 border border-bone/10 backdrop-blur-sm">
                <span className="flex items-center gap-1.5 text-signal font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                  REC ●
                </span>
                <span className="text-dim">00:10 // LIVE</span>
              </div>

              {/* Centered HUD Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-16 h-16 md:w-20 md:h-20 border border-signal bg-ink/90 backdrop-blur-sm flex items-center justify-center text-signal group-hover:bg-signal group-hover:text-ink transition-all duration-300 transform group-hover:scale-110 shadow-2xl">
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

              {/* Bottom HUD Telemetry Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 font-mono text-[10px] tracking-[0.2em] bg-ink/80 px-2.5 py-1 border border-bone/10 backdrop-blur-sm">
                <span className="text-bone/80">SIVA.MP4</span>
                <span className="text-signal font-semibold">CLICK TO PLAY ↗</span>
              </div>
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
          className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          {/* Close Button (✕) */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 md:top-8 md:right-8 z-30 w-12 h-12 border border-bone/20 bg-ink hover:border-signal text-bone hover:text-signal font-mono text-xl flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close video player"
          >
            ✕
          </button>

          {/* Modal Container */}
          <div className="hud-frame border border-bone/20 bg-panel/95 p-3 md:p-4 max-h-[92vh] flex flex-col items-center justify-center relative shadow-2xl">
            {/* Modal HUD Header */}
            <div className="w-full flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-dim pb-2.5 mb-2 border-b border-bone/10">
              <span className="text-signal font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                PLAYBACK // SIVA_NAGIREDDY_MULE
              </span>
              <span className="hidden sm:inline">ESC TO EXIT</span>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-[9/16] max-h-[75vh] w-auto bg-black border border-bone/10 overflow-hidden flex items-center justify-center">
              {isLocalVideo ? (
                <video
                  ref={modalVideoRef}
                  src={rawUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={embedUrl}
                  title="Siva NagiReddy Mule — Introduction Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>

            {/* Modal HUD Footer */}
            <div className="w-full font-mono text-[10px] uppercase tracking-[0.2em] text-dim pt-2 mt-1 flex justify-between items-center">
              <span>AUDIO ACTIVE</span>
              <span className="text-signal">SIGNAL HUD PLAYER</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
