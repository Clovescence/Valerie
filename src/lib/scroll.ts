import Lenis from "lenis";

/**
 * Single owner of page scrolling.
 *
 * - Inertial wheel scrolling (Lenis) for a silky feel; native touch scrolling is left
 *   alone on purpose so phones keep their own momentum physics.
 * - Anchor links glide with the same easing as the rest of the site.
 * - Any number of things (intro, mobile menu…) can lock scroll independently via
 *   named locks; the page unlocks only when every lock is released.
 * - Respects `prefers-reduced-motion`: no Lenis, anchors jump natively.
 */

let lenis: Lenis | null = null;
const locks = new Set<string>();

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function applyLocks() {
  const locked = locks.size > 0;
  document.documentElement.classList.toggle("scroll-locked", locked);
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export function initScroll(): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => undefined;
  }
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.09,
    wheelMultiplier: 0.95,
    smoothWheel: true,
    anchors: { offset: 0, duration: 1.7, easing: easeOutExpo },
  });
  applyLocks();
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function lockScroll(reason: string, locked: boolean) {
  if (locked) locks.add(reason);
  else locks.delete(reason);
  applyLocks();
}

export function scrollToTop(immediate = false) {
  if (lenis) lenis.scrollTo(0, { immediate, duration: 1.6, easing: easeOutExpo });
  else window.scrollTo({ top: 0, behavior: immediate ? "instant" : "smooth" });
}
