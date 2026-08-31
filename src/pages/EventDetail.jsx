import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button";
import PageHero from "../components/ui/PageHero";
import { useEventBySlug } from "../hooks/useEvents";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

export default function EventDetail() {
  const { slug } = useParams();
  const { event: ev, loading } = useEventBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return null;
  if (!ev) return <Navigate to="/evenements" replace />;

  return (
    <div>
      <PageHero
        eyebrow={dateFormatter.format(new Date(ev.event_date))}
        title={ev.title}
        description={`${ev.event_time} — ${ev.location}`}
        image={ev.image_url}
      />

      <div className="max-w-[1300px] mx-auto px-6 lg:px-10 py-16 md:py-20 grid md:grid-cols-3 gap-14">
        <div className="md:col-span-2 flex flex-col gap-10">
          <Reveal><p className="text-noir/70 leading-relaxed text-lg">{ev.description}</p></Reveal>

          {ev.program?.length > 0 && (
            <Reveal className="flex flex-col gap-4">
              <h2 className="text-2xl">Programme</h2>
              <ul className="flex flex-col gap-3">
                {ev.program.map((step) => (
                  <li key={step} className="flex items-start gap-3 text-noir/75 border-b border-noir/10 pb-3">
                    <span className="text-gold">◆</span>
                    {step}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {ev.menu_special && (
            <Reveal className="flex flex-col gap-2">
              <h2 className="text-2xl">Menu spécial</h2>
              <p className="text-noir/70 leading-relaxed">{ev.menu_special}</p>
            </Reveal>
          )}
        </div>

        <Reveal className="flex flex-col gap-6 bg-beige/30 p-8 h-fit sticky top-28">
          <div>
            <span className="text-xs uppercase tracking-wide text-noir/50">Prix</span>
            <p className="font-serif text-2xl text-terracotta">{ev.price}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-noir/50">Places disponibles</span>
            <p className="text-noir/80">{ev.capacity}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-noir/50">Lieu</span>
            <p className="text-noir/80">{ev.location}</p>
          </div>
          <Button to="/reservation" className="mt-2">Réserver ma place</Button>
        </Reveal>
      </div>
    </div>
  );
}
