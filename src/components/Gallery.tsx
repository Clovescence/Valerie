import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { gallery } from "../data/mock";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const OFFSETS = [-3, -2, -1, 0, 1, 2, 3] as const;
const SLOT_COUNT = OFFSETS.length;
/** Must stay in step with the rope animation in analog.css (1.4s) — this is only a safety net. */
const MOVE_MS = 1400;
const SWIPE_PX = 48;

const wrap = (index: number, length: number) => ((index % length) + length) % length;
const pad = (n: number) => String(n).padStart(2, "0");

type Dir = -1 | 0 | 1;

export function Gallery() {
  /* `cursor` is an unbounded integer. Each polaroid is keyed by its *virtual* index, so a
     node keeps its identity for its whole life on the rope (no remounts, no image reloads).
     Only the lookup into `gallery` wraps. */
  const [cursor, setCursor] = useState(0);
  const [pending, setPending] = useState<Dir>(0);
  const pendingRef = useRef<Dir>(0);
  const timer = useRef<number | undefined>(undefined);
  const dragStart = useRef<number | null>(null);

  const commit = useCallback(() => {
    const dir = pendingRef.current;
    if (!dir) return;
    pendingRef.current = 0;
    window.clearTimeout(timer.current);
    setCursor((c) => c + dir);
    setPending(0);
  }, []);

  const move = useCallback(
    (dir: 1 | -1) => {
      if (pendingRef.current) return;
      pendingRef.current = dir;
      setPending(dir);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(commit, MOVE_MS + 400);
    },
    [commit],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onPointerDown = (e: ReactPointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) >= SWIPE_PX) move(dx < 0 ? 1 : -1);
  };

  const shown = wrap(cursor + pending, gallery.length) + 1;

  return (
    <section id="gallery" className="section-pad relative overflow-x-clip" aria-roledescription="carousel" aria-label="Photographs">
      <SectionHeader
        index="01"
        label="Contact sheets"
        title={
          <>
            Light, held <em className="text-sequoia-accent">briefly.</em>
          </>
        }
        meta={
          <span aria-live="polite">
            {pad(shown)} — {pad(gallery.length)}
          </span>
        }
      />

      <Reveal variant="fade" delay={120}>
        <div
          className="relative mx-auto w-full max-w-[1600px]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (dragStart.current = null)}
          style={{ touchAction: "pan-y" }}
        >
          <div className="rope" />
          <div
            className={`photo-line ${pending === 1 ? "rope-moving-next" : pending === -1 ? "rope-moving-previous" : ""}`}
            onAnimationEnd={(event) => {
              if (event.currentTarget === event.target) commit();
            }}
          >
            {OFFSETS.map((offset, position) => {
              const virtual = cursor + offset;
              const photo = gallery[wrap(virtual, gallery.length)];
              /* While the rope slides, each polaroid already takes the opacity of the slot it is
                 travelling TO. When the slide commits, slot === effective slot: nothing changes. */
              const effective = position - pending;
              const slot = effective < 0 ? "neg" : effective > SLOT_COUNT - 1 ? "over" : effective;
              return (
                <figure
                  key={virtual}
                  className={`polaroid polaroid-variant-${wrap(virtual, 5)} polaroid-slot-${slot}`}
                  aria-hidden={position === 0 || position === SLOT_COUNT - 1}
                >
                  <span className="peg" aria-hidden="true" />
                  <div className="photo-frame">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      draggable={false}
                      decoding="async"
                      loading={position === 0 || position === SLOT_COUNT - 1 ? "lazy" : "eager"}
                    />
                    <span className="photo-burn" />
                  </div>
                  <figcaption>
                    <span>{photo.title}</span>
                    <small>{photo.date}</small>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal className="container-page mt-[clamp(1.5rem,4vw,3rem)]" delay={80}>
        <div className="grid grid-cols-2 items-center gap-y-6 border-t border-sequoia-border pt-6 font-mono text-[0.78rem] uppercase tracking-[0.2em] md:grid-cols-[1fr_auto_1fr]">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={pending !== 0}
            className="link-arrow is-prev flex w-max items-center gap-3 py-2 transition-colors duration-500 hover:text-sequoia-accent disabled:opacity-40"
          >
            <span aria-hidden="true">←</span> Previous
          </button>
          <p className="order-last col-span-2 text-center text-[0.68rem] text-sequoia-accent/70 md:order-none md:col-span-1">
            Pull the thread in either direction. It never ends.
          </p>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={pending !== 0}
            className="link-arrow flex w-max items-center gap-3 justify-self-end py-2 transition-colors duration-500 hover:text-sequoia-accent disabled:opacity-40"
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      </Reveal>
    </section>
  );
}
