import type { ReactNode } from "react";
import { Reveal, RevealLine } from "./Reveal";

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  meta?: ReactNode;
};

/** The one section header every chapter shares — same grid, same baseline, same choreography. */
export function SectionHeader({ index, label, title, meta }: Props) {
  return (
    <div className="container-page section-head-gap">
      <div className="relative grid grid-cols-1 items-baseline gap-x-8 gap-y-5 pb-8 md:grid-cols-12 md:pb-10">
        <Reveal className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-sequoia-accent md:col-span-3">
          {index} / {label}
        </Reveal>
        <Reveal
          as="h2"
          delay={90}
          className="font-serif text-[clamp(2.5rem,1.4rem+3.6vw,4.5rem)] font-normal leading-[1.04] tracking-[-0.01em] md:col-span-6"
        >
          {title}
        </Reveal>
        <Reveal delay={180} className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-sequoia-light/55 md:col-span-3 md:text-right">
          {meta}
        </Reveal>
        <RevealLine delay={240} className="absolute inset-x-0 bottom-0 h-px bg-sequoia-border" />
      </div>
    </div>
  );
}
