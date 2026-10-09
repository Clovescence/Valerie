/**
 * The Cloudflare Worker backend (see /worker) is not proxied by `vite dev`, so in development
 * every /api/* call would 404 and spam the console. Calls are therefore only made in production
 * builds, or in dev when VITE_API_BASE points at a running worker (e.g. http://127.0.0.1:8787).
 */
const base = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";

export const apiEnabled: boolean = import.meta.env.PROD || base !== "";

export const apiUrl = (path: string) => `${base}${path}`;
