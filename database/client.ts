/**
 * @file database/client.ts
 * @description Production-ready browser-side Supabase client for GrowthAI SaaS platform using @supabase/ssr.
 */

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * Creates and returns a singleton-like or reusable browser-safe Supabase client
 * for client-side components in Next.js 14 App Router.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Pre-instantiated browser Supabase client for direct import in client components.
 */
export const supabase = createClient();

