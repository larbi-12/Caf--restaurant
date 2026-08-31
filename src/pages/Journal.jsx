import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import { useArticles } from "../hooks/useArticles";
import { articleCategories } from "../data/articles";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

export default function Journal() {
  const { articles, loading } = useArticles();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const featured = articles[0];

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (featured && a.id === featured.id) return false;
      const matchesCategory = category === "Tous" || a.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.category || "").toLowerCase().includes(q) ||
        (a.excerpt || "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [articles, query, category, featured]);

  const popular = articles.slice(0, 3);

  if (!loading && articles.length === 0) {
    return (
      <div>
        <PageHero eyebrow="Journal" title="Le journal" description="Gastronomie, culture, cuisine et lifestyle." height="h-[46vh]" />
        <p className="text-noir/60 text-center py-24 text-lg">Aucun article disponible pour le moment.</p>
      </div>
    );
  }

  if (!featured) return null;

  return (
    <div>
      <PageHero
        eyebrow="Journal"
        title="Le journal"
        description="Gastronomie, culture, cuisine et lifestyle."
        image={featured.cover_image_url}
        height="h-[46vh]"
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-20">
        <Reveal>
          <Link to={`/journal/${featured.slug}`} className="group grid md:grid-cols-2 gap-10 mb-20 items-center">
            <div className="relative overflow-hidden aspect-[16/10]">
              <img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-col gap-4">
              <span className="eyebrow text-gold">À la une — {featured.category}</span>
              <h2 className="font-serif text-3xl md:text-4xl group-hover:text-gold transition-colors">{featured.title}</h2>
              <p className="text-noir/70 leading-relaxed">{featured.excerpt}</p>
              <span className="text-sm text-noir/50">{dateFormatter.format(new Date(featured.published_at))}</span>
            </div>
          </Link>
        </Reveal>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article..."
                aria-label="Rechercher un article"
                className="border-b border-noir/20 focus:border-noir py-2 bg-transparent outline-none placeholder:text-noir/40 max-w-xs"
              />
              <div className="flex flex-wrap gap-2">
                {["Tous", ...articleCategories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-1.5 text-xs uppercase tracking-wide border transition-colors ${
                      category === cat
                        ? "bg-noir text-ivory border-noir"
                        : "border-noir/20 text-noir/60 hover:border-noir"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="text-noir/60 py-16 text-center text-lg">Aucun article trouvé.</p>
            ) : (
              <Reveal className="grid sm:grid-cols-2 gap-10" stagger={0.1}>
                {filtered.map((a) => (
                  <Link key={a.id} to={`/journal/${a.slug}`} className="group flex flex-col gap-3">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img src={a.cover_image_url} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <span className="eyebrow text-gold">{a.category}</span>
                    <h3 className="font-serif text-xl group-hover:text-gold transition-colors">{a.title}</h3>
                    <span className="text-xs text-noir/50">{dateFormatter.format(new Date(a.published_at))}</span>
                  </Link>
                ))}
              </Reveal>
            )}
          </div>

          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
            <h3 className="eyebrow text-noir/50">Articles populaires</h3>
            <div className="flex flex-col gap-5">
              {popular.map((a) => (
                <Link key={a.id} to={`/journal/${a.slug}`} className="group flex gap-3">
                  <div className="w-16 h-16 overflow-hidden shrink-0">
                    <img src={a.cover_image_url} alt={a.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm leading-snug group-hover:text-gold transition-colors">{a.title}</p>
                    <span className="text-xs text-noir/50">{dateFormatter.format(new Date(a.published_at))}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
