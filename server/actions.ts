import 'server-only';

import type { AuthenticatedUser } from '../security/auth';
import { executeService, type ServiceContext } from './service';

/**
 * @file server/actions.ts
 * @description Server-side action execution foundation for GrowthAI.
 *
 * SECURITY:
 * - Server-only execution.
 * - Requires a verified authenticated user.
 * - Creates trusted tenant context before executing business logic.
 * - Never trusts client-provided identity or tenant authority.
 */

export type ServerAction<TInput, TOutput> = (
  context: ServiceContext,
  input: TInput
) => Promise<TOutput>;

export interface ServerActionResult<T> {
  readonly success: true;
  readonly data: T;
}

export interface ServerActionError {
  readonly success: false;
  readonly error: string;
}

export type ActionResult<T> =
  | ServerActionResult<T>
  | ServerActionError;

/**
 * Executes a protected server action with verified authentication
 * and trusted tenant context.
 */
export async function executeServerAction<TInput, TOutput>(
  user: AuthenticatedUser | null | undefined,
  input: TInput,
  action: ServerAction<TInput, TOutput>
): Promise<ActionResult<TOutput>> {
  if (typeof action !== 'function') {
    return {
      success: false,
      error: 'Invalid server action.',
    };
  }

  try {
    const data = await executeService(user, (context) =>
      action(context, input)
    );

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Server action failed.';

    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Creates a reusable protected action handler.
 */
export function createServerAction<TInput, TOutput>(
  action: ServerAction<TInput, TOutput>
) {
  if (typeof action !== 'function') {
    throw new Error('Server action must be a function.');
  }

  return async (
    user: AuthenticatedUser | null | undefined,
    input: TInput
  ): Promise<ActionResult<TOutput>> =>
    executeServerAction(user, input, action);
}
