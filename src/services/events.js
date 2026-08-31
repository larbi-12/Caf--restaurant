import { supabase } from "../lib/supabase";

export async function listEvents({ onlyActive = false, upcoming = false } = {}) {
  if (!supabase) return { data: [], error: "not_configured" };
  let query = supabase.from("events").select("*").order("event_date", { ascending: true });
  if (onlyActive) query = query.eq("is_active", true);
  if (upcoming) query = query.gte("event_date", new Date().toISOString().split("T")[0]);
  const { data, error } = await query;
  return { data: data || [], error: error ? error.message : null };
}

export async function getEventBySlug(slug) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
  return { data, error: error ? error.message : null };
}

export async function createEvent(payload) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("events").insert(payload).select().single();
  return { data, error: error ? error.message : null };
}

export async function updateEvent(id, patch) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("events").update(patch).eq("id", id).select().single();
  return { data, error: error ? error.message : null };
}

export async function deleteEvent(id) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("events").delete().eq("id", id);
  return { error: error ? error.message : null };
}
