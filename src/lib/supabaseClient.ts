import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Lazy singleton — only create when env vars are present to avoid crash
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      // Return a dummy proxy that no-ops all calls
      return new Proxy({} as SupabaseClient, {
        get: (_target, prop) => {
          if (prop === 'auth') {
            return new Proxy({}, {
              get: () => () => Promise.resolve({ data: { session: null }, error: null }),
            });
          }
          // For .from() etc, return chainable no-ops
          return () => new Proxy({}, {
            get: () => () => Promise.resolve({ data: null, error: null }),
          });
        },
      });
    }
    _client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

export const supabase = getClient();
