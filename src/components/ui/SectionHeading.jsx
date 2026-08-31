import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className = "",
}) {
  const alignClasses = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <Reveal className={`flex flex-col gap-4 max-w-2xl ${alignClasses} ${className}`} stagger={0.12}>
      {eyebrow && (
        <span className={`eyebrow ${light ? "text-sable" : "text-gold"}`}>{eyebrow}</span>
      )}
      {title && (
        <h2 className={`text-4xl md:text-5xl leading-[1.1] ${light ? "text-ivory" : "text-noir"}`}>
          {title}
        </h2>
      )}
      {description && (
        <p className={`text-base md:text-lg leading-relaxed ${light ? "text-beige" : "text-noir/70"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
