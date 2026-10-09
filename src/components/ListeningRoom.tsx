import { useState, useEffect, useMemo, type ElementType } from "react";
import { Track, Playlist } from "../types";
import { demoTrack, demoPlaylists } from "../data/mock";
import { apiEnabled, apiUrl } from "../lib/api";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const wrap = (index: number, length: number) => ((index % length) + length) % length;
const pad = (n: number) => String(n).padStart(2, "0");
const OFFSETS = [-2, -1, 0, 1, 2] as const;

/** An anchor only when there is somewhere to go; otherwise a plain element (no phantom #hash jumps). */
const linkProps = (url?: string) => (url ? { href: url, target: "_blank", rel: "noreferrer" } : {});

function CassetteTape({ tape }: { tape: Playlist }) {
  const Tag: ElementType = tape.url ? "a" : "div";
  return (
    <Tag className="cassette block w-full max-w-[500px]" {...linkProps(tape.url)}>
      <div className="cassette-edge">
        <span>TYPE II</span>
        <span>60 MIN</span>
      </div>
      <div className="cassette-label">
        <span>AFTERIMAGE MIX SERIES</span>
        <strong>{tape.name}</strong>
        <small>{tape.description}</small>
      </div>
      <div className="cassette-window">
        <span className="cassette-reel">
          <i />
        </span>
        <div className="tape-strip" />
        <span className="cassette-reel">
          <i />
        </span>
      </div>
      <div className="cassette-screws">
        <i />
        <i />
        <i />
        <i />
      </div>
    </Tag>
  );
}

export function ListeningRoom() {
  const [track, setTrack] = useState<Track>(demoTrack);
  const [playlists, setPlaylists] = useState<Playlist[]>(demoPlaylists);
  /* Unbounded cursor: spines are keyed by virtual index so they glide between slots
     (their transform transitions) instead of being torn down and rebuilt. */
  const [cursor, setCursor] = useState(0);
  const [moves, setMoves] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!apiEnabled) return;
    let alive = true;
    const loadSpotify = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch(apiUrl("/api/spotify"));
        if (!response.ok || !alive) return;
        const data = await response.json();
        if (data.track) setTrack(data.track);
        if (data.playlists?.length) setPlaylists(data.playlists);
        setIsLive(true);
      } catch {
        if (alive) setIsLive(false);
      }
    };
    loadSpotify();
    const interval = window.setInterval(loadSpotify, 30_000);
    return () => {
      alive = false;
      window.clearInterval(interval);
    };
  }, []);

  const count = playlists.length;
  const active = wrap(cursor, count);
  const rack = useMemo(
    () => OFFSETS.map((offset) => ({ virtual: cursor + offset, offset, playlist: playlists[wrap(cursor + offset, count)] })),
    [cursor, playlists, count],
  );

  const moveCassettes = (amount: number) => {
    if (!amount) return;
    setDirection(amount > 0 ? "next" : "previous");
    setCursor((value) => value + amount);
    setMoves((value) => value + 1);
  };

  const nowPlaying = track.isPlaying ? "Now playing" : "Last played";
  const TurntableLink: ElementType = track.url ? "a" : "div";

  return (
    <section id="listening" className="section-pad relative">
      <SectionHeader
        index="02"
        label="Frequencies"
        title={
          <>
            Currently in <em className="text-sequoia-accent">rotation.</em>
          </>
        }
        meta={
          <span className={`inline-flex items-center gap-3 ${isLive ? "text-sequoia-accent" : ""}`}>
            <span
              className={`block h-[7px] w-[7px] rounded-full ${isLive ? "animate-pulse bg-sequoia-accent" : "bg-sequoia-light/40"}`}
              aria-hidden="true"
            />
            {isLive ? "Spotify live" : "Demo signal"}
          </span>
        }
      />

      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-[clamp(4rem,9vw,8rem)] lg:grid-cols-2">
          {/* ── Turntable ───────────────────────────────────────────── */}
          <Reveal variant="scale" className="turntable-wrapper mx-auto w-full max-w-[600px] lg:mx-0">
            <div className="turntable">
              <div className="turntable-label">
                <span>{nowPlaying}</span>
                <span>33⅓ RPM</span>
              </div>
              <div className="platter-base" aria-hidden="true">
                <i />
              </div>
              <TurntableLink
                className={track.isPlaying ? "vinyl is-spinning" : "vinyl is-spinning is-paused"}
                aria-label={`${track.title} by ${track.artist}`}
                {...linkProps(track.url)}
              >
                <div className="vinyl-edge" />
                <div className="vinyl-grooves" />
                <div className="vinyl-sheen" />
                <div className="record-label" style={{ backgroundImage: `url(${track.cover})` }}>
                  <span className="record-spindle" />
                </div>
              </TurntableLink>
              <div className="tonearm-rest-mount" aria-hidden="true">
                <div className="tonearm-rest" />
              </div>
              <div className={track.isPlaying ? "tonearm is-engaged" : "tonearm"} aria-hidden="true">
                <div className="tonearm-pivot">
                  <i />
                </div>
                <div className="tonearm-rod" />
                <span className="tonearm-cartridge" />
              </div>
              <div className="turntable-controls" aria-hidden="true">
                <span className={track.isPlaying ? "power-light is-on" : "power-light"} />
                <i>33</i>
                <i>45</i>
                <div className="pitch-control">
                  <span />
                </div>
              </div>
              <div className="track-meta">
                <span className={track.isPlaying ? "equalizer active" : "equalizer"}>
                  <i />
                  <i />
                  <i />
                </span>
                <div>
                  <h3 className="font-serif text-[1.35rem] leading-tight text-sequoia-light">{track.title}</h3>
                  <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-sequoia-accent">
                    {track.artist} — {track.album}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── Cassette rack ───────────────────────────────────────── */}
          <Reveal delay={160} className="mixtapes-wrapper mx-auto w-full max-w-[500px] lg:ml-auto lg:mr-0">
            <div className="mb-6 flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.2em] text-sequoia-accent">
              <p>Selected transmissions</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveCassettes(-1)}
                  aria-label="Previous playlist"
                  className="link-arrow is-prev px-3 py-2 transition-colors duration-500 hover:text-sequoia-light"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveCassettes(1)}
                  aria-label="Next playlist"
                  className="link-arrow -mr-3 px-3 py-2 transition-colors duration-500 hover:text-sequoia-light"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <div className="cassette-jukebox">
              <div className="cassette-magazine" role="group" aria-label="Playlist cassette rack">
                {rack.map(({ virtual, offset, playlist }) => (
                  <button
                    type="button"
                    className={offset === 0 ? "tape-spine is-selected" : "tape-spine"}
                    key={virtual}
                    onClick={() => moveCassettes(offset)}
                    aria-label={`Select ${playlist.name}`}
                    aria-pressed={offset === 0}
                  >
                    <span>{pad(wrap(virtual, count) + 1)}</span>
                    <strong>{playlist.name}</strong>
                    <i />
                  </button>
                ))}
              </div>
              <div className="cassette-bay">
                <div className="bay-display">
                  <span>PLAYLIST MEMORY</span>
                  <strong>{pad(active + 1)}</strong>
                </div>
                {/* The eject animation only plays in response to a move — never on first paint. */}
                <div
                  className={moves > 0 ? `cassette-eject cassettes-moving-${direction}` : "cassette-eject"}
                  key={moves}
                >
                  <CassetteTape tape={playlists[active]} />
                </div>
                <div className="eject-tray" aria-hidden="true">
                  <i />
                  <span>EJECT / PLAY</span>
                  <i />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 font-mono text-[0.72rem] tracking-[0.2em] text-sequoia-accent">
              <span>{pad(active + 1)}</span>
              <i className="block h-px w-4 bg-sequoia-border" />
              <span>{pad(count)}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
