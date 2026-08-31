import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import { useEvents } from "../../hooks/useEvents";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

export default function EventTeaser() {
  const { events: allEvents, loading } = useEvents({ upcoming: true });
  const events = allEvents.slice(0, 3);

  if (!loading && events.length === 0) return null;

  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col gap-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading eyebrow="Agenda" title="Prochains événements" />
          <Reveal>
            <Button to="/evenements" variant="ghost" className="px-0">
              Voir tous les événements →
            </Button>
          </Reveal>
        </div>

        <Reveal className="grid md:grid-cols-3 gap-8" stagger={0.12}>
          {events.map((ev) => (
            <Link key={ev.id} to={`/evenements/${ev.slug}`} className="group block">
              <div className="relative overflow-hidden aspect-[4/3] mb-4">
                <img src={ev.image_url} alt={ev.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <p className="eyebrow text-gold text-left">{dateFormatter.format(new Date(ev.event_date))}</p>
              <h3 className="font-serif text-xl text-noir text-left mt-2 group-hover:text-gold transition-colors">{ev.title}</h3>
              <p className="text-noir/60 text-sm text-left mt-1">{ev.event_time} — {ev.location}</p>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
