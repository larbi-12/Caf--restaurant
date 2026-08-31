import { useState } from "react";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import { useRestaurantSettings } from "../hooks/useRestaurantSettings";
import { createReservation } from "../services/reservations";

const timeSlots = ["12:00", "12:30", "14:00", "19:00", "19:30", "20:30", "21:00", "21:30"];
const occasions = ["Dîner classique", "Anniversaire", "Rendez-vous d'affaires", "Demande en mariage", "Autre"];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  guests: 2,
  occasion: occasions[0],
  message: "",
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Le nom est requis.";
  const phoneDigits = form.phone.replace(/[\s.-]/g, "");
  if (!/^\+?\d{8,15}$/.test(phoneDigits)) errors.phone = "Numéro de téléphone invalide.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Adresse email invalide.";
  if (!form.date) errors.date = "Merci de choisir une date.";
  if (!form.time) errors.time = "Merci de choisir un horaire.";
  if (!form.guests || form.guests < 1) errors.guests = "Nombre de personnes invalide.";
  return errors;
}

export default function Reservation() {
  const { settings } = useRestaurantSettings();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [submitError, setSubmitError] = useState("");

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("loading");
    setSubmitError("");

    const { error } = await createReservation({
      customer_name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      reservation_date: form.date,
      reservation_time: form.time,
      guests: form.guests,
      occasion: form.occasion,
      message: form.message.trim() || null,
    });

    if (error) {
      setStatus("error");
      setSubmitError(
        error === "not_configured"
          ? "La réservation en ligne n'est pas encore configurée. Merci de nous contacter directement."
          : "Une erreur est survenue. Merci de réessayer ou de nous contacter directement."
      );
      return;
    }

    setStatus("success");
  };

  const today = new Date().toISOString().split("T")[0];

  const whatsappMessage = encodeURIComponent(
    `Bonjour, je viens de faire une demande de réservation pour le ${form.date} à ${form.time} (${form.guests} personne(s)). Nom : ${form.name}.`
  );

  if (status === "success") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 pt-24">
        <Reveal className="max-w-lg text-center flex flex-col items-center gap-6">
          <span className="text-5xl text-gold">✓</span>
          <h1 className="text-3xl md:text-4xl">Votre demande de réservation a bien été envoyée.</h1>
          <p className="text-noir/70 leading-relaxed">
            Merci {form.name || ""}. Notre équipe confirmera votre réservation par téléphone ou email dans les
            plus brefs délais.
          </p>
          {settings?.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Contacter le restaurant sur WhatsApp
            </a>
          )}
          <button
            onClick={() => {
              setForm(initialForm);
              setStatus("idle");
            }}
            className="text-sm uppercase tracking-wide text-noir/60 hover:text-gold transition-colors underline underline-offset-4"
          >
            Faire une nouvelle demande
          </button>
        </Reveal>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Réservation"
        title="Réservez votre table"
        description="Quelques informations et votre table est en préparation."
        image="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&q=80"
        height="h-[40vh]"
      />

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Nom complet" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass(errors.name)}
                placeholder="Votre nom"
              />
            </Field>
            <Field label="Téléphone" error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass(errors.phone)}
                placeholder="+212 6 00 11 22 33"
              />
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass(errors.email)}
              placeholder="vous@email.com"
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-6">
            <Field label="Date" error={errors.date}>
              <input
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className={inputClass(errors.date)}
              />
            </Field>
            <Field label="Nombre de personnes" error={errors.guests}>
              <input
                type="number"
                min={1}
                max={20}
                value={form.guests}
                onChange={(e) => update("guests", Number(e.target.value))}
                className={inputClass(errors.guests)}
              />
            </Field>
            <Field label="Occasion">
              <select value={form.occasion} onChange={(e) => update("occasion", e.target.value)} className={inputClass()}>
                {occasions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Heure" error={errors.time}>
            <div className="flex flex-wrap gap-3">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => update("time", slot)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    form.time === slot
                      ? "bg-noir text-ivory border-noir"
                      : "border-noir/20 text-noir/70 hover:border-noir"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Message (optionnel)">
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className={inputClass() + " resize-none"}
              placeholder="Allergies, demandes particulières..."
            />
          </Field>

          {status === "error" && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-noir text-ivory text-sm uppercase tracking-wide hover:bg-gold hover:text-noir transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Envoi en cours..." : "Demander une réservation"}
          </button>

          {settings?.phone && (
            <p className="text-xs text-noir/50 text-center">
              Pour toute urgence, contactez-nous directement au {settings.phone}.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wide text-noir/50">{label}</span>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

function inputClass(error) {
  return `w-full border-b bg-transparent py-2.5 outline-none transition-colors ${
    error ? "border-red-400 focus:border-red-500" : "border-noir/20 focus:border-noir"
  }`;
}
