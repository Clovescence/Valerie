import { useState, useEffect, useCallback, type FormEvent, type CSSProperties } from "react";
import { Trace } from "../types";
import { demoTraces } from "../data/mock";
import { apiEnabled, apiUrl } from "../lib/api";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const STORAGE_KEY = "afterimage-traces";
const TILTS = ["1deg", "-1.2deg", "-0.6deg", "1.4deg", "0.5deg", "-1deg"];

const readSaved = (): Trace[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export function Traces() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const loadTraces = useCallback(async () => {
    if (apiEnabled) {
      try {
        const response = await fetch(apiUrl("/api/traces"));
        if (!response.ok) throw new Error("offline");
        const data = await response.json();
        setTraces(data.traces || []);
        return;
      } catch {
        /* fall through to the browser copy */
      }
    }
    setTraces(readSaved());
  }, []);

  useEffect(() => {
    loadTraces();
  }, [loadTraces]);

  const submitTrace = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("Developing your trace…");

    const trace: Trace = {
      id: crypto.randomUUID(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    let saved = false;
    if (apiEnabled) {
      try {
        const response = await fetch(apiUrl("/api/traces"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trace),
        });
        if (!response.ok) throw new Error("offline");
        await loadTraces();
        setStatus("Your trace was left behind.");
        saved = true;
      } catch {
        /* handled below */
      }
    }
    if (!saved) {
      const next = [trace, ...readSaved()].slice(0, 24);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setTraces(next);
      setStatus("Saved in this browser.");
    }

    setName("");
    setMessage("");
  };

  const isPreview = traces.length === 0;
  const allTraces = isPreview ? demoTraces : traces;
  const recentTraces = allTraces.slice(0, 4);
  const archiveTraces = allTraces.slice(4);

  return (
    <section id="traces" className="section-pad relative overflow-x-clip">
      <SectionHeader
        index="04"
        label="Traces"
        title={
          <>
            Proof you were <em className="text-sequoia-accent">here.</em>
          </>
        }
        meta={isPreview ? "Preview traces" : "Guestbook / D1"}
      />

      <div className="container-page">
        <div className="grid grid-cols-1 gap-[clamp(3.5rem,8vw,6rem)] lg:grid-cols-12 lg:items-start">
          <Reveal className="relative z-10 lg:col-span-5">
              <div className="relative mb-10 overflow-hidden rounded-md border border-white/5 bg-white/5 p-[clamp(1.75rem,4vw,2.5rem)] shadow-inner backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
                <p className="relative z-10 mb-8 font-serif text-[1.75rem] leading-tight text-white/90">Leave something small behind.</p>

                <label className="relative z-10 mb-7 block">
                  <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-sequoia-accent/80">Your name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={40}
                    placeholder="Anonymous, if you prefer"
                    required
                    autoComplete="name"
                    className="field w-full border-b border-white/10 bg-transparent py-3 font-mono text-sm text-sequoia-light placeholder:text-white/20 focus:border-sequoia-accent focus:outline-none"
                  />
                </label>

                <label className="relative z-10 mb-8 block">
                  <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-sequoia-accent/80">Your trace</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    maxLength={220}
                    placeholder="A thought, a memory, a passing hello…"
                    rows={4}
                    required
                    className="field w-full resize-none rounded-sm border border-white/10 bg-black/20 p-4 font-serif text-lg leading-relaxed text-sequoia-light placeholder:text-white/20 focus:border-sequoia-accent focus:outline-none"
                  />
                </label>

                <div className="relative z-10 flex items-center justify-between gap-4 font-mono text-[0.72rem] uppercase tracking-[0.2em]">
                  <span className="text-sequoia-light/45 tabular-nums">{message.length} / 220</span>
                  <button type="submit" className="btn-frame link-arrow bg-sequoia-light text-sequoia-dark px-6 py-3 font-bold hover:bg-white">
                    Expose the frame <span aria-hidden="true">→</span>
                  </button>
                </div>
                <output className="relative z-10 mt-6 block min-h-[1.25rem] font-serif text-[1rem] italic text-sequoia-accent" aria-live="polite">
                  {status}
                </output>
              </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 content-start gap-[clamp(1.5rem,3vw,2.25rem)] sm:grid-cols-2">
              {recentTraces.map((trace, index) => (
                <Reveal key={trace.id} delay={index * 80} variant="scale">
                  <article
                    className="trace-card relative flex h-full flex-col justify-between bg-[#e8e6df] p-7 text-sequoia-dark shadow-xl shadow-black/40"
                    style={{ "--tilt": TILTS[index % TILTS.length] } as CSSProperties}
                  >
                    <div className="absolute top-[-10px] left-1/2 h-6 w-12 -translate-x-1/2 bg-white/40 shadow-sm backdrop-blur-sm" style={{ transform: "translateX(-50%) rotate(-2deg)" }} />
                    <p className="mb-8 font-serif text-[1.25rem] italic leading-snug">“{trace.message}”</p>
                    <div className="flex items-baseline justify-between gap-4 border-t border-black/10 pt-4 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-black/55">
                      <span className="truncate">— {trace.name}</span>
                      <time dateTime={trace.createdAt} className="shrink-0">
                        {new Date(trace.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                      </time>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      {archiveTraces.length > 0 && (
        <div className="mt-24 w-full overflow-hidden border-y border-white/5 bg-black/20 py-12">
          <div className="mx-auto mb-8 px-6 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-sequoia-accent/60">
            Archive / Older Traces
          </div>
          <div className="flex w-full overflow-hidden">
            <div className="animate-marquee flex gap-8 pr-8 w-max">
              {[...archiveTraces, ...archiveTraces, ...archiveTraces].map((trace, idx) => (
                <article
                  key={`${trace.id}-${idx}`}
                  className="w-[280px] shrink-0 rounded-sm border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <p className="mb-4 font-serif text-[1.1rem] italic leading-snug text-white/80">“{trace.message}”</p>
                  <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-3 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/40">
                    <span className="truncate">— {trace.name}</span>
                    <time dateTime={trace.createdAt} className="shrink-0">
                      {new Date(trace.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
