import { supabase } from "../lib/supabase";

export async function listGalleryImages() {
  if (!supabase) return { data: [], error: "not_configured" };
  const { data, error } = await supabase.from("gallery").select("*").order("display_order", { ascending: true });
  return { data: data || [], error: error ? error.message : null };
}

export async function createGalleryImage(payload) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("gallery").insert(payload).select().single();
  return { data, error: error ? error.message : null };
}

export async function updateGalleryImage(id, patch) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("gallery").update(patch).eq("id", id).select().single();
  return { data, error: error ? error.message : null };
}

export async function deleteGalleryImage(id) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  return { error: error ? error.message : null };
}
