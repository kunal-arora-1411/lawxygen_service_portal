/**
 * Backend boundary.
 *
 * Keep all future network/database calls behind this file (or this folder).
 * UI components should never talk directly to a database.
 *
 * Later we can connect:
 * - Node.js / NestJS / Express
 * - Laravel / PHP
 * - Supabase
 * - Any REST or GraphQL backend
 *
 * The UI should only consume typed functions from this layer.
 */

export type ApiResult<T> = {
  data: T;
  error?: string;
};

export async function getPlaceholderData<T>(fallback: T): Promise<ApiResult<T>> {
  return { data: fallback };
}
