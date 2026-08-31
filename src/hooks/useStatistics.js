import { useSupabaseQuery } from "./useSupabaseQuery";
import { listStatistics } from "../services/statistics";
import { isSupabaseConfigured } from "../lib/supabase";
import { restaurant } from "../data/restaurant";

function fallback() {
  return restaurant.stats.map((s, i) => ({ id: `stat-${i}`, label: s.label, value: s.value, suffix: s.suffix, is_active: true }));
}

async function fetcher() {
  if (!isSupabaseConfigured) return { data: fallback(), error: null };
  return listStatistics({ onlyActive: true });
}

export function useStatistics() {
  const { data, loading, error } = useSupabaseQuery(fetcher, []);
  return { statistics: data || [], loading, error };
}
