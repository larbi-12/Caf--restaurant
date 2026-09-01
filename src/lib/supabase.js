import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "[Maison Noor] Supabase n'est pas configuré. Copiez .env.example vers .env.local et renseignez VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY."
  );
}

/**
 * Auth is handled by Supabase Auth (email + password) — see
 * src/context/AuthContext.jsx. supabase-js persists the session in localStorage
 * and attaches its JWT to every request automatically, so RLS policies read the
 * signed-in identity via auth.jwt() ->> 'email' (see supabase/schema.sql,
 * is_admin()). When signed out, requests use the anon key and only public data
 * is reachable — public pages are unaffected.
 */
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const BUCKETS = {
  restaurant: "restaurant",
  menu: "menu",
  gallery: "gallery",
  events: "events",
  articles: "articles",
  testimonials: "testimonials",
  experiences: "experiences",
};
