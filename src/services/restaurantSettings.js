import { supabase } from "../lib/supabase";

export async function getSettings() {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("restaurant_settings").select("*").eq("id", 1).single();
  return { data, error: error ? error.message : null };
}

export async function updateSettings(patch) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase
    .from("restaurant_settings")
    .update(patch)
    .eq("id", 1)
    .select()
    .single();
  return { data, error: error ? error.message : null };
}
