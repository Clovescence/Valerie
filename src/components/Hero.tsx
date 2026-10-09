import { Reveal, RevealLine } from "./Reveal";
import { EnvironmentWidget } from "./EnvironmentWidget";

const lineMask = "block overflow-hidden px-[0.08em] -mx-[0.08em] pb-[0.16em] -mb-[0.16em]";

export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col">
      <div className="hero-exit container-page relative flex flex-1 flex-col justify-end pb-[clamp(2rem,5vw,4rem)] pt-[calc(var(--header-h)+4rem)]">
        <div className="grid grid-cols-1 items-end gap-y-[clamp(2.5rem,6vw,4rem)] lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-8">
            <Reveal
              as="p"
              className="mb-[clamp(1.25rem,3vw,2rem)] font-mono text-[0.72rem] uppercase tracking-[0.22em] text-sequoia-accent"
            >
              A personal archive of light, sound &amp; passing time
            </Reveal>

            <h1 className="font-serif text-[clamp(3.25rem,1.2rem+8.2vw,8.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-sequoia-light">
              <span className={lineMask}>
                <Reveal as="span" variant="line" delay={120} className="block">
                  What remains
                </Reveal>
              </span>
              <span className={lineMask}>
                <Reveal as="span" variant="line" delay={240} className="block italic text-sequoia-accent">
                  after the moment
                </Reveal>
              </span>
              <span className={lineMask}>
                <Reveal as="span" variant="line" delay={360} className="block">
                  has gone?
                </Reveal>
              </span>
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-3">
            <Reveal delay={400}>
              <EnvironmentWidget />
            </Reveal>
            <Reveal
              as="p"
              delay={520}
              className="mb-[clamp(2rem,4vw,3rem)] max-w-sm text-[1.05rem] leading-relaxed text-sequoia-mute"
            >
              My third attempt at making a place for myself on the internet. A collection of things I pay attention to, built by Haga Pradiva.
            </Reveal>
            <Reveal delay={640}>
              <a
                href="#gallery"
                className="link-arrow group inline-flex items-center gap-4 border-b border-sequoia-border pb-2 font-mono text-[0.78rem] uppercase tracking-[0.2em] transition-colors duration-500 hover:border-sequoia-accent hover:text-sequoia-accent"
              >
                Enter the archive <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          </div>
        </div>

        {/* Exposure rail: lives in the flow, so it can never collide with the content above it. */}
        <div className="relative mt-[clamp(3rem,7vw,5.5rem)] pt-5">
          <RevealLine delay={760} className="absolute inset-x-0 top-0 h-px bg-sequoia-border" />
          <Reveal
            variant="fade"
            delay={820}
            className="flex items-center justify-between gap-6 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-sequoia-light/45"
          >
            <span>+ 01.3 EV</span>
            <span className="hidden items-center gap-3 sm:flex" aria-hidden="true">
              <span className="scroll-cue" />
              Scroll
            </span>
            <span className="flex gap-5">
              <span>ISO 800</span>
              <span>f / 1.4</span>
              <span>1 / 8s</span>
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
