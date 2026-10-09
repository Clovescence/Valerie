import { useCallback, useEffect, useState } from "react";
import { Intro } from "./components/Intro";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Gallery } from "./components/Gallery";
import { ListeningRoom } from "./components/ListeningRoom";
import { Diary } from "./components/Diary";
import { Traces } from "./components/Traces";
import { Footer } from "./components/Footer";
import { initScroll, lockScroll } from "./lib/scroll";

/** Intro choreography (ms). The camera flash dissolves from ~4150ms; content blooms underneath it. */
const READY_AT = 4600;
const REMOVE_AT = 5600;
const SKIP_FADE = 900;

export default function App() {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [ready, setReady] = useState(reduced);
  const [introMounted, setIntroMounted] = useState(!reduced);
  const [leaving, setLeaving] = useState(false);

  /* Always begin at the top: the intro is the front door. */
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => initScroll(), []);

  useEffect(() => {
    if (reduced) return;
    lockScroll("intro", true);
    const a = window.setTimeout(() => setReady(true), READY_AT);
    const b = window.setTimeout(() => setIntroMounted(false), REMOVE_AT);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [reduced]);

  /* Release the scroll lock the moment the content is revealed. */
  useEffect(() => {
    if (ready) lockScroll("intro", false);
  }, [ready]);

  const skip = useCallback(() => {
    setLeaving(true);
    setReady(true);
    window.setTimeout(() => setIntroMounted(false), SKIP_FADE);
  }, []);

  return (
    <>
      {introMounted && <Intro leaving={leaving} onSkip={skip} />}
      <div id="top" data-ready={ready} inert={!ready}>
        <div className="ambient" aria-hidden="true" />

        <div className="af-progress" aria-hidden="true" />
        <Header />
        <main className="relative z-10">
          <Hero />
          <Gallery />
          <ListeningRoom />
          <Diary />
          <Traces />
        </main>
        <Footer />
      </div>
    </>
  );
}
