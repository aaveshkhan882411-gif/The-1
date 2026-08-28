import type { ServerContext } from "./context";
import { ServerError } from "./errors";

export type Guard = (context: ServerContext) => void | Promise<void>;

export function requireAuth(): Guard {
  return async (context) => {
    if (!context.user) {
      throw new ServerError("UNAUTHORIZED", "Authentication is required.");
    }
  };
}

export function requireRole(
  ...roles: string[]
): Guard {
  return async (context) => {
    if (!context.user) {
      throw new ServerError("UNAUTHORIZED", "Authentication is required.");
    }

    const userRole = context.user.role;

    if (!roles.includes(userRole)) {
      throw new ServerError(
        "FORBIDDEN",
        "You do not have permission to perform this action."
      );
    }
  };
}

export function requireTenant(): Guard {
  return async (context) => {
    if (!context.tenantId) {
      throw new ServerError(
        "TENANT_REQUIRED",
        "A valid tenant context is required."
      );
    }
  };
}

export async function runGuards(
  guards: Guard[],
  context: ServerContext
): Promise<void> {
  for (const guard of guards) {
    await guard(context);
  }
}
