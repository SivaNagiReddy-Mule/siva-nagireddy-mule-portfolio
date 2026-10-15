import { useState, useEffect } from 'react';
import { personalInfo, navLinks, heroContent } from '../data/portfolioData';

/**
 * Helper to compute up to 3 uppercase initials from a brand name
 */
function getInitials(name) {
  if (!name) return 'HUD';
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .slice(0, 3)
    .join('');
}

/**
 * Format 24-hour time for a specified IANA timezone
 */
function formatTime(timeZone) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timeZone || 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString('en-GB', { hour12: false });
  }
}

/**
 * Hud component
 * Technical HUD header bar with initials badge, rotating status,
 * live timezone clock, and mobile dropdown navigation.
 */
export default function Hud() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => formatTime(personalInfo.timezone));

  // Initials badge text
  const initials = getInitials(personalInfo.brandName);

  // Monitor scroll offset to transition background styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotate hero status lines every 3.5 seconds
  useEffect(() => {
    const lines = heroContent.statusLines || [];
    if (lines.length <= 1) return;

    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % lines.length);
    }, 3500);

    return () => clearInterval(statusInterval);
  }, []);

  // Update live clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(formatTime(personalInfo.timezone));
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const showSolidBar = isScrolled || mobileMenuOpen;
  const currentStatus = heroContent.statusLines?.[statusIndex] || '';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full h-16 transition-all duration-300 ${
        showSolidBar
          ? 'bg-ink/80 backdrop-blur-md border-b border-bone/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 h-full flex items-center justify-between">
        {/* Left: Brand / Initials Badge */}
        <a
          href="#home"
          className="flex items-center gap-3 group focus:outline-none"
          aria-label={`${personalInfo.brandName} - Return to top`}
        >
          <div className="w-8 h-8 flex items-center justify-center border border-signal font-mono text-xs font-semibold text-signal transition-transform duration-200 group-hover:scale-105">
            {initials}
          </div>
          <span className="hidden sm:inline font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors group-hover:text-signal">
            {personalInfo.brandName}
          </span>
        </a>

        {/* Centre: Rotating Status Line (lg and up) */}
        {currentStatus && (
          <div
            className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 border border-bone/10 bg-panel/60"
            aria-live="polite"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              {currentStatus}
            </span>
          </div>
        )}

        {/* Right: Desktop Navigation & Live Clock (md and up) */}
        <div className="hidden md:flex items-center gap-7">
          <nav className="flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className="flex items-center gap-2 pl-6 border-l border-bone/10 font-mono text-xs text-dim tabular-nums"
            title={personalInfo.timezone}
          >
            <span className="text-[10px] uppercase tracking-wider text-bone/40">HUD CLOCK</span>
            <span className="text-bone/80">{currentTime}</span>
          </div>
        </div>

        {/* Mobile: Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden font-mono text-xs uppercase tracking-[0.18em] text-bone hover:text-signal py-2 px-3 border border-bone/10 transition-colors"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-hud-menu"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-hud-menu"
          className="md:hidden fixed top-16 inset-x-0 bg-ink/95 backdrop-blur-lg border-b border-bone/10 px-6 py-6 shadow-2xl flex flex-col transition-all"
        >
          <nav className="flex flex-col" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-semibold border-b border-bone/10 py-4 text-bone hover:text-signal transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-6 flex justify-between items-center font-mono text-xs text-dim">
            <span>{personalInfo.city}</span>
            <span className="tabular-nums" title={personalInfo.timezone}>
              {currentTime}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
