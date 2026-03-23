/**
 * Only allow same-origin relative paths as post-login redirect targets.
 */
export function safeAuthReturnTo(requestUrl: string, returnTo: string | null) {
  const fallback = "/";
  if (!returnTo || typeof returnTo !== "string") {
    return fallback;
  }
  const trimmed = returnTo.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }
  try {
    const base = new URL(requestUrl);
    const resolved = new URL(trimmed, base);
    if (resolved.origin !== base.origin) {
      return fallback;
    }
    return `${resolved.pathname}${resolved.search}`;
  } catch {
    return fallback;
  }
}
