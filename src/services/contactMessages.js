import { supabase } from "../lib/supabase";

export async function createContactMessage(payload) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("contact_messages").insert(payload);
  return { error: error ? error.message : null };
}

export async function listContactMessages({ status = "all" } = {}) {
  if (!supabase) return { data: [], error: "not_configured" };
  let query = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);
  const { data, error } = await query;
  return { data: data || [], error: error ? error.message : null };
}

export async function updateContactMessageStatus(id, status) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("contact_messages").update({ status }).eq("id", id).select().single();
  return { data, error: error ? error.message : null };
}

export async function deleteContactMessage(id) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  return { error: error ? error.message : null };
}
