import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

/**
 * ScrambleText component
 * Provides a technical decode/scramble effect with screen reader accessibility.
 *
 * @param {string} text - The original text to display and decode
 * @param {string} [as='span'] - The HTML tag to render
 * @param {string} [className=''] - Optional CSS classes
 * @param {number} [delay=0] - Delay in ms before starting the scramble animation
 * @param {number} [speed=30] - Speed in ms per animation tick
 * @param {'view'|'mount'} [trigger='view'] - When to trigger the scramble effect
 */
export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  delay = 0,
  speed = 30,
  trigger = 'view',
}) {
  const [display, setDisplay] = useState(text);
  const containerRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !text) return;

    let intervalId = null;
    let timeoutId = null;
    let observer = null;

    const play = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;

      timeoutId = setTimeout(() => {
        let frame = 0;
        const totalChars = text.length;

        intervalId = setInterval(() => {
          frame++;
          const lockedCount = Math.floor(frame / 2);

          let output = '';
          for (let i = 0; i < totalChars; i++) {
            if (text[i] === ' ') {
              output += ' ';
            } else if (i < lockedCount) {
              output += text[i];
            } else {
              output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
          }

          setDisplay(output);

          if (lockedCount >= totalChars) {
            clearInterval(intervalId);
            intervalId = null;
            setDisplay(text);
          }
        }, speed);
      }, delay);
    };

    if (trigger === 'mount') {
      play();
    } else {
      const el = containerRef.current;
      if (!el) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
              play();
              if (observer) {
                observer.disconnect();
                observer = null;
              }
            }
          });
        },
        { threshold: 0.4 }
      );

      observer.observe(el);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      if (observer) observer.disconnect();
    };
  }, [text, delay, speed, trigger]);

  return (
    <Tag ref={containerRef} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
