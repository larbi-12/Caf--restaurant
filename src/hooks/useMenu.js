import { useSupabaseQuery } from "./useSupabaseQuery";
import { listMenuItems, getMenuItemBySlug } from "../services/menu";
import { listCategories } from "../services/categories";
import { isSupabaseConfigured } from "../lib/supabase";
import { dishes as staticDishes, categories as staticCategoryNames } from "../data/menu";

function slugify(str) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
}

function fallbackItems() {
  return staticDishes.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    description: d.description,
    long_description: d.description,
    price: d.price,
    image_url: d.image,
    ingredients: d.ingredients,
    allergens: d.allergens,
    is_featured: d.featured,
    is_available: true,
    category: { name: d.category, slug: slugify(d.category) },
  }));
}

function fallbackCategories() {
  return staticCategoryNames.map((name, i) => ({
    id: slugify(name),
    name,
    slug: slugify(name),
    display_order: i,
    is_active: true,
  }));
}

async function fetchItems() {
  if (!isSupabaseConfigured) return { data: fallbackItems(), error: null };
  return listMenuItems({ onlyAvailable: true });
}

async function fetchCategories() {
  if (!isSupabaseConfigured) return { data: fallbackCategories(), error: null };
  return listCategories({ onlyActive: true });
}

export function useMenuItems() {
  const { data, loading, error } = useSupabaseQuery(fetchItems, []);
  return { items: data || [], loading, error };
}

export function useCategories() {
  const { data, loading, error } = useSupabaseQuery(fetchCategories, []);
  return { categories: data || [], loading, error };
}

export function useMenuItemBySlug(slug) {
  const { data, loading, error } = useSupabaseQuery(async () => {
    if (!isSupabaseConfigured) {
      return { data: fallbackItems().find((d) => d.slug === slug) || null, error: null };
    }
    return getMenuItemBySlug(slug);
  }, [slug]);
  return { item: data, loading, error };
}

export { fallbackItems as fallbackMenuItems };
