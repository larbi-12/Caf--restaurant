import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";

/**
 * Generic scroll-reveal wrapper. `y`/`x` set the entrance offset,
 * `stagger` cascades direct children instead of animating the wrapper as one block.
 */
export default function Reveal({
  as: Tag = "div",
  children,
  className = "",
  y = 40,
  x = 0,
  duration = 1,
  delay = 0,
  stagger = 0,
  once = true,
  ...rest
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y, x });
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once,
        onEnter: () => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            x: 0,
            duration,
            delay,
            stagger: stagger || 0,
            ease: "power3.out",
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [y, x, duration, delay, stagger, once]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
