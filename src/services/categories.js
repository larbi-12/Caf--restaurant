import { supabase } from "../lib/supabase";

export async function listCategories({ onlyActive = false } = {}) {
  if (!supabase) return { data: [], error: "not_configured" };
  let query = supabase.from("menu_categories").select("*").order("display_order", { ascending: true });
  if (onlyActive) query = query.eq("is_active", true);
  const { data, error } = await query;
  return { data: data || [], error: error ? error.message : null };
}

export async function createCategory(payload) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("menu_categories").insert(payload).select().single();
  return { data, error: error ? error.message : null };
}

export async function updateCategory(id, patch) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("menu_categories").update(patch).eq("id", id).select().single();
  return { data, error: error ? error.message : null };
}

export async function deleteCategory(id) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  return { error: error ? error.message : null };
}
