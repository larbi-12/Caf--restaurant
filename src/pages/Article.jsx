import { useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import { useArticleBySlug, useArticles } from "../hooks/useArticles";
import { useRestaurantSettings } from "../hooks/useRestaurantSettings";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

export default function Article() {
  const { slug } = useParams();
  const { article, loading } = useArticleBySlug(slug);
  const { articles } = useArticles();
  const { settings } = useRestaurantSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return null;
  if (!article) return <Navigate to="/journal" replace />;

  const related = articles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3);
  const paragraphs = (article.content || "").split(/\n\s*\n/).filter(Boolean);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <article className="pt-28 md:pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 flex flex-col gap-6 text-center mb-12">
        <Link to="/journal" className="text-sm text-noir/50 hover:text-gold transition-colors mx-auto">
          ← Retour au journal
        </Link>
        <Reveal><span className="eyebrow text-gold">{article.category}</span></Reveal>
        <Reveal><h1 className="text-3xl md:text-5xl leading-[1.15]">{article.title}</h1></Reveal>
        {article.subtitle && <Reveal><p className="font-serif text-xl text-noir/60 italic">{article.subtitle}</p></Reveal>}
        <Reveal><span className="text-sm text-noir/50">{dateFormatter.format(new Date(article.published_at))}</span></Reveal>
      </div>

      <Reveal className="max-w-5xl mx-auto px-6 mb-16">
        <div className="aspect-[16/9] overflow-hidden">
          <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
        </div>
      </Reveal>

      <div className="max-w-2xl mx-auto px-6 flex flex-col gap-6">
        {paragraphs.map((p, i) => (
          <Reveal key={i}><p className="text-noir/75 text-lg leading-relaxed">{p}</p></Reveal>
        ))}

        <Reveal className="flex items-center gap-4 pt-8 border-t border-noir/10 mt-6">
          <span className="text-sm text-noir/50">Partager :</span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(article.title + " — " + shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-noir/70 hover:text-gold transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-noir/70 hover:text-gold transition-colors"
          >
            Facebook
          </a>
        </Reveal>
      </div>

      {related.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 mt-24">
          <Reveal><h2 className="text-2xl mb-8">Articles similaires</h2></Reveal>
          <Reveal className="grid sm:grid-cols-3 gap-8" stagger={0.1}>
            {related.map((a) => (
              <Link key={a.id} to={`/journal/${a.slug}`} className="group flex flex-col gap-2">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={a.cover_image_url} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <h3 className="font-serif text-lg group-hover:text-gold transition-colors">{a.title}</h3>
              </Link>
            ))}
          </Reveal>
        </div>
      )}

      <p className="sr-only">{settings?.restaurant_name}</p>
    </article>
  );
}
