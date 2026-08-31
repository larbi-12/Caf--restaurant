import { useState } from "react";
import PageHero from "../components/ui/PageHero";
import Reveal from "../components/ui/Reveal";
import FAQAccordion from "../components/ui/FAQAccordion";
import { useRestaurantSettings, mapsEmbedUrl } from "../hooks/useRestaurantSettings";
import { useFaqs } from "../hooks/useFaqs";
import { createContactMessage } from "../services/contactMessages";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const { settings } = useRestaurantSettings();
  const { faqs } = useFaqs();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!form.name.trim()) found.name = "Le nom est requis.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) found.email = "Adresse email invalide.";
    if (!form.message.trim()) found.message = "Le message ne peut pas être vide.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("loading");
    setSubmitError("");

    const { error } = await createContactMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim() || null,
      message: form.message.trim(),
    });

    if (error) {
      setStatus("error");
      setSubmitError(
        error === "not_configured"
          ? "L'envoi de message n'est pas encore configuré. Merci de nous contacter directement."
          : "Une erreur est survenue. Merci de réessayer ou de nous contacter directement."
      );
      return;
    }

    setStatus("success");
    setForm(initialForm);
  };

  if (!settings) return null;

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Parlons-en"
        description="Une question, un projet d'événement ? Notre équipe vous répond."
        image="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1600&q=80"
        height="h-[40vh]"
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-20 grid md:grid-cols-2 gap-16">
        <Reveal className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl">Coordonnées</h2>
            <p className="text-noir/70">{settings.address}</p>
            <a href={`tel:${settings.phone}`} className="text-noir/70 hover:text-gold transition-colors">{settings.phone}</a>
            <a href={`mailto:${settings.email}`} className="text-noir/70 hover:text-gold transition-colors">{settings.email}</a>
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-noir/70 hover:text-gold transition-colors"
              >
                WhatsApp
              </a>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl mb-2">Horaires</h2>
            {(settings.opening_hours || []).map((h) => (
              <div key={h.day} className="flex justify-between max-w-sm text-sm border-b border-noir/10 py-2">
                <span className="text-noir/70">{h.day}</span>
                <span className="text-noir/70">{h.time}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="text-sm uppercase tracking-wide text-noir/60 hover:text-gold transition-colors">Instagram</a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="text-sm uppercase tracking-wide text-noir/60 hover:text-gold transition-colors">Facebook</a>
            )}
          </div>

          <div className="aspect-video overflow-hidden">
            <iframe
              title={`Localisation ${settings.restaurant_name}`}
              src={mapsEmbedUrl(settings)}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        <Reveal>
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center text-center gap-4 h-full py-16">
              <span className="text-4xl text-gold">✓</span>
              <h2 className="text-2xl">Votre message a bien été envoyé.</h2>
              <p className="text-noir/70">Notre équipe reviendra vers vous rapidement.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <Field label="Nom" error={errors.name}>
                <input value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass(errors.name)} placeholder="Votre nom" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass(errors.email)} placeholder="vous@email.com" />
              </Field>
              <Field label="Sujet">
                <input value={form.subject} onChange={(e) => update("subject", e.target.value)} className={inputClass()} placeholder="Sujet de votre message" />
              </Field>
              <Field label="Message" error={errors.message}>
                <textarea rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass(errors.message) + " resize-none"} placeholder="Votre message" />
              </Field>
              {status === "error" && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3">{submitError}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex justify-center px-8 py-4 bg-noir text-ivory text-sm uppercase tracking-wide hover:bg-gold hover:text-noir transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          )}
        </Reveal>
      </div>

      {faqs.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-24">
          <Reveal><h2 className="text-3xl text-center mb-10">Questions fréquentes</h2></Reveal>
          <FAQAccordion items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
        </div>
      )}
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
