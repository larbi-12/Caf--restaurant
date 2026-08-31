import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter({ light = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setError("Merci de saisir une adresse email valide.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 w-full max-w-sm">
      <div className="flex border-b border-current/30 focus-within:border-current">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Votre email"
          aria-label="Adresse email"
          className={`flex-1 bg-transparent py-2 text-sm outline-none placeholder:opacity-50 ${
            light ? "text-ivory placeholder:text-ivory" : "text-noir placeholder:text-noir"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`text-xs uppercase tracking-wide px-2 shrink-0 transition-opacity ${
            light ? "text-gold" : "text-terracotta"
          } ${status === "loading" ? "opacity-50" : "opacity-100 hover:opacity-70"}`}
        >
          {status === "loading" ? "..." : "S'inscrire"}
        </button>
      </div>
      {status === "error" && <p className="text-xs text-red-400">{error}</p>}
      {status === "success" && (
        <p className={`text-xs ${light ? "text-sable" : "text-terracotta"}`}>
          Merci ! Vous êtes bien inscrit à notre newsletter.
        </p>
      )}
    </form>
  );
}
