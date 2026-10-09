# Afterimage Cloudflare Worker

This Worker powers the live Spotify display, GitHub Issue diary, and public
Traces guestbook without exposing private tokens in the browser.

## 1. Create the Worker and D1 database

```sh
npx wrangler d1 create afterimage-traces
cp wrangler.toml.example wrangler.toml
```

Paste the returned database ID into `wrangler.toml`, then create the table:

```sh
npx wrangler d1 execute afterimage-traces --remote --file=schema.sql
```

## 2. Add secrets

Create a Spotify app at https://developer.spotify.com/dashboard and authorize
it once with these scopes:

- `user-read-currently-playing`
- `user-read-recently-played`
- `playlist-read-private`

Generate a refresh token from that authorization, then store all three values:

```sh
npx wrangler secret put SPOTIFY_CLIENT_ID
npx wrangler secret put SPOTIFY_CLIENT_SECRET
npx wrangler secret put SPOTIFY_REFRESH_TOKEN
```

For private GitHub repositories or higher API limits, also add:

```sh
npx wrangler secret put GITHUB_TOKEN
```

Set `GITHUB_REPO` in `wrangler.toml` to `owner/repository`. Only open issues
with the `diary` label are displayed.

## 3. Deploy and route

```sh
npx wrangler deploy
```

Route `/api/*` on the same domain to this Worker, or change the frontend fetch
URLs to the deployed `workers.dev` origin. Set `ALLOWED_ORIGIN` to the exact
public website origin when using a separate domain.

The website intentionally falls back to demo Spotify/diary content and
browser-local Traces while the Worker is not configured.
