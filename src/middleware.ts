import { NextResponse, type NextRequest } from 'next/server';

// Common hacker probe and bot attack paths to block immediately
const BLOCKED_PROBE_PATTERNS = [
  /\.env(\..*)?$/i,
  /\.git(\/.*)?$/i,
  /\/wp-(admin|login|content|includes)/i,
  /\/phpmyadmin/i,
  /\/xmlrpc\.php/i,
  /\/\.aws(\/.*)?$/i,
  /\/config\.php/i,
  /\/boaform/i,
  /\/actuator/i,
  /\/vendor\/phpunit/i,
  /\/solr/i,
  /\/autodiscover/i,
  /\.(bak|old|sql|tar|gz|zip)$/i,
];

// Dangerous query parameter patterns (SQL injection, XSS, null bytes, path traversal)
const MALICIOUS_PARAM_PATTERNS = [
  /<script\b/i,
  /javascript:/i,
  /union(\s+all)?\s+select/i,
  /drop\s+table/i,
  /insert\s+into/i,
  /--\s*$/m,
  /\0/,
  /\.\.\//,
  /%2e%2e%2f/i,
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Block Malicious Probes & Scanner Bots
  for (const pattern of BLOCKED_PROBE_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Security policy violation.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 2. Block Malicious Query Parameters (SQLi, XSS, Path Traversal)
  if (search) {
    for (const pattern of MALICIOUS_PARAM_PATTERNS) {
      if (pattern.test(search) || pattern.test(decodeURIComponent(search))) {
        return new NextResponse(
          JSON.stringify({ error: 'Bad Request: Malicious parameters detected.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // 3. Process Request and Inject Bank-Grade HTTP Security Headers
  const response = NextResponse.next();

  // Prevent Clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME-sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent Cross-Site Scripting (XSS)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Enforce HTTPS
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Hardware / Feature Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (/brand/, /products/, /moods/, /icons/)
     */
    '/((?!_next/static|_next/image|favicon.ico|brand/|products/|moods/|icons/).*)',
  ],
};
