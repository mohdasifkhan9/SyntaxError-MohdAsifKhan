import { createBrowserClient, isBrowser } from '@supabase/ssr';

let hasWarnedMissingSupabaseCreds = false;

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return placeholder values that won't crash during build
    // The app will show a proper error message when used
    return {
      url: url || 'https://placeholder.supabase.co',
      key: key || 'placeholder-key',
    };
  }

  return { url, key };
}

export function createClient() {
  const { url, key } = getSupabaseEnv();

  if (
    isBrowser() &&
    process.env.NODE_ENV !== 'production' &&
    !hasWarnedMissingSupabaseCreds &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ) {
    hasWarnedMissingSupabaseCreds = true;
    console.warn('[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  }

  return createBrowserClient(url, key);
}
