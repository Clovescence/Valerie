import { useState, useEffect } from "react";
import { DiaryEntry } from "../types";
import { demoDiary } from "../data/mock";
import { apiEnabled, apiUrl } from "../lib/api";
import { Reveal, RevealLine } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const pad = (n: number) => String(n).padStart(2, "0");

export function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>(demoDiary);
  const [source, setSource] = useState("Preview entries");

  useEffect(() => {
    if (!apiEnabled) return;
    let alive = true;
    fetch(apiUrl("/api/diary"))
      .then((response) => {
        if (!response.ok) throw new Error("Diary is offline");
        return response.json();
      })
      .then((data) => {
        if (alive && data.entries?.length) {
          setEntries(data.entries);
          setSource("Synced from GitHub Issues");
        }
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="diary" className="section-pad relative">
      <SectionHeader
        index="03"
        label="Marginalia"
        title={
          <>
            Notes from <em className="text-sequoia-accent">in between.</em>
          </>
        }
        meta={source}
      />

      <div className="container-page">
        <div className="flex flex-col">
          {entries.map((entry, index) => (
            <Reveal as="article" key={entry.id} delay={index * 70} className="group relative">
              <div className="grid grid-cols-1 gap-x-12 gap-y-6 py-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-12">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-sequoia-light/50 lg:col-span-2">
                  <span className="mb-2 block text-sequoia-accent transition-transform duration-700 [transition-timing-function:var(--ease-fluid)] group-hover:translate-x-1">
                    {pad(index + 1)}
                  </span>
                  <time>{entry.date}</time>
                </div>

                <div className="lg:col-span-8">
                  <div className="mb-5 flex flex-wrap gap-2.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm border border-sequoia-accent/60 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-sequoia-accent transition-colors duration-500 group-hover:border-sequoia-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mb-4 font-serif text-[clamp(1.75rem,1.2rem+1.6vw,2.6rem)] font-normal leading-[1.12] transition-colors duration-700 group-hover:text-sequoia-accent">
                    {entry.title}
                  </h3>
                  <p className="max-w-2xl text-[1.06rem] leading-relaxed text-sequoia-light/75">{entry.body}</p>
                </div>

                <div className="lg:col-span-2 lg:text-right">
                  <a
                    href={entry.url}
                    target={entry.url.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="link-arrow inline-flex items-center gap-2 border-b border-sequoia-border pb-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500 hover:border-sequoia-accent hover:text-sequoia-accent"
                  >
                    Read entry <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
              {index < entries.length - 1 && <RevealLine className="absolute inset-x-0 bottom-0 h-px bg-sequoia-border" />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
