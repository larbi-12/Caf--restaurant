import { supabase } from "../lib/supabase";

const SELECT = "*, category:menu_categories(id, name, slug)";

export async function listMenuItems({ onlyAvailable = false } = {}) {
  if (!supabase) return { data: [], error: "not_configured" };
  let query = supabase.from("menu_items").select(SELECT).order("display_order", { ascending: true });
  if (onlyAvailable) query = query.eq("is_available", true);
  const { data, error } = await query;
  return { data: data || [], error: error ? error.message : null };
}

export async function getMenuItemBySlug(slug) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("menu_items").select(SELECT).eq("slug", slug).maybeSingle();
  return { data, error: error ? error.message : null };
}

export async function createMenuItem(payload) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("menu_items").insert(payload).select(SELECT).single();
  return { data, error: error ? error.message : null };
}

export async function updateMenuItem(id, patch) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("menu_items").update(patch).eq("id", id).select(SELECT).single();
  return { data, error: error ? error.message : null };
}

export async function deleteMenuItem(id) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  return { error: error ? error.message : null };
}
