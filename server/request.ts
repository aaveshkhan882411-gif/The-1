import 'server-only';

/**
 * @file server/request.ts
 * @description Server-side HTTP request utilities for GrowthAI.
 *
 * Provides safe request metadata extraction without trusting
 * client-provided authentication, authorization, or tenant claims.
 */

export interface RequestMetadata {
  readonly method: string;
  readonly url: string;
  readonly requestId: string | null;
  readonly userAgent: string | null;
  readonly ipAddress: string | null;
}

/**
 * Safely extracts a request header value.
 */
export function getRequestHeader(
  request: Request,
  name: string
): string | null {
  if (!(request instanceof Request) || !name.trim()) {
    return null;
  }

  const value = request.headers.get(name);

  return value && value.trim() ? value.trim() : null;
}

/**
 * Extracts the request ID from commonly used request ID headers.
 */
export function getRequestId(request: Request): string | null {
  const requestId =
    getRequestHeader(request, 'x-request-id') ??
    getRequestHeader(request, 'x-correlation-id');

  return requestId;
}

/**
 * Extracts the user-agent header.
 */
export function getUserAgent(request: Request): string | null {
  return getRequestHeader(request, 'user-agent');
}

/**
 * Extracts the originating client IP from trusted proxy headers.
 *
 * NOTE:
 * Proxy headers should only be trusted when the deployment infrastructure
 * is configured to provide and validate them.
 */
export function getClientIp(request: Request): string | null {
  const forwardedFor = getRequestHeader(request, 'x-forwarded-for');

  if (forwardedFor) {
    const firstAddress = forwardedFor
      .split(',')
      .map((value) => value.trim())
      .find(Boolean);

    if (firstAddress) {
      return firstAddress;
    }
  }

  return (
    getRequestHeader(request, 'x-real-ip') ??
    getRequestHeader(request, 'cf-connecting-ip')
  );
}

/**
 * Creates a normalized metadata object for server-side logging and auditing.
 */
export function getRequestMetadata(request: Request): RequestMetadata {
  if (!(request instanceof Request)) {
    throw new Error('Invalid server request.');
  }

  return Object.freeze({
    method: request.method.toUpperCase(),
    url: request.url,
    requestId: getRequestId(request),
    userAgent: getUserAgent(request),
    ipAddress: getClientIp(request),
  });
}

/**
 * Determines whether an HTTP request uses a state-changing method.
 */
export function isMutationRequest(request: Request): boolean {
  if (!(request instanceof Request)) {
    return false;
  }

  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    request.method.toUpperCase()
  );
}
