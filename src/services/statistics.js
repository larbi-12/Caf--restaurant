import { supabase } from "../lib/supabase";

export async function listStatistics({ onlyActive = false } = {}) {
  if (!supabase) return { data: [], error: "not_configured" };
  let query = supabase.from("statistics").select("*").order("display_order", { ascending: true });
  if (onlyActive) query = query.eq("is_active", true);
  const { data, error } = await query;
  return { data: data || [], error: error ? error.message : null };
}

export async function createStatistic(payload) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("statistics").insert(payload).select().single();
  return { data, error: error ? error.message : null };
}

export async function updateStatistic(id, patch) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("statistics").update(patch).eq("id", id).select().single();
  return { data, error: error ? error.message : null };
}

export async function deleteStatistic(id) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("statistics").delete().eq("id", id);
  return { error: error ? error.message : null };
}
