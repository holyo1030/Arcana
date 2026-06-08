import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jeadfjsqedejbwzokucd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplYWRmanNxZWRlamJ3em9rdWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NDIzODEsImV4cCI6MjA5NjIxODM4MX0.cdL8oj6arRI6fk_q3xuMww6gE1dI9t-BLnWphSgOjcs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

export async function signOut() {
  await supabase.auth.signOut();
}

export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}
