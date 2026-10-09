import { Reveal, RevealLine } from "./Reveal";

const linkClass =
  "link-arrow group flex w-full max-w-[15rem] items-center justify-between py-1 transition-colors duration-500 hover:text-sequoia-accent";

export function Footer() {
  return (
    <footer className="relative z-10 pb-10 pt-[var(--section-space)]">
      <div className="container-page">
        <div className="relative pb-[clamp(3rem,6vw,5rem)]">
          <RevealLine className="absolute inset-x-0 top-0 h-px bg-sequoia-border" />
          <div className="grid grid-cols-1 gap-y-16 pt-[clamp(3rem,6vw,5rem)] md:grid-cols-12 md:gap-x-8">
            <div className="md:col-span-6">
              <Reveal as="span" className="mb-5 block font-mono text-[0.72rem] uppercase tracking-[0.22em] text-sequoia-accent">
                Stay in the frame
              </Reveal>
              <Reveal
                as="h2"
                delay={100}
                className="bg-gradient-to-br from-sequoia-light via-sequoia-mute to-sequoia-accent bg-clip-text font-serif text-[clamp(3rem,1.2rem+6.4vw,7rem)] font-normal leading-none tracking-[-0.02em] text-transparent"
              >
                AFTERIMAGE
              </Reveal>
            </div>

            <Reveal delay={160} className="md:col-span-3">
              <p className="mb-6 border-b border-sequoia-border pb-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-sequoia-accent">
                Elsewhere
              </p>
              <div className="flex flex-col gap-3 font-mono text-[0.74rem] uppercase tracking-[0.2em]">
                <a href="https://instagram.com/hagapradiva" target="_blank" rel="noreferrer" className={linkClass}>
                  Instagram <span aria-hidden="true">↗</span>
                </a>
                <a href="https://github.com/Clovescence" target="_blank" rel="noreferrer" className={linkClass}>
                  GitHub <span aria-hidden="true">↗</span>
                </a>
                <a href="https://open.spotify.com/user/dav6z2wtexqello99ulntvsv9?si=5b963c0a41714dec" target="_blank" rel="noreferrer" className={linkClass}>
                  Spotify <span aria-hidden="true">↗</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={240} className="flex flex-col justify-between gap-16 md:col-span-3">
              <div>
                <p className="mb-6 border-b border-sequoia-border pb-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-sequoia-accent">
                  Write to me
                </p>
                <a
                  href="mailto:hagapradiva05@gmail.com"
                  className="link-arrow flex w-full max-w-[17rem] items-center justify-between gap-3 font-mono text-[0.74rem] uppercase tracking-[0.2em] transition-colors duration-500 hover:text-sequoia-accent"
                >
                  hagapradiva05@gmail.com <span aria-hidden="true">↗</span>
                </a>
              </div>
              <a
                href="#top"
                className="link-arrow is-up w-max font-mono text-[0.72rem] uppercase tracking-[0.2em] text-sequoia-light/60 transition-colors duration-500 hover:text-sequoia-accent"
              >
                Back to the beginning <span aria-hidden="true">↑</span>
              </a>
            </Reveal>
          </div>
        </div>

        <Reveal
          variant="fade"
          className="flex flex-col items-start justify-between gap-4 border-t border-sequoia-border pt-8 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-sequoia-accent md:flex-row md:items-center"
        >
          <span>© {new Date().getFullYear()} Afterimage</span>
          <span className="normal-case italic text-sequoia-light/50">Images linger longer than moments.</span>
          <span>Built with memory &amp; light</span>
        </Reveal>
      </div>
    </footer>
  );
}
