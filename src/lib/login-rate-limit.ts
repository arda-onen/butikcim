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

function namespacedKey(namespace: string, ip: string) {
  return `${namespace}:${ip}`;
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

export function checkLoginAllowed(ip: string, namespace = "admin") {
  const currentTime = now();
  pruneExpiredEntries(currentTime);

  const key = namespacedKey(namespace, ip);
  const entry = attemptsByIp.get(key);
  if (!entry) {
    return { allowed: true as const };
  }

  if (entry.lockUntil && entry.lockUntil > currentTime) {
    const retryAfterSeconds = Math.ceil((entry.lockUntil - currentTime) / 1000);
    return { allowed: false as const, retryAfterSeconds };
  }

  return { allowed: true as const };
}

export function recordFailedAttempt(ip: string, namespace = "admin") {
  const currentTime = now();
  const key = namespacedKey(namespace, ip);
  const entry = attemptsByIp.get(key);

  if (!entry || currentTime - entry.firstAttemptAt > WINDOW_MS) {
    attemptsByIp.set(key, { attempts: 1, firstAttemptAt: currentTime });
    return;
  }

  const attempts = entry.attempts + 1;
  const next: AttemptEntry = { ...entry, attempts };

  if (attempts >= MAX_ATTEMPTS) {
    next.lockUntil = currentTime + LOCK_MS;
  }

  attemptsByIp.set(key, next);
}

export function clearFailedAttempts(ip: string, namespace = "admin") {
  attemptsByIp.delete(namespacedKey(namespace, ip));
}
