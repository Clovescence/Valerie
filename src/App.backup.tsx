import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Photo = {
  src: string;
  title: string;
  date: string;
  credit: string;
};

type Track = {
  title: string;
  artist: string;
  album: string;
  cover: string;
  url?: string;
  isPlaying: boolean;
};

type Playlist = {
  name: string;
  description: string;
  cover: string;
  url?: string;
};

type DiaryEntry = {
  id: number;
  title: string;
  body: string;
  date: string;
  url: string;
  tags: string[];
};

type Trace = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

const gallery: Photo[] = [
  {
    src: "https://images.unsplash.com/photo-1743456131099-ea30c6da59f2?auto=format&fit=crop&w=1000&q=85",
    title: "Passing strangers",
    date: "11.24",
    credit: "Olegs Jonins",
  },
  {
    src: "https://images.unsplash.com/photo-1625039162908-19d625adbaac?auto=format&fit=crop&w=1000&q=85",
    title: "Headlights, going home",
    date: "02.25",
    credit: "Foad Roshan",
  },
  {
    src: "https://images.unsplash.com/photo-1514789493525-341ba29ecd96?auto=format&fit=crop&w=1000&q=85",
    title: "Momentum",
    date: "04.25",
    credit: "Shaouraav Sarose Shreshtha",
  },
  {
    src: "https://images.unsplash.com/photo-1723739012018-f401c2f0e758?auto=format&fit=crop&w=1000&q=85",
    title: "One light left on",
    date: "08.25",
    credit: "Ksenia Pixelesse",
  },
  {
    src: "https://images.unsplash.com/photo-1592912487122-4a2c0b82e107?auto=format&fit=crop&w=1000&q=85",
    title: "After the rain",
    date: "09.25",
    credit: "Annie Spratt",
  },
  {
    src: "https://images.unsplash.com/photo-1496492813606-88559707e685?auto=format&fit=crop&w=1000&q=85",
    title: "Night signals",
    date: "12.25",
    credit: "Mattias Diesel",
  },
];

const demoTrack: Track = {
  title: "Space Song",
  artist: "Beach House",
  album: "Depression Cherry",
  cover:
    "https://images.unsplash.com/photo-1606870655535-083046002342?auto=format&fit=crop&w=600&q=85",
  isPlaying: true,
};

const demoPlaylists: Playlist[] = [
  {
    name: "night bus home",
    description: "streetlights through a fogged window",
    cover:
      "https://images.unsplash.com/photo-1496492813606-88559707e685?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "slow mornings",
    description: "for letting the light find you",
    cover:
      "https://images.unsplash.com/photo-1592912487122-4a2c0b82e107?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "grain & static",
    description: "beautiful things with rough edges",
    cover:
      "https://images.unsplash.com/photo-1622036900418-5805b072d6c1?auto=format&fit=crop&w=500&q=80",
  },
];

const demoDiary: DiaryEntry[] = [
  {
    id: 1,
    title: "The things a photograph forgets",
    body: "I have been thinking about the distance between a memory and its evidence. A photograph keeps the light, but not the temperature of the room.",
    date: "October 18, 2025",
    url: "#diary",
    tags: ["observation", "photography"],
  },
  {
    id: 2,
    title: "A note from the night train",
    body: "Every window became a double exposure: the world outside and a stranger’s reflection moving through it.",
    date: "September 02, 2025",
    url: "#diary",
    tags: ["field note"],
  },
  {
    id: 3,
    title: "Learning to leave things unfinished",
    body: "Maybe an archive is not a museum. Maybe it is allowed to breathe, gather dust, and change its mind.",
    date: "August 11, 2025",
    url: "#diary",
    tags: ["personal"],
  },
];

const wrap = (index: number, length: number) =>
  ((index % length) + length) % length;

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return <span aria-hidden="true">{direction === "left" ? "←" : "→"}</span>;
}

function Intro({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="intro" aria-label="Afterimage is loading">
      <button className="intro-skip" onClick={onComplete}>
        Skip intro
      </button>
      <div className="camera-stage">
        <div className="camera">
          <div className="camera-top">
            <span className="shutter-button" />
            <span className="exposure-dial"><i /></span>
            <span className="camera-flash" />
            <span className="camera-viewfinder"><i /></span>
            <span className="rangefinder-window" />
          </div>
          <div className="camera-body">
            <div className="camera-metal-band" />
            <div className="camera-grip">
              <i /><i /><i /><i /><i /><i />
            </div>
            <span className="camera-brand">AFTERIMAGE <small>LAND 01</small></span>
            <div className="camera-lens">
              <div className="lens-markings">3.5 · 90MM · COATED</div>
              <span className="lens-glass" />
              <i className="lens-glint" />
            </div>
            <span className="camera-counter">01</span>
            <span className="camera-meter"><i /></span>
            <span className="camera-screw screw-left" />
            <span className="camera-screw screw-right" />
            <span className="camera-spec">AUTO EXPOSURE · 90MM</span>
          </div>
        </div>
      </div>
      <p className="intro-copy">Look into the lens</p>
      <div className="flash-frame" />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand" href="#top">
        AFTER<span>IMAGE</span>
      </a>
      <button
        className="menu-button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
      </button>
      <nav className={open ? "site-nav is-open" : "site-nav"}>
        <a href="#gallery" onClick={() => setOpen(false)}>
          Photographs
        </a>
        <a href="#listening" onClick={() => setOpen(false)}>
          Listening
        </a>
        <a href="#diary" onClick={() => setOpen(false)}>
          Diary
        </a>
        <a href="#traces" onClick={() => setOpen(false)}>
          Traces
        </a>
      </nav>
      <span className="header-index">EST. MMXXV</span>
    </header>
  );
}

function Gallery() {
  const [active, setActive] = useState(0);
  const [pendingMove, setPendingMove] = useState<-1 | 0 | 1>(0);
  const visible = useMemo(
    () => [-3, -2, -1, 0, 1, 2, 3].map((offset) => wrap(active + offset, gallery.length)),
    [active],
  );

  const moveGallery = (amount: number) => {
    if (pendingMove !== 0) return;
    setPendingMove(amount > 0 ? 1 : -1);
  };

  const finishGalleryMove = () => {
    if (pendingMove === 0) return;
    setActive((value) => wrap(value + pendingMove, gallery.length));
    setPendingMove(0);
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="section-heading">
        <p>01 / Contact sheets</p>
        <h2>
          Light, held <em>briefly.</em>
        </h2>
        <span>{String(active + 1).padStart(2, "0")} — {String(gallery.length).padStart(2, "0")}</span>
      </div>
      <div
        className={`photo-line ${
          pendingMove === 1
            ? "rope-moving-next"
            : pendingMove === -1
              ? "rope-moving-previous"
              : ""
        }`}
        onAnimationEnd={(event) => {
          if (event.currentTarget === event.target) finishGalleryMove();
        }}
        aria-live="polite"
      >
        <div className="rope" />
        {visible.map((photoIndex, position) => {
          const photo = gallery[photoIndex];
          return (
            <figure
              className={`polaroid polaroid-variant-${photoIndex % 5} polaroid-slot-${position}`}
              key={`${photoIndex}-${position}`}
            >
              <span className="peg" aria-hidden="true" />
              <div className="photo-frame">
                <img src={photo.src} alt={photo.title} />
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
      <div className="gallery-controls">
        <button onClick={() => moveGallery(-1)} disabled={pendingMove !== 0}>
          <Arrow direction="left" /> Previous
        </button>
        <p>Pull the thread in either direction. It never ends.</p>
        <button onClick={() => moveGallery(1)} disabled={pendingMove !== 0}>
          Next <Arrow />
        </button>
      </div>
    </section>
  );
}

function CassetteTape({ tape }: { tape: Playlist }) {
  return (
    <a
      className="cassette"
      href={tape.url || "#listening"}
      target={tape.url ? "_blank" : undefined}
      rel="noreferrer"
    >
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
        <span className="cassette-reel"><i /></span>
        <div className="tape-strip" />
        <span className="cassette-reel"><i /></span>
      </div>
      <div className="cassette-screws"><i /><i /><i /><i /></div>
    </a>
  );
}

function ListeningRoom() {
  const [track, setTrack] = useState<Track>(demoTrack);
  const [playlists, setPlaylists] = useState<Playlist[]>(demoPlaylists);
  const [activePlaylist, setActivePlaylist] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [cassetteMove, setCassetteMove] = useState(0);
  const [cassetteDirection, setCassetteDirection] = useState<"next" | "previous">("next");

  useEffect(() => {
    const loadSpotify = async () => {
      try {
        const response = await fetch("/api/spotify");
        if (!response.ok) return;
        const data = await response.json();
        if (data.track) setTrack(data.track);
        if (data.playlists?.length) setPlaylists(data.playlists);
        setIsLive(true);
      } catch {
        setIsLive(false);
      }
    };

    loadSpotify();
    const interval = window.setInterval(loadSpotify, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const visiblePlaylists = useMemo(
    () =>
      [-2, -1, 0, 1, 2].map(
        (offset) => playlists[wrap(activePlaylist + offset, playlists.length)],
      ),
    [activePlaylist, playlists],
  );

  const moveCassettes = (amount: number) => {
    setCassetteDirection(amount > 0 ? "next" : "previous");
    setActivePlaylist((value) => wrap(value + amount, playlists.length));
    setCassetteMove((value) => value + 1);
  };

  return (
    <section className="listening-section" id="listening">
      <div className="section-heading light-heading">
        <p>02 / Frequencies</p>
        <h2>
          Currently in <em>rotation.</em>
        </h2>
        <span className={isLive ? "live-status online" : "live-status"}>
          <i /> {isLive ? "Spotify live" : "Demo signal"}
        </span>
      </div>

      <div className="listening-grid">
        <div className="turntable">
          <div className="turntable-label">
            <span>{track.isPlaying ? "Now playing" : "Last played"}</span>
            <span>33⅓ RPM</span>
          </div>
          <div className="platter-base" aria-hidden="true">
            <i />
          </div>
          <a
            className={track.isPlaying ? "vinyl is-spinning" : "vinyl is-spinning is-paused"}
            href={track.url || "#listening"}
            target={track.url ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={`${track.title} by ${track.artist}`}
          >
            <div className="vinyl-edge" />
            <div className="vinyl-grooves" />
            <div className="vinyl-sheen" />
            <div className="record-label" style={{ backgroundImage: `url(${track.cover})` }}>
              <span className="record-spindle" />
            </div>
          </a>
          <div className={track.isPlaying ? "tonearm is-engaged" : "tonearm"} aria-hidden="true">
            <div className="tonearm-pivot"><i /></div>
            <div className="tonearm-rod" />
            <span className="tonearm-cartridge" />
          </div>
          <div className="turntable-controls" aria-hidden="true">
            <span className={track.isPlaying ? "power-light is-on" : "power-light"} />
            <i>33</i>
            <i>45</i>
            <div className="pitch-control"><span /></div>
          </div>
          <div className="track-meta">
            <span className={track.isPlaying ? "equalizer active" : "equalizer"}>
              <i /><i /><i />
            </span>
            <div>
              <h3>{track.title}</h3>
              <p>{track.artist} — {track.album}</p>
            </div>
          </div>
        </div>

        <div className="mixtapes">
          <div className="mixtape-heading">
            <p>Selected transmissions</p>
            <div>
              <button
                onClick={() => moveCassettes(-1)}
                aria-label="Previous playlist"
              >
                <Arrow direction="left" />
              </button>
              <button
                onClick={() => moveCassettes(1)}
                aria-label="Next playlist"
              >
                <Arrow />
              </button>
            </div>
          </div>
          <div className="cassette-jukebox">
            <div className="cassette-magazine" aria-label="Playlist cassette rack">
              {visiblePlaylists.map((playlist, position) => (
                <button
                  className={position === 2 ? "tape-spine is-selected" : "tape-spine"}
                  key={`${activePlaylist}-${position}`}
                  onClick={() => moveCassettes(position - 2)}
                  aria-label={`Select ${playlist.name}`}
                >
                  <span>{String(wrap(activePlaylist + position - 2, playlists.length) + 1).padStart(2, "0")}</span>
                  <strong>{playlist.name}</strong>
                  <i />
                </button>
              ))}
            </div>
            <div className="cassette-bay">
              <div className="bay-display">
                <span>PLAYLIST MEMORY</span>
                <strong>{String(activePlaylist + 1).padStart(2, "0")}</strong>
              </div>
              <div
                className={`cassette-eject cassettes-moving-${cassetteDirection}`}
                key={cassetteMove}
              >
                <CassetteTape tape={visiblePlaylists[2]} />
              </div>
              <div className="eject-tray" aria-hidden="true">
                <i />
                <span>EJECT / PLAY</span>
                <i />
              </div>
            </div>
          </div>
          <div className="tape-index">
            <span>{String(activePlaylist + 1).padStart(2, "0")}</span>
            <i />
            <span>{String(playlists.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>(demoDiary);
  const [source, setSource] = useState("Preview entries");

  useEffect(() => {
    fetch("/api/diary")
      .then((response) => {
        if (!response.ok) throw new Error("Diary is offline");
        return response.json();
      })
      .then((data) => {
        if (data.entries?.length) {
          setEntries(data.entries);
          setSource("Synced from GitHub Issues");
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="diary-section" id="diary">
      <div className="section-heading">
        <p>03 / Marginalia</p>
        <h2>
          Notes from <em>in between.</em>
        </h2>
        <span>{source}</span>
      </div>
      <div className="diary-list">
        {entries.map((entry, index) => (
          <article className="diary-entry" key={entry.id}>
            <div className="entry-date">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <time>{entry.date}</time>
            </div>
            <div className="entry-copy">
              <div className="entry-tags">
                {entry.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <h3>{entry.title}</h3>
              <p>{entry.body}</p>
            </div>
            <a href={entry.url} target={entry.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              Read entry <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function Traces() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const loadTraces = useCallback(async () => {
    try {
      const response = await fetch("/api/traces");
      if (!response.ok) throw new Error("offline");
      const data = await response.json();
      setTraces(data.traces || []);
    } catch {
      const saved = JSON.parse(localStorage.getItem("afterimage-traces") || "[]");
      setTraces(saved);
    }
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

    try {
      const response = await fetch("/api/traces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trace),
      });
      if (!response.ok) throw new Error("offline");
      await loadTraces();
      setStatus("Your trace was left behind.");
    } catch {
      const next = [trace, ...traces].slice(0, 24);
      localStorage.setItem("afterimage-traces", JSON.stringify(next));
      setTraces(next);
      setStatus("Saved in this browser.");
    }

    setName("");
    setMessage("");
  };

  return (
    <section className="traces-section" id="traces">
      <div className="section-heading light-heading">
        <p>04 / Traces</p>
        <h2>
          Proof you were <em>here.</em>
        </h2>
        <span>Guestbook / Cloudflare D1</span>
      </div>
      <div className="traces-grid">
        <form className="trace-form" onSubmit={submitTrace}>
          <p>Leave something small behind.</p>
          <label>
            <span>Your name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              placeholder="Anonymous, if you prefer"
              required
            />
          </label>
          <label>
            <span>Your trace</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={220}
              placeholder="A thought, a memory, a passing hello…"
              rows={4}
              required
            />
          </label>
          <div className="form-footer">
            <span>{message.length} / 220</span>
            <button type="submit">Expose the frame <Arrow /></button>
          </div>
          <output>{status}</output>
        </form>
        <div className="trace-wall">
          {traces.length ? (
            traces.slice(0, 6).map((trace, index) => (
              <article className={`trace-note trace-note-${index % 3}`} key={trace.id}>
                <p>“{trace.message}”</p>
                <div>
                  <span>— {trace.name}</span>
                  <time>{new Date(trace.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}</time>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-trace">
              <span>Unexposed</span>
              <p>Be the first light to reach this frame.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-title">
        <span>Stay in the frame</span>
        <h2>AFTERIMAGE</h2>
      </div>
      <div className="footer-links">
        <div>
          <p>Elsewhere</p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://open.spotify.com" target="_blank" rel="noreferrer">Spotify ↗</a>
        </div>
        <div>
          <p>Write to me</p>
          <a href="mailto:hello@afterimage.place">hello@afterimage.place ↗</a>
        </div>
        <a className="back-to-top" href="#top">Back to the beginning ↑</a>
      </div>
      <div className="footer-fineprint">
        <span>© {new Date().getFullYear()} Afterimage</span>
        <span>Images linger longer than moments.</span>
        <span>Built with memory & light</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowIntro(false);
      return;
    }
    const timer = window.setTimeout(() => setShowIntro(false), 5450);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      {showIntro && <Intro onComplete={() => setShowIntro(false)} />}
      <div className={showIntro ? "site-content waiting" : "site-content revealed"} id="top">
        <Header />
        <main>
          <section className="hero">
            <div className="hero-grain" />
            <div className="hero-exposure">+ 01.3 EV</div>
            <div className="hero-copy">
              <p>A personal archive of light, sound & passing time</p>
              <h1>
                What remains
                <br />
                after the <em>moment</em>
                <br />
                has gone?
              </h1>
            </div>
            <div className="hero-side">
              <p>
                Afterimage is a collection of photographs, field notes, and
                frequencies gathered while moving through the world.
              </p>
              <a href="#gallery">Enter the archive <Arrow /></a>
            </div>
            <div className="shutter-readout">
              <span>ISO 800</span>
              <span>f / 1.4</span>
              <span>1 / 8s</span>
            </div>
          </section>
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
