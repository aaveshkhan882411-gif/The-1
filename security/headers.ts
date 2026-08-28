/**
 * @file security/headers.ts
 * @description Centralized server-side security HTTP headers utility for
 * the GrowthAI SaaS platform.
 *
 * Compatible with Next.js 14 App Router, Route Handlers,
 * Server Actions, and standard Web Response/Headers APIs.
 */

import 'server-only';

export interface SecurityHeadersOptions {
  readonly isProduction?: boolean;
  readonly customCspDirectives?: Readonly<
    Record<string, readonly string[]>
  >;
}

function buildCspString(
  directives: Readonly<Record<string, readonly string[]>>
): string {
  return Object.entries(directives)
    .map(([directive, sources]) => {
      return sources.length > 0
        ? `${directive} ${sources.join(' ')}`
        : directive;
    })
    .join('; ');
}

/**
 * Creates the default Content Security Policy for GrowthAI.
 */
function createDefaultCspDirectives(): Record<
  string,
  readonly string[]
> {
  return {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:',
    ],
    'connect-src': [
      "'self'",
      'https:',
      'wss:',
    ],
    'media-src': [
      "'self'",
      'blob:',
      'https:',
    ],
    'worker-src': [
      "'self'",
      'blob:',
    ],
    'frame-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'manifest-src': ["'self'"],
  };
}

/**
 * Creates production-ready security headers.
 */
export function createSecurityHeaders(
  options?: SecurityHeadersOptions
): Headers {
  const isProduction =
    options?.isProduction ??
    process.env.NODE_ENV === 'production';

  const headers = new Headers();

  // Prevent MIME-type sniffing.
  headers.set(
    'X-Content-Type-Options',
    'nosniff'
  );

  // Prevent clickjacking.
  headers.set(
    'X-Frame-Options',
    'DENY'
  );

  // Control referrer information.
  headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );

  // Restrict browser capabilities.
  headers.set(
    'Permissions-Policy',
    [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=(self)',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'speaker-selection=()',
      'vibrate=()',
      'fullscreen=(self)',
    ].join(', ')
  );

  // Prevent DNS prefetching where possible.
  headers.set(
    'X-DNS-Prefetch-Control',
    'off'
  );

  // Disable legacy browser content inspection.
  headers.set(
    'X-Download-Options',
    'noopen'
  );

  // Enforce HTTPS in production.
  if (isProduction) {
    headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  const defaultDirectives =
    createDefaultCspDirectives();

  const mergedDirectives: Record<
    string,
    readonly string[]
  > = {
    ...defaultDirectives,
    ...(options?.customCspDirectives ?? {}),
  };

  headers.set(
    'Content-Security-Policy',
    buildCspString(mergedDirectives)
  );

  return headers;
}

/**
 * Applies GrowthAI security headers to a Response.
 */
export function applySecurityHeaders(
  response: Response,
  options?: SecurityHeadersOptions
): Response {
  const securityHeaders =
    createSecurityHeaders(options);

  securityHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}
