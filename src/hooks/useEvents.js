import { useSupabaseQuery } from "./useSupabaseQuery";
import { listEvents, getEventBySlug } from "../services/events";
import { isSupabaseConfigured } from "../lib/supabase";
import { events as staticEvents } from "../data/events";

function fallback({ upcoming } = {}) {
  let list = staticEvents.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.description,
    image_url: e.image,
    event_date: e.date,
    event_time: e.time,
    price: e.price,
    capacity: e.seats,
    location: e.location,
    program: e.program,
    menu_special: e.menuSpecial,
    is_active: true,
  }));
  if (upcoming) {
    const today = new Date().toISOString().split("T")[0];
    list = list.filter((e) => e.event_date >= today);
  }
  return list.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
}

async function fetcher({ upcoming }) {
  if (!isSupabaseConfigured) return { data: fallback({ upcoming }), error: null };
  return listEvents({ onlyActive: true, upcoming });
}

export function useEvents({ upcoming = false } = {}) {
  const { data, loading, error } = useSupabaseQuery(() => fetcher({ upcoming }), [upcoming]);
  return { events: data || [], loading, error };
}

export function useEventBySlug(slug) {
  const { data, loading, error } = useSupabaseQuery(async () => {
    if (!isSupabaseConfigured) return { data: fallback({}).find((e) => e.slug === slug) || null, error: null };
    return getEventBySlug(slug);
  }, [slug]);
  return { event: data, loading, error };
}
