import { supabase } from "../lib/supabase";

export async function listArticles({ onlyPublished = false } = {}) {
  if (!supabase) return { data: [], error: "not_configured" };
  let query = supabase.from("articles").select("*").order("published_at", { ascending: false });
  if (onlyPublished) query = query.eq("is_published", true);
  const { data, error } = await query;
  return { data: data || [], error: error ? error.message : null };
}

export async function getArticleBySlug(slug) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
  return { data, error: error ? error.message : null };
}

export async function createArticle(payload) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("articles").insert(payload).select().single();
  return { data, error: error ? error.message : null };
}

export async function updateArticle(id, patch) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("articles").update(patch).eq("id", id).select().single();
  return { data, error: error ? error.message : null };
}

export async function deleteArticle(id) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("articles").delete().eq("id", id);
  return { error: error ? error.message : null };
}
