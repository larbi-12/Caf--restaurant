import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";
import Button from "../ui/Button";

function todayHoursLabel(openingHours = []) {
  const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const today = days[new Date().getDay()];
  const match = openingHours.find((h) => h.day?.toLowerCase().includes(today));
  return match?.time || null;
}

export default function Hero() {
  const { settings, loading } = useRestaurantSettings();
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (loading || !settings) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(imgRef.current, { scale: 1.25, opacity: 0 }, { scale: 1.05, opacity: 1, duration: 1.8 });
      tl.fromTo(
        contentRef.current.querySelectorAll("[data-reveal]"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15 },
        "-=1.1"
      );

      gsap.to(imgRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to(contentRef.current, {
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "70% top", scrub: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, settings]);

  if (loading || !settings) {
    return <section className="h-screen min-h-[640px] w-full bg-noir" />;
  }

  const todayHours = todayHoursLabel(settings.opening_hours);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[640px] w-full overflow-hidden bg-noir">
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <img
          src={settings.hero_image_url}
          alt={`Salle du restaurant ${settings.restaurant_name} plongée dans une lumière chaude`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/60 via-noir/20 to-noir/70" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-end px-6 lg:px-10 pb-20 max-w-[1400px] mx-auto"
      >
        <span data-reveal className="eyebrow text-gold mb-6">
          {settings.restaurant_name} — {settings.city}
        </span>
        <h1 data-reveal className="text-ivory text-5xl md:text-7xl lg:text-8xl leading-[1.02] max-w-4xl">
          {settings.hero_title}
        </h1>
        <p data-reveal className="text-beige/80 text-base md:text-lg max-w-lg mt-6">
          {settings.hero_description}
        </p>

        <div data-reveal className="flex flex-wrap items-center gap-4 mt-10">
          <Button to="/menu" variant="light">Découvrir la carte</Button>
          <Button to={settings.cta_link || "/reservation"} variant="outline" className="border-ivory/50 text-ivory hover:bg-ivory hover:text-noir">
            {settings.cta_text || "Réserver une table"}
          </Button>
        </div>

        {todayHours && (
          <div data-reveal className="flex items-center gap-2 mt-12 text-beige/70 text-sm">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Ouvert aujourd'hui — {todayHours}
          </div>
        )}
      </div>
    </section>
  );
}
