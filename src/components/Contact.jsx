import { useState, useRef, useEffect } from 'react';
import { personalInfo, socialLinks, contactContent, emailjsConfig } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

/**
 * Contact component
 * Terminal-styled interactive communication hub supporting direct EmailJS
 * integration or automated client mailto fallback with HUD styling.
 */
export default function Contact() {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  // Clear feedback status after 4 seconds
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => {
      setStatus(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [status]);

  // First name for terminal command greeting
  const firstName = (personalInfo.name || '').trim().split(' ')[0]?.toLowerCase() || 'user';

  // Active social platforms with non-empty URLs
  const activeSocials = [
    { label: 'GitHub', url: socialLinks.github },
    { label: 'LinkedIn', url: socialLinks.linkedin },
    { label: 'Instagram', url: socialLinks.instagram },
  ].filter((item) => Boolean(item.url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;

    const form = formRef.current;
    const formData = new FormData(form);
    const userName = formData.get('user_name');
    const userEmail = formData.get('user_email');
    const userMessage = formData.get('message');

    const { serviceId, templateId, publicKey } = emailjsConfig;
    const isConfigured = Boolean(
      serviceId &&
      templateId &&
      publicKey &&
      serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
      templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
      publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY'
    );

    setIsSubmitting(true);

    if (isConfigured) {
      try {
        const emailjs = await import('@emailjs/browser');
        await emailjs.sendForm(serviceId, templateId, form, publicKey);
        setStatus({
          type: 'success',
          text: '✓ Message sent. Talk soon.',
        });
        form.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        setStatus({
          type: 'error',
          text: '✕ Something went wrong. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Direct mailto fallback when credentials are not yet populated
      const subject = encodeURIComponent('Portfolio contact');
      const body = encodeURIComponent(
        `From: ${userName} (${userEmail})\n\nMessage:\n${userMessage}`
      );
      window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`, '_blank');
      setStatus({
        type: 'success',
        text: '✓ Message sent. Talk soon.',
      });
      form.reset();
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="hud-grid px-5 md:px-10 py-28 md:py-40">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        {/* LEFT COLUMN: Section Header, Bio Note, Email & Socials */}
        <div className="flex flex-col gap-8">
          <div>
            <ScrambleText
              text={contactContent.label}
              trigger="view"
              className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold mb-3 block"
            />
            <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-bone">
              {contactContent.heading}
            </h2>
          </div>

          <p className="text-lg text-bone/70 max-w-md font-normal leading-relaxed">
            {contactContent.note}
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <a
              href={`mailto:${personalInfo.email}`}
              className="font-mono text-lg md:text-2xl underline decoration-signal decoration-2 underline-offset-8 text-bone hover:text-signal transition-colors inline-block w-fit focus:outline-none"
            >
              {personalInfo.email}
            </a>

            {personalInfo.phone && (
              <a
                href={`tel:${personalInfo.phone}`}
                className="font-mono text-sm text-dim hover:text-bone transition-colors pt-2 inline-block w-fit"
              >
                {personalInfo.phone}
              </a>
            )}
          </div>

          {/* Social Platforms Directory */}
          {activeSocials.length > 0 && (
            <div className="flex flex-wrap gap-6 pt-4 border-t border-bone/10">
              {activeSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-bone/70 hover:text-signal transition-colors flex items-center gap-1 focus:outline-none"
                >
                  <span>{social.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Terminal Command Form in HUD Frame */}
        <div className="hud-frame border border-bone/10 bg-ink/70 backdrop-blur p-6 md:p-10 flex flex-col gap-8 relative">
          {/* Terminal Command Prompt Header */}
          <div className="font-mono text-xs text-dim flex items-center gap-2 border-b border-bone/10 pb-4">
            <span className="text-signal font-bold">$</span>
            <span>new message --to {firstName}</span>
          </div>

          {/* Terminal Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="user_name"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-medium"
              >
                &gt; name
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                required
                placeholder="Your full name"
                className="bg-transparent border-b border-bone/20 focus:border-signal text-bone placeholder:text-bone/30 font-mono text-sm rounded-none outline-none py-2.5 transition-colors w-full"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="user_email"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-medium"
              >
                &gt; email
              </label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                required
                placeholder="you@example.com"
                className="bg-transparent border-b border-bone/20 focus:border-signal text-bone placeholder:text-bone/30 font-mono text-sm rounded-none outline-none py-2.5 transition-colors w-full"
              />
            </div>

            {/* Message Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-medium"
              >
                &gt; message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about the role or project…"
                className="bg-transparent border-b border-bone/20 focus:border-signal text-bone placeholder:text-bone/30 font-mono text-sm rounded-none outline-none py-2.5 transition-colors w-full resize-none"
              />
            </div>

            {/* Square Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-signal text-ink hover:bg-bone font-mono text-xs font-semibold uppercase tracking-[0.25em] px-6 py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between w-full focus:outline-none group mt-2"
            >
              <span>{isSubmitting ? 'Sending…' : 'Send message'}</span>
              <span
                aria-hidden="true"
                className="text-sm transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </button>

            {/* Accessible Status Message Feedback */}
            <p
              role="status"
              className={`font-mono text-xs min-h-[20px] transition-opacity duration-200 ${
                status?.type === 'success'
                  ? 'text-emerald-400'
                  : status?.type === 'error'
                  ? 'text-red-400'
                  : 'opacity-0'
              }`}
            >
              {status?.text || ''}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
