import { useMemo, useState } from "react";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import Lightbox from "../components/ui/Lightbox";
import { useGallery } from "../hooks/useGallery";
import { galleryCategories } from "../data/gallery";

export default function Gallery() {
  const { images, loading } = useGallery();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(
    () => images.filter((img) => activeCategory === "Tous" || img.category === activeCategory),
    [images, activeCategory]
  );

  const lightboxImages = filtered.map((img) => ({ src: img.image_url, alt: img.title || "" }));

  return (
    <div>
      <PageHero
        eyebrow="Galerie"
        title="Un regard sur le restaurant"
        description="Restaurant, cuisine, plats, terrasse et événements en images."
        image="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1600&q=80"
        height="h-[46vh]"
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-20">
        <div className="flex flex-wrap gap-3 mb-12">
          {["Tous", ...galleryCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm uppercase tracking-wide border transition-colors ${
                activeCategory === cat
                  ? "bg-noir text-ivory border-noir"
                  : "border-noir/20 text-noir/70 hover:border-noir hover:text-noir"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {!loading && images.length === 0 ? (
          <p className="text-noir/60 text-center py-24 text-lg">Aucune photo disponible pour le moment.</p>
        ) : (
          <Reveal className="columns-2 md:columns-3 gap-4 space-y-4" stagger={0.04}>
            {filtered.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(i)}
                className="block w-full break-inside-avoid overflow-hidden group"
              >
                <img
                  src={img.image_url}
                  alt={img.title || ""}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </button>
            ))}
          </Reveal>
        )}

        {images.length > 0 && filtered.length === 0 && (
          <p className="text-noir/60 text-center py-24 text-lg">Aucune photo trouvée.</p>
        )}
      </div>

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length)}
        onNext={() => setLightboxIndex((i) => (i + 1) % filtered.length)}
      />
    </div>
  );
}
