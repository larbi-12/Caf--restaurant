import { useSupabaseQuery } from "./useSupabaseQuery";
import { listGalleryImages } from "../services/gallery";
import { isSupabaseConfigured } from "../lib/supabase";
import { galleryImages } from "../data/gallery";

function fallback() {
  return galleryImages.map((g) => ({
    id: g.id,
    title: g.alt,
    image_url: g.src,
    category: g.category,
    is_featured: false,
  }));
}

async function fetcher() {
  if (!isSupabaseConfigured) return { data: fallback(), error: null };
  return listGalleryImages();
}

export function useGallery() {
  const { data, loading, error } = useSupabaseQuery(fetcher, []);
  return { images: data || [], loading, error };
}
