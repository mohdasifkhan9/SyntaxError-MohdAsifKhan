import { createBrowserClient, isBrowser } from '@supabase/ssr';

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    // Return placeholder values that won't crash during build
    // The app will show a proper error message when used
    return {
      url: url || 'https://placeholder.supabase.co',
      key: key || 'placeholder-key'
    };
  }
  
  return { url, key };
}

export function createClient() {
  const { url, key } = getSupabaseEnv();
  
  if (isBrowser() && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    console.error('⚠️ Supabase credentials not found. Please add to .env.local:');
    console.error('NEXT_PUBLIC_SUPABASE_URL=your-project-url');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  }
  
  return createBrowserClient(url, key);
}