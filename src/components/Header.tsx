import { useEffect, useRef, useState } from "react";
import { lockScroll } from "../lib/scroll";

const links = [
  { href: "#gallery", id: "gallery", label: "Photographs" },
  { href: "#listening", id: "listening", label: "Listening" },
  { href: "#diary", id: "diary", label: "Diary" },
  { href: "#traces", id: "traces", label: "Traces" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>("");
  const openRef = useRef(open);
  openRef.current = open;

  /* Must release the lock *synchronously*: Lenis ignores scrollTo() while stopped, and its
     window-level click handler runs right after React's root handler. */
  const closeMenu = () => {
    lockScroll("menu", false);
    setOpen(false);
  };

  /* Scrolled / hide-on-down / show-on-up — one rAF-throttled listener. */
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      setScrolled(y > 24);
      if (y < 120 || openRef.current) setHidden(false);
      else if (dy > 6) setHidden(true);
      else if (dy < -6) setHidden(false);
      if (Math.abs(dy) > 6) lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-spy: highlight whichever chapter crosses the middle of the viewport. */
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const hero = document.getElementById("hero");
    const heroIo = hero
      ? new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), { rootMargin: "-45% 0px -50% 0px" })
      : null;
    if (hero) heroIo?.observe(hero);
    return () => {
      io.disconnect();
      heroIo?.disconnect();
    };
  }, []);

  /* Menu: lock scroll, close on Escape, close when growing past the mobile breakpoint. */
  useEffect(() => {
    lockScroll("menu", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <>
      <header className={`af-header ${scrolled ? "is-scrolled" : ""} ${hidden && !open ? "is-hidden" : ""}`}>
        <div className="container-page af-header__inner flex items-center justify-between">
          <a
            href="#top"
            onClick={closeMenu}
            className="relative z-[60] font-sans text-[1.05rem] font-medium uppercase tracking-[0.28em] text-sequoia-light transition-opacity duration-500 hover:opacity-70"
          >
            AFTER<span className="opacity-50">IMAGE</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <a key={l.id} href={l.href} className="af-nav-link" aria-current={active === l.id ? "true" : undefined}>
                {l.label}
              </a>
            ))}
          </nav>

          <span className="hidden font-mono text-[0.68rem] tracking-[0.2em] text-sequoia-light/40 md:block">EST. MMXXV</span>

          <button
            type="button"
            className="af-burger relative z-[60] -mr-2 flex h-10 w-10 flex-col items-center justify-center gap-[5px] px-2 text-sequoia-light md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`af-menu md:hidden ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {links.map((l, i) => (
          <a
            key={l.id}
            href={l.href}
            tabIndex={open ? 0 : -1}
            style={{ "--i": i } as React.CSSProperties}
            onClick={closeMenu}
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
