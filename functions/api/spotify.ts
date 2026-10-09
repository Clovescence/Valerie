interface Env {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REFRESH_TOKEN: string;
}

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

async function getAccessToken(env: Env): Promise<string | null> {
  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET || !env.SPOTIFY_REFRESH_TOKEN) return null;

  const basic = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.access_token;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const accessToken = await getAccessToken(context.env);
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Missing or invalid Spotify credentials" }), { status: 401 });
    }

    const headers = { Authorization: `Bearer ${accessToken}` };

    // 1. Fetch currently playing track
    let trackResponse = await fetch(`${SPOTIFY_API_URL}/me/player/currently-playing`, { headers });
    let trackData = trackResponse.ok && trackResponse.status === 200 ? await trackResponse.json() : null;
    let isPlaying = trackData?.is_playing || false;

    // If nothing is playing, fetch the most recently played track instead
    if (!trackData || !trackData.item) {
      trackResponse = await fetch(`${SPOTIFY_API_URL}/me/player/recently-played?limit=1`, { headers });
      const recentData = trackResponse.ok ? await trackResponse.json() : null;
      if (recentData?.items?.length > 0) {
        trackData = { item: recentData.items[0].track };
        isPlaying = false;
      }
    }

    const track = trackData?.item ? {
      title: trackData.item.name,
      artist: trackData.item.artists.map((a: any) => a.name).join(", "),
      album: trackData.item.album.name,
      cover: trackData.item.album.images[0]?.url || "",
      isPlaying: isPlaying,
      url: trackData.item.external_urls.spotify
    } : null;

    // 2. Fetch playlists
    const playlistsResponse = await fetch(`${SPOTIFY_API_URL}/me/playlists?limit=50`, { headers });
    const playlistsData = playlistsResponse.ok ? await playlistsResponse.json() : { items: [] };

    // Filter playlists that start with an em-dash "—", en-dash "–", or standard hyphen "-"
    const validDashPrefixes = ["—", "–", "-"];
    const playlists = playlistsData.items
      .filter((p: any) => p && validDashPrefixes.some(dash => p.name.trim().startsWith(dash)))
      .map((p: any) => {
        // Remove the dash from the display name if you want, or keep it. Let's keep it clean.
        let name = p.name.trim();
        for (const dash of validDashPrefixes) {
          if (name.startsWith(dash)) {
            name = name.slice(dash.length).trim();
            break;
          }
        }
        return {
          name: name,
          description: p.description || "curated frequency",
          cover: p.images[0]?.url || "",
          url: p.external_urls.spotify
        };
      });

    return new Response(JSON.stringify({ track, playlists }), {
      headers: {
        "Content-Type": "application/json",
        // Cache on the Edge for 5 seconds to prevent rate limiting, but force BROWSER to always check for fresh data
        "Cache-Control": "public, s-maxage=5, max-age=0",
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
