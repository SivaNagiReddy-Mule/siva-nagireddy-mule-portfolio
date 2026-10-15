import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

gsap.registerPlugin(ScrollTrigger);

// Dynamically discover all local project cover assets
const projectImages = import.meta.glob('../assets/projects/*.(png|jpg|jpeg|webp|svg)', {
  eager: true,
  import: 'default',
});

function getProjectImage(id) {
  if (!id) return null;
  const match = Object.entries(projectImages).find(([path]) => {
    const filename = path.split('/').pop() || '';
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
    return nameWithoutExt.toLowerCase() === id.toLowerCase();
  });
  return match ? match[1] : null;
}

/**
 * ProjectCard component
 * Individual project tile with cover hover effect, badge, tags, and action links.
 */
function ProjectCard({ project }) {
  const coverSrc = getProjectImage(project.id);

  return (
    <article
      className="group border border-bone/10 bg-panel/60 w-full md:w-[min(560px,42vw)] shrink-0 flex flex-col justify-between transition-colors duration-200"
      data-cursor="hot"
    >
      {/* Cover Showcase Area */}
      <div className="aspect-[16/10] md:aspect-[16/8] border-b border-bone/10 bg-ink overflow-hidden relative">
        {/* Top-left number & year badge */}
        <div className="absolute top-3 left-3 z-10 bg-ink/80 font-mono text-[10px] uppercase tracking-[0.25em] text-signal px-2.5 py-1 border border-bone/10">
          {project.number} / {project.year}
        </div>

        {coverSrc ? (
          <img
            src={coverSrc}
            alt={project.title}
            className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="hud-grid w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim group-hover:text-signal transition-colors">
              {project.id}
            </span>
          </div>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-1 gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone group-hover:text-signal transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-sm md:text-base text-bone/70 leading-relaxed font-normal">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col gap-6 pt-2">
          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-dim">
              {project.tags.map((tag) => (
                <span key={tag}>
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* Action Links */}
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-signal text-ink hover:bg-bone font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 transition-colors focus:outline-none"
              >
                Live ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-bone/30 text-bone hover:border-signal hover:text-signal font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 transition-colors focus:outline-none"
              >
                Code ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Projects component
 * Desktop horizontal sliding portfolio track and responsive mobile vertical list.
 */
export default function Projects() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop horizontal pinning scroll
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      const progressBar = progressRef.current;
      if (!track || !section) return;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + getDistance(),
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBar) {
              gsap.set(progressBar, { scaleX: self.progress });
            }
          },
        },
      });

      // Refresh ScrollTrigger calculations once layout dimensions settle
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => clearTimeout(timer);
    });

    return () => mm.revert();
  }, []);

  const projectCount = projects?.length || 0;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full overflow-hidden py-24 md:py-0 md:h-screen md:flex md:flex-col md:justify-center md:pt-20 md:pb-6"
    >
      {/* Section Header Row */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <ScrambleText
            text="02 / Selected work"
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold mb-2 block"
          />
          <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] text-bone">
            Projects
          </h2>
        </div>

        {/* Right metadata counter */}
        <div className="hidden md:block font-mono text-xs text-dim uppercase tracking-[0.2em]">
          {projectCount} projects · scroll →
        </div>
      </div>

      {/* Projects Track */}
      <div
        ref={trackRef}
        className="flex flex-col gap-6 px-5 md:flex-row md:w-max md:gap-8 md:px-10"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Desktop Scroll Progress Indicator */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 mt-8 hidden md:block">
        <div className="h-0.5 w-full bg-bone/10 overflow-hidden">
          <div
            ref={progressRef}
            className="h-full w-full bg-signal origin-left scale-x-0"
          />
        </div>
      </div>
    </section>
  );
}
