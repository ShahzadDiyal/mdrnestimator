// In-memory rate limiting and spam protection helper for Next.js API routes.

const ipMap = new Map();

// Rate limit config: Max 5 quote requests per 15 minutes per IP address
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

// Clean up stale entries every 30 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of ipMap.entries()) {
      const valid = timestamps.filter((t) => now - t < WINDOW_MS);
      if (valid.length === 0) {
        ipMap.delete(ip);
      } else {
        ipMap.set(ip, valid);
      }
    }
  }, 30 * 60 * 1000);
}

export function checkRateLimit(ip = '127.0.0.1') {
  const now = Date.now();
  const timestamps = (ipMap.get(ip) || []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: WINDOW_MS - (now - timestamps[0]),
    };
  }

  timestamps.push(now);
  ipMap.set(ip, timestamps);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - timestamps.length,
    resetMs: WINDOW_MS,
  };
}

/**
 * Checks if the form submission is from a bot via honeypot input field.
 * Spam bots automatically fill in all hidden/invisible inputs.
 */
export function isSpamSubmission(fields = {}) {
  // If the honeypot field 'website' or 'hp_field' or 'fax' contains value, it's a bot.
  if (fields.website || fields.hp_field || fields.fax_number) {
    return true;
  }
  return false;
}
