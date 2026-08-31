import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button";
import PageHero from "../components/ui/PageHero";
import FAQAccordion from "../components/ui/FAQAccordion";
import { useExperienceBySlug } from "../hooks/useExperiences";

export default function ExperienceDetail() {
  const { slug } = useParams();
  const { experience: exp, loading } = useExperienceBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return null;
  if (!exp) return <Navigate to="/experiences" replace />;

  return (
    <div>
      <PageHero eyebrow="Expérience" title={exp.title} description={exp.description} image={exp.image_url} />

      <div className="max-w-[1300px] mx-auto px-6 lg:px-10 py-16 md:py-20 grid md:grid-cols-3 gap-14">
        <div className="md:col-span-2 flex flex-col gap-12">
          <Reveal><p className="text-noir/70 leading-relaxed text-lg">{exp.long_description}</p></Reveal>

          {exp.gallery_urls?.length > 0 && (
            <Reveal className="grid grid-cols-3 gap-6" stagger={0.1}>
              {exp.gallery_urls.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden">
                  <img src={src} alt={`${exp.title} ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </Reveal>
          )}

          {exp.included?.length > 0 && (
            <Reveal className="flex flex-col gap-4">
              <h2 className="text-2xl">Ce qui est inclus</h2>
              <ul className="flex flex-col gap-2">
                {exp.included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-noir/75">
                    <span className="text-gold mt-1">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {exp.faq?.length > 0 && (
            <Reveal className="flex flex-col gap-4">
              <h2 className="text-2xl">Questions fréquentes</h2>
              <FAQAccordion items={exp.faq} />
            </Reveal>
          )}
        </div>

        <Reveal className="flex flex-col gap-6 bg-beige/30 p-8 h-fit sticky top-28">
          <div>
            <span className="text-xs uppercase tracking-wide text-noir/50">Prix</span>
            <p className="font-serif text-2xl text-terracotta">{exp.price}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-noir/50">Durée</span>
            <p className="text-noir/80">{exp.duration}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-noir/50">Convives</span>
            <p className="text-noir/80">{exp.capacity}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-noir/50">Horaires</span>
            <p className="text-noir/80">{exp.hours}</p>
          </div>
          <Button to="/reservation" className="mt-2">Réserver cette expérience</Button>
        </Reveal>
      </div>
    </div>
  );
}
