/**
 * @file security/headers.ts
 * @description Centralized HTTP security headers for GrowthAI.
 */

import 'server-only';

export interface SecurityHeadersOptions {
  readonly isProduction?: boolean;
  readonly customCspDirectives?: Readonly<
    Record<string, readonly string[]>
  >;
}

function buildCspString(
  directives: Readonly<
    Record<string, readonly string[]>
  >,
): string {
  return Object.entries(directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }

      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

function createDefaultCspDirectives(): Record<
  string,
  readonly string[]
> {
  return {
    'default-src': ["'self'"],

    'script-src': [
      "'self'",
      "'unsafe-inline'",
    ],

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

    'frame-src': [
      "'self'",
    ],

    'object-src': [
      "'none'",
    ],

    'base-uri': [
      "'self'",
    ],

    'form-action': [
      "'self'",
    ],

    'frame-ancestors': [
      "'none'",
    ],

    'manifest-src': [
      "'self'",
    ],
  };
}

export function createSecurityHeaders(
  options: SecurityHeadersOptions = {},
): Headers {
  const isProduction =
    options.isProduction ??
    process.env.NODE_ENV === 'production';

  const headers =
    new Headers();

  headers.set(
    'X-Content-Type-Options',
    'nosniff',
  );

  headers.set(
    'X-Frame-Options',
    'DENY',
  );

  headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin',
  );

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
    ].join(', '),
  );

  headers.set(
    'X-DNS-Prefetch-Control',
    'off',
  );

  headers.set(
    'X-Download-Options',
    'noopen',
  );

  headers.set(
    'Cross-Origin-Opener-Policy',
    'same-origin',
  );

  headers.set(
    'Cross-Origin-Resource-Policy',
    'same-origin',
  );

  if (isProduction) {
    headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
  }

  const defaultDirectives =
    createDefaultCspDirectives();

  const customDirectives =
    options.customCspDirectives ?? {};

  const mergedDirectives: Record<
    string,
    readonly string[]
  > = {
    ...defaultDirectives,
    ...customDirectives,
  };

  headers.set(
    'Content-Security-Policy',
    buildCspString(
      mergedDirectives,
    ),
  );

  return headers;
}

export function applySecurityHeaders(
  response: Response,
  options?: SecurityHeadersOptions,
): Response {
  const securityHeaders =
    createSecurityHeaders(options);

  securityHeaders.forEach(
    (value, key) => {
      response.headers.set(
        key,
        value,
      );
    },
  );

  return response;
}
