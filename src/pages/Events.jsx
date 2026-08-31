import { Link } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import { useEvents } from "../hooks/useEvents";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

export default function Events() {
  const { events, loading } = useEvents();

  return (
    <div>
      <PageHero
        eyebrow="Agenda"
        title="Événements"
        description="Brunchs à thème, dîners d'exception et soirées privées."
        image="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1600&q=80"
        height="h-[46vh]"
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 md:py-28">
        {!loading && events.length === 0 ? (
          <p className="text-noir/60 text-center py-16 text-lg">Aucun événement disponible pour le moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {events.map((ev) => (
              <Reveal key={ev.slug}>
                <Link to={`/evenements/${ev.slug}`} className="group flex flex-col gap-4">
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img src={ev.image_url} alt={ev.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <span className="absolute top-4 left-4 eyebrow bg-ivory/90 text-noir px-3 py-1">
                      {dateFormatter.format(new Date(ev.event_date))}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl group-hover:text-gold transition-colors">{ev.title}</h2>
                    <p className="text-noir/60 mt-1">{ev.event_time} — {ev.location}</p>
                    <p className="text-noir/70 mt-2 leading-relaxed">{ev.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
