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
 * Auth is handled entirely by Clerk (see src/context/AuthContext.jsx) — Supabase
 * never issues its own session. Instead, Supabase is configured as a "Third-Party
 * Auth" consumer of Clerk (Dashboard → Authentication → Sign In / Providers →
 * Third Party Auth), so it can verify Clerk's JWT directly via Clerk's public
 * JWKS. This `accessToken` callback hands supabase-js the current Clerk session
 * token (if any) on every request; RLS policies then read admin identity via
 * auth.jwt() exactly as before. When signed out, this resolves to null and
 * supabase-js falls back to the anon key — public pages are unaffected.
 */
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      accessToken: async () => {
        try {
          return (await window.Clerk?.session?.getToken()) ?? null;
        } catch {
          return null;
        }
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
