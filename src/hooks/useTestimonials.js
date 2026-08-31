import { useSupabaseQuery } from "./useSupabaseQuery";
import { listTestimonials } from "../services/testimonials";
import { isSupabaseConfigured } from "../lib/supabase";
import { testimonials as staticTestimonials } from "../data/testimonials";

function fallback() {
  return staticTestimonials.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    avatar_url: t.avatar,
    rating: t.rating,
    content: t.comment,
    is_published: true,
  }));
}

async function fetcher() {
  if (!isSupabaseConfigured) return { data: fallback(), error: null };
  return listTestimonials({ onlyPublished: true });
}

export function useTestimonials() {
  const { data, loading, error } = useSupabaseQuery(fetcher, []);
  return { testimonials: data || [], loading, error };
}
