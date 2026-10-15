import { personalInfo, socialLinks, navLinks, footerContent, academy } from '../data/portfolioData';

// Static year constant for pure rendering
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer component
 * Comprehensive page footer featuring navigation directories, social endpoints,
 * dynamic brand watermark, and formal placement training attribution.
 */
export default function Footer() {

  // Active social platforms with non-empty URLs
  const activeSocials = [
    { label: 'GitHub', url: socialLinks.github },
    { label: 'LinkedIn', url: socialLinks.linkedin },
    { label: 'Instagram', url: socialLinks.instagram },
  ].filter((item) => Boolean(item.url));

  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 md:px-10 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Three-Column Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          {/* Column 1: Navigate */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
              Navigate
            </span>
            <nav className="flex flex-col gap-2.5" aria-label="Footer Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-bone/75 hover:text-signal transition-colors text-sm w-fit focus:outline-none"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 2: Elsewhere */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
              Elsewhere
            </span>
            <div className="flex flex-col gap-2.5">
              {activeSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone/75 hover:text-signal transition-colors text-sm flex items-center gap-1 w-fit focus:outline-none"
                >
                  <span>{social.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Say hello */}
          <div className="flex flex-col md:items-end gap-3 md:text-right">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
              Say hello
            </span>
            <div className="flex flex-col md:items-end gap-1.5">
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-bone/75 hover:text-signal transition-colors text-sm font-mono focus:outline-none"
              >
                {personalInfo.email}
              </a>
              <span className="font-mono text-xs text-dim">
                {personalInfo.city}
              </span>
            </div>
          </div>
        </div>

        {/* Brand Name Watermark */}
        <div
          aria-hidden="true"
          className="w-full text-center overflow-hidden my-6 md:my-10 select-none pointer-events-none"
        >
          <span className="block uppercase whitespace-nowrap text-[13.5vw] font-bold leading-none tracking-[-0.05em] text-bone/[0.07]">
            {personalInfo.brandName}
          </span>
        </div>

        {/* Bottom Attribution & Copyright Row */}
        <div className="border-t border-bone/10 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-dim flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <span>
            © {CURRENT_YEAR} {personalInfo.name} · {footerContent.tagline}
          </span>
          <span>
            Trained at{' '}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-signal transition-colors"
            >
              {academy.name}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
