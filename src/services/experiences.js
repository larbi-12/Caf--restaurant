import { supabase } from "../lib/supabase";

export async function listExperiences({ onlyActive = false } = {}) {
  if (!supabase) return { data: [], error: "not_configured" };
  let query = supabase.from("experiences").select("*").order("display_order", { ascending: true });
  if (onlyActive) query = query.eq("is_active", true);
  const { data, error } = await query;
  return { data: data || [], error: error ? error.message : null };
}

export async function getExperienceBySlug(slug) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("experiences").select("*").eq("slug", slug).maybeSingle();
  return { data, error: error ? error.message : null };
}

export async function createExperience(payload) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("experiences").insert(payload).select().single();
  return { data, error: error ? error.message : null };
}

export async function updateExperience(id, patch) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("experiences").update(patch).eq("id", id).select().single();
  return { data, error: error ? error.message : null };
}

export async function deleteExperience(id) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  return { error: error ? error.message : null };
}
