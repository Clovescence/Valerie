import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/** Fires once, the first time an element enters the viewport. */
export function useInView<T extends Element>(rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, rootMargin]);

  return [ref, seen] as const;
}

type RevealProps = {
  as?: ElementType;
  /** Stagger in ms — keep steps small (60–120ms) so a group reads as one gesture. */
  delay?: number;
  variant?: "up" | "fade" | "scale" | "line";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Parks its children invisibly until the intro is done AND they scroll into view.
 * The actual choreography lives in CSS (`.reveal`) so it stays on the compositor.
 */
export function Reveal({ as, delay = 0, variant = "up", className = "", style, children }: RevealProps) {
  const Tag: ElementType = as ?? "div";
  const [ref, seen] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-visible={seen}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** A hairline that draws itself from left to right. */
export function RevealLine({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-visible={seen}
      className={`reveal-line ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    />
  );
}
