import { useSupabaseQuery } from "./useSupabaseQuery";
import { listFaqs } from "../services/faqs";
import { isSupabaseConfigured } from "../lib/supabase";
import { faqs as staticFaqs } from "../data/faqs";

async function fetcher() {
  if (!isSupabaseConfigured) return { data: staticFaqs, error: null };
  return listFaqs({ onlyPublished: true });
}

export function useFaqs() {
  const { data, loading, error } = useSupabaseQuery(fetcher, []);
  return { faqs: data || [], loading, error };
}
