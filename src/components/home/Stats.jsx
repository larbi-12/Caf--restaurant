import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useStatistics } from "../../hooks/useStatistics";

export default function Stats() {
  const { statistics, loading } = useStatistics();
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (loading || statistics.length === 0) return;
    const ctx = gsap.context(() => {
      const nums = ref.current.querySelectorAll("[data-count]");
      nums.forEach((el) => {
        const end = parseFloat(el.dataset.count);
        const decimals = el.dataset.count.includes(".") ? 1 : 0;
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: end,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = obj.val.toFixed(decimals);
              },
            });
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [loading, statistics]);

  if (loading || statistics.length === 0) {
    return <section className="bg-charcoal py-16 md:py-20 h-[140px]" />;
  }

  return (
    <section ref={ref} className="bg-charcoal py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
        {statistics.map((s) => (
          <div key={s.id} className="text-center flex flex-col gap-2">
            <p className="font-serif text-4xl md:text-5xl text-gold">
              <span data-count={s.value}>0</span>
              {s.suffix}
            </p>
            <p className="text-beige/70 text-xs md:text-sm uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
