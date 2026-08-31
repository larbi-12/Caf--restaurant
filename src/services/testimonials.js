import { supabase } from "../lib/supabase";

export async function listTestimonials({ onlyPublished = false } = {}) {
  if (!supabase) return { data: [], error: "not_configured" };
  let query = supabase.from("testimonials").select("*").order("display_order", { ascending: true });
  if (onlyPublished) query = query.eq("is_published", true);
  const { data, error } = await query;
  return { data: data || [], error: error ? error.message : null };
}

export async function createTestimonial(payload) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("testimonials").insert(payload).select().single();
  return { data, error: error ? error.message : null };
}

export async function updateTestimonial(id, patch) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("testimonials").update(patch).eq("id", id).select().single();
  return { data, error: error ? error.message : null };
}

export async function deleteTestimonial(id) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  return { error: error ? error.message : null };
}
