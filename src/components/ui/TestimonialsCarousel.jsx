import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { useTestimonials } from "../../hooks/useTestimonials";

export default function TestimonialsCarousel({ light = false }) {
  const { testimonials, loading } = useTestimonials();
  const [index, setIndex] = useState(0);
  const cardRef = useRef(null);

  const go = (dir) => {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length === 0) return;
    gsap.fromTo(cardRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
  }, [index, testimonials.length]);

  if (loading || testimonials.length === 0) return null;

  const t = testimonials[index];

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div ref={cardRef} className="flex flex-col items-center text-center gap-5 max-w-2xl mx-auto">
        <div className="flex gap-1" aria-label={`Note ${t.rating} sur 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < t.rating ? "text-gold" : (light ? "text-ivory/20" : "text-noir/20")}>
              ★
            </span>
          ))}
        </div>
        <p className={`font-serif text-xl md:text-2xl leading-relaxed ${light ? "text-ivory" : "text-noir"}`}>
          « {t.content} »
        </p>
        <div className="flex items-center gap-3 mt-2">
          <img src={t.avatar_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
          <div className="text-left">
            <p className={`text-sm font-medium ${light ? "text-ivory" : "text-noir"}`}>{t.name}</p>
            <p className={`text-xs ${light ? "text-beige/60" : "text-noir/50"}`}>{t.role}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          aria-label="Témoignage précédent"
          onClick={() => go(-1)}
          className={`w-10 h-10 flex items-center justify-center border rounded-full transition-colors ${
            light ? "border-ivory/30 text-ivory hover:bg-ivory hover:text-noir" : "border-noir/20 text-noir hover:bg-noir hover:text-ivory"
          }`}
        >
          ←
        </button>
        <div className="flex gap-2">
          {testimonials.map((item, i) => (
            <button
              key={item.id}
              aria-label={`Aller au témoignage ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-gold w-6" : light ? "bg-ivory/30" : "bg-noir/20"
              }`}
            />
          ))}
        </div>
        <button
          aria-label="Témoignage suivant"
          onClick={() => go(1)}
          className={`w-10 h-10 flex items-center justify-center border rounded-full transition-colors ${
            light ? "border-ivory/30 text-ivory hover:bg-ivory hover:text-noir" : "border-noir/20 text-noir hover:bg-noir hover:text-ivory"
          }`}
        >
          →
        </button>
      </div>
    </div>
  );
}
