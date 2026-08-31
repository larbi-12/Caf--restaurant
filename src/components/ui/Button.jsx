import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm tracking-wide transition-all duration-300 whitespace-nowrap";

const variants = {
  primary: "bg-noir text-ivory hover:bg-gold hover:text-noir",
  outline: "border border-noir/30 text-noir hover:border-noir hover:bg-noir hover:text-ivory",
  light: "bg-ivory text-noir hover:bg-gold hover:text-noir",
  ghost: "text-noir hover:text-gold underline underline-offset-4 decoration-gold/50",
};

export default function Button({
  to,
  href,
  variant = "primary",
  className = "",
  children,
  onClick,
  type = "button",
  disabled = false,
  ...rest
}) {
  const classes = `${base} ${variants[variant] || variants.primary} ${className} ${
    disabled ? "opacity-50 pointer-events-none" : ""
  }`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  );
}
