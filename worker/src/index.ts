export interface Env {
  DB: D1Database;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REFRESH_TOKEN: string;
  GITHUB_REPO: string;
  GITHUB_TOKEN?: string;
  ALLOWED_ORIGIN?: string;
}

const json = (data: unknown, status = 200, origin = "*") =>
  Response.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Cache-Control": "no-store",
    },
  });

const spotifyToken = async (env: Env) => {
  const credentials = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    }),
  });
  if (!response.ok) throw new Error("Spotify token refresh failed");
  return ((await response.json()) as { access_token: string }).access_token;
};

const normalizeTrack = (item: any, isPlaying: boolean) => ({
  title: item.name,
  artist: item.artists.map((artist: any) => artist.name).join(", "),
  album: item.album.name,
  cover: item.album.images?.[0]?.url || "",
  url: item.external_urls?.spotify,
  isPlaying,
});

async function getSpotify(env: Env, origin: string) {
  const token = await spotifyToken(env);
  const headers = { Authorization: `Bearer ${token}` };
  const [nowResponse, playlistsResponse] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers }),
    fetch("https://api.spotify.com/v1/me/playlists?limit=12", { headers }),
  ]);

  let track;
  if (nowResponse.status === 204) {
    const recentResponse = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      { headers },
    );
    const recent = (await recentResponse.json()) as any;
    track = recent.items?.[0]?.track
      ? normalizeTrack(recent.items[0].track, false)
      : null;
  } else {
    const now = (await nowResponse.json()) as any;
    track = now.item ? normalizeTrack(now.item, Boolean(now.is_playing)) : null;
  }

  const playlistData = (await playlistsResponse.json()) as any;
  const playlists = (playlistData.items || []).map((playlist: any) => ({
    name: playlist.name,
    description: playlist.description || "A saved transmission",
    cover: playlist.images?.[0]?.url || "",
    url: playlist.external_urls?.spotify,
  }));

  return json({ track, playlists }, 200, origin);
}

async function getDiary(env: Env, origin: string) {
  if (!env.GITHUB_REPO) return json({ entries: [] }, 200, origin);
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "afterimage-worker",
  };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

  const response = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/issues?state=open&labels=diary&per_page=12`,
    { headers },
  );
  if (!response.ok) return json({ error: "GitHub diary unavailable" }, 502, origin);

  const issues = (await response.json()) as any[];
  const entries = issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      id: issue.id,
      title: issue.title,
      body: issue.body || "",
      date: new Date(issue.created_at).toLocaleDateString("en", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      url: issue.html_url,
      tags: issue.labels.map((label: any) =>
        typeof label === "string" ? label : label.name,
      ),
    }));

  return json({ entries }, 200, origin);
}

async function getTraces(env: Env, origin: string) {
  const result = await env.DB.prepare(
    "SELECT id, name, message, created_at AS createdAt FROM traces ORDER BY created_at DESC LIMIT 24",
  ).all();
  return json({ traces: result.results }, 200, origin);
}

async function createTrace(request: Request, env: Env, origin: string) {
  const body = (await request.json()) as {
    id?: string;
    name?: string;
    message?: string;
  };
  const name = body.name?.trim().slice(0, 40);
  const message = body.message?.trim().slice(0, 220);
  if (!name || !message) return json({ error: "Name and message are required" }, 400, origin);

  await env.DB.prepare(
    "INSERT INTO traces (id, name, message, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind(body.id || crypto.randomUUID(), name, message, new Date().toISOString())
    .run();
  return json({ ok: true }, 201, origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = env.ALLOWED_ORIGIN || "*";
    if (request.method === "OPTIONS") return json({}, 204, origin);

    try {
      if (url.pathname === "/api/spotify" && request.method === "GET") {
        return await getSpotify(env, origin);
      }
      if (url.pathname === "/api/diary" && request.method === "GET") {
        return await getDiary(env, origin);
      }
      if (url.pathname === "/api/traces" && request.method === "GET") {
        return await getTraces(env, origin);
      }
      if (url.pathname === "/api/traces" && request.method === "POST") {
        return await createTrace(request, env, origin);
      }
      return json({ error: "Not found" }, 404, origin);
    } catch (error) {
      console.error(error);
      return json({ error: "Service unavailable" }, 503, origin);
    }
  },
};
