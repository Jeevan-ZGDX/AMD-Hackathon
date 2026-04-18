import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Supabase credentials missing. Check .env.local");
    return {} as any; // Return dummy to prevent crash, though auth will fail
  }

  return createBrowserClient(url, key);
}
