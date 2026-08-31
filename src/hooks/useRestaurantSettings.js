import { useSupabaseQuery } from "./useSupabaseQuery";
import { getSettings } from "../services/restaurantSettings";
import { isSupabaseConfigured } from "../lib/supabase";
import { restaurant as staticRestaurant } from "../data/restaurant";

function fallbackSettings() {
  return {
    restaurant_name: staticRestaurant.name,
    logo_url: null,
    favicon_url: null,
    tagline: staticRestaurant.tagline,
    description: staticRestaurant.tagline,
    phone: staticRestaurant.phoneDisplay,
    email: staticRestaurant.email,
    whatsapp: staticRestaurant.whatsapp,
    address: staticRestaurant.address,
    city: staticRestaurant.city,
    country: staticRestaurant.country,
    google_maps_url: staticRestaurant.mapsDirections,
    instagram_url: staticRestaurant.social.instagram,
    facebook_url: staticRestaurant.social.facebook,
    tiktok_url: null,
    opening_hours: staticRestaurant.hours,
    hero_title: staticRestaurant.tagline,
    hero_subtitle: `${staticRestaurant.name} — ${staticRestaurant.city}`,
    hero_description: `Cuisine marocaine contemporaine, café premium et expériences privées, au cœur de ${staticRestaurant.city}.`,
    hero_image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80",
    cta_text: "Réserver une table",
    cta_link: "/reservation",
    primary_color: "#14110f",
    secondary_color: "#b08a4e",
  };
}

async function fetchSettings() {
  if (!isSupabaseConfigured) return { data: fallbackSettings(), error: null };
  const { data, error } = await getSettings();
  return { data: data || fallbackSettings(), error };
}

export function useRestaurantSettings() {
  const { data, loading, error } = useSupabaseQuery(fetchSettings, []);
  return { settings: data, loading, error };
}

export function mapsEmbedUrl(settings) {
  const query = `${settings.address || ""} ${settings.city || ""}`.trim();
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
