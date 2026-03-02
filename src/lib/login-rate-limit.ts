type AttemptEntry = {
  attempts: number;
  firstAttemptAt: number;
  lockUntil?: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const attemptsByIp = new Map<string, AttemptEntry>();

function now() {
  return Date.now();
}

function pruneExpiredEntries(currentTime: number) {
  for (const [ip, entry] of attemptsByIp) {
    if (entry.lockUntil && entry.lockUntil > currentTime) {
      continue;
    }

    if (currentTime - entry.firstAttemptAt > WINDOW_MS) {
      attemptsByIp.delete(ip);
    }
  }
}

export function checkLoginAllowed(ip: string) {
  const currentTime = now();
  pruneExpiredEntries(currentTime);

  const entry = attemptsByIp.get(ip);
  if (!entry) {
    return { allowed: true as const };
  }

  if (entry.lockUntil && entry.lockUntil > currentTime) {
    const retryAfterSeconds = Math.ceil((entry.lockUntil - currentTime) / 1000);
    return { allowed: false as const, retryAfterSeconds };
  }

  return { allowed: true as const };
}

export function recordFailedAttempt(ip: string) {
  const currentTime = now();
  const entry = attemptsByIp.get(ip);

  if (!entry || currentTime - entry.firstAttemptAt > WINDOW_MS) {
    attemptsByIp.set(ip, { attempts: 1, firstAttemptAt: currentTime });
    return;
  }

  const attempts = entry.attempts + 1;
  const next: AttemptEntry = { ...entry, attempts };

  if (attempts >= MAX_ATTEMPTS) {
    next.lockUntil = currentTime + LOCK_MS;
  }

  attemptsByIp.set(ip, next);
}

export function clearFailedAttempts(ip: string) {
  attemptsByIp.delete(ip);
}
