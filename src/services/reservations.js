import { supabase } from "../lib/supabase";

export async function createReservation(payload) {
  if (!supabase) return { data: null, error: "not_configured" };
  // Public (anon) role can INSERT but not SELECT reservations by design (customers
  // must not be able to read other people's bookings), so we don't request the
  // row back — asking for it would trigger an RLS failure on the implicit read-back.
  const { error } = await supabase.from("reservations").insert(payload);
  return { data: null, error: error ? error.message : null };
}

export async function listReservations({ status = "all", search = "" } = {}) {
  if (!supabase) return { data: [], error: "not_configured" };
  let query = supabase.from("reservations").select("*").order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);
  if (search) query = query.or(`customer_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  const { data, error } = await query;
  return { data: data || [], error: error ? error.message : null };
}

export async function updateReservationStatus(id, status) {
  if (!supabase) return { data: null, error: "not_configured" };
  const { data, error } = await supabase.from("reservations").update({ status }).eq("id", id).select().single();
  return { data, error: error ? error.message : null };
}

export async function deleteReservation(id) {
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.from("reservations").delete().eq("id", id);
  return { error: error ? error.message : null };
}

export function subscribeToReservations(onInsert) {
  if (!supabase) return () => {};
  const channel = supabase
    .channel("reservations-changes")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "reservations" }, (payload) => {
      onInsert(payload.new);
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}
