import { useSupabaseQuery } from "./useSupabaseQuery";
import { listExperiences, getExperienceBySlug } from "../services/experiences";
import { isSupabaseConfigured } from "../lib/supabase";
import { experiences as staticExperiences } from "../data/experiences";

function fallback() {
  return staticExperiences.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.short,
    long_description: e.description,
    image_url: e.image,
    gallery_urls: e.gallery,
    price: e.price,
    duration: e.duration,
    capacity: e.guests,
    included: e.included,
    hours: e.hours,
    faq: e.faq,
    is_active: true,
  }));
}

async function fetcher() {
  if (!isSupabaseConfigured) return { data: fallback(), error: null };
  return listExperiences({ onlyActive: true });
}

export function useExperiences() {
  const { data, loading, error } = useSupabaseQuery(fetcher, []);
  return { experiences: data || [], loading, error };
}

export function useExperienceBySlug(slug) {
  const { data, loading, error } = useSupabaseQuery(async () => {
    if (!isSupabaseConfigured) return { data: fallback().find((e) => e.slug === slug) || null, error: null };
    return getExperienceBySlug(slug);
  }, [slug]);
  return { experience: data, loading, error };
}
