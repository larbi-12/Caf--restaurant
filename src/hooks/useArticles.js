import { useSupabaseQuery } from "./useSupabaseQuery";
import { listArticles, getArticleBySlug } from "../services/articles";
import { isSupabaseConfigured } from "../lib/supabase";
import { articles as staticArticles } from "../data/articles";

function fallback() {
  return staticArticles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    subtitle: a.subtitle,
    excerpt: a.excerpt,
    content: a.content.join("\n\n"),
    cover_image_url: a.image,
    category: a.category,
    author: "Maison Noor",
    published_at: a.date,
    is_published: true,
  }));
}

async function fetcher() {
  if (!isSupabaseConfigured) return { data: fallback(), error: null };
  return listArticles({ onlyPublished: true });
}

export function useArticles() {
  const { data, loading, error } = useSupabaseQuery(fetcher, []);
  return { articles: data || [], loading, error };
}

export function useArticleBySlug(slug) {
  const { data, loading, error } = useSupabaseQuery(async () => {
    if (!isSupabaseConfigured) return { data: fallback().find((a) => a.slug === slug) || null, error: null };
    return getArticleBySlug(slug);
  }, [slug]);
  return { article: data, loading, error };
}
