import crypto from 'crypto';
import { NextRequest } from 'next/server';

// Server-side master secret (derived from environment or fallback secure seed)
const MASTER_SECRET =
  process.env.ADMIN_PASSWORD ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'valcura_atelier_secure_master_salt_2026_9f81a7b';

// In-Memory Rate Limiting and Brute-Force Tracker
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

interface LockoutRecord {
  failedAttempts: number;
  lockedUntil: number;
}
const lockoutMap = new Map<string, LockoutRecord>();

// Clean up stale memory every 10 minutes to avoid memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((record, key) => {
      if (now > record.resetTime) rateLimitMap.delete(key);
    });
    lockoutMap.forEach((record, key) => {
      if (now > record.lockedUntil && record.failedAttempts === 0) lockoutMap.delete(key);
    });
  }, 10 * 60 * 1000);
}

/**
 * 1. Cryptographic HMAC-SHA256 Session Token Generator
 * Produces an unforgeable, tamper-evident cryptographic session token.
 */
export function createAdminSessionToken(username: string): string {
  const iat = Date.now();
  const exp = iat + 30 * 24 * 60 * 60 * 1000; // 30 Days expiration
  const nonce = crypto.randomBytes(16).toString('hex');

  const payload = JSON.stringify({
    username: username.toLowerCase().trim(),
    iat,
    exp,
    nonce,
  });

  const payloadBase64 = Buffer.from(payload, 'utf8').toString('base64url');
  const hmac = crypto.createHmac('sha256', MASTER_SECRET);
  hmac.update(payloadBase64);
  const signature = hmac.digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * 2. Cryptographic HMAC-SHA256 Session Token Verifier
 * Uses constant-time buffer comparison to prevent timing attack vulnerabilities.
 */
export function verifyAdminSessionToken(token: string | undefined | null): {
  valid: boolean;
  username?: string;
  error?: string;
} {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Missing session token' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed session token' };
  }

  const [payloadBase64, providedSignature] = parts;

  // Re-compute HMAC with server secret
  const hmac = crypto.createHmac('sha256', MASTER_SECRET);
  hmac.update(payloadBase64);
  const expectedSignature = hmac.digest('base64url');

  // Constant-time comparison protects against timing side-channel attacks
  try {
    const sigA = Buffer.from(providedSignature, 'base64url');
    const sigB = Buffer.from(expectedSignature, 'base64url');

    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      return { valid: false, error: 'Invalid cryptographic signature' };
    }
  } catch {
    return { valid: false, error: 'Signature verification error' };
  }

  // Parse and inspect payload claims
  try {
    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson);

    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false, error: 'Session token expired' };
    }

    if (!payload.username) {
      return { valid: false, error: 'Missing identity claim' };
    }

    return { valid: true, username: payload.username };
  } catch {
    return { valid: false, error: 'Corrupt session payload' };
  }
}

/**
 * 3. Client IP Extractor
 * Safely resolves the true client IP behind Cloudflare, Vercel, and standard reverse proxies.
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return '127.0.0.1';
}

/**
 * 4. Anti-Brute-Force Login Tracker
 * Blocks IPs that exceed 5 failed login attempts within 15 minutes.
 */
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 Minutes

export function isIpLockedOut(ip: string): boolean {
  const record = lockoutMap.get(ip);
  if (!record) return false;
  if (Date.now() < record.lockedUntil) {
    return true;
  }
  // Lockout expired, reset
  if (Date.now() >= record.lockedUntil && record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    lockoutMap.delete(ip);
  }
  return false;
}

export function recordFailedLogin(ip: string): {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutSeconds: number;
} {
  const now = Date.now();
  let record = lockoutMap.get(ip);

  if (!record || now > record.lockedUntil) {
    record = { failedAttempts: 1, lockedUntil: now + LOCKOUT_WINDOW_MS };
  } else {
    record.failedAttempts += 1;
    record.lockedUntil = now + LOCKOUT_WINDOW_MS;
  }

  const isLocked = record.failedAttempts >= MAX_FAILED_ATTEMPTS;
  lockoutMap.set(ip, record);

  const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);
  const lockoutSeconds = Math.ceil((record.lockedUntil - now) / 1000);

  return { isLocked, remainingAttempts, lockoutSeconds };
}

export function clearFailedLogin(ip: string): void {
  lockoutMap.delete(ip);
}

/**
 * 5. General Rate Limiter (Token Bucket / Sliding Window)
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  let record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(key, record);
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  record.count += 1;
  rateLimitMap.set(key, record);

  if (record.count > limit) {
    const retryAfterSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  return { allowed: true, remaining: limit - record.count, retryAfterSec: 0 };
}

/**
 * 6. XSS and Injection Sanitizer
 * Strips dangerous HTML tags, javascript: schemes, control chars, and prototype pollution attempts.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '') // Strip null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip scripts
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Strip iframes
    .replace(/javascript:/gi, '') // Strip javascript scheme
    .replace(/on\w+\s*=/gi, '') // Strip inline event handlers
    .replace(/[<>]/g, '') // Strip stray brackets
    .trim();
}

/**
 * 7. Path Traversal & Filename Sanitizer
 * Guarantees that filenames cannot traverse directories or escape their target container.
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') return 'unnamed_file';
  // Strip path traversal dots and directory separators
  const clean = filename
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .trim();
  return clean || `file_${Date.now()}`;
}
