import { useEffect, useState } from "react";
import { listEvents, createEvent, updateEvent, deleteEvent } from "../../services/events";
import { EmptyState, ErrorState, TableSkeleton } from "../components/States";
import { Toggle } from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";
import { useToast } from "../context/ToastContext";
import { BUCKETS } from "../../lib/supabase";
import { cleanupPreviousImage, deleteImage, pathFromPublicUrl } from "../../services/storage";

const emptyForm = {
  id: null,
  title: "",
  slug: "",
  description: "",
  image_url: "",
  event_date: "",
  event_time: "",
  price: "",
  capacity: "",
  location: "",
  program: "",
  menu_special: "",
  is_active: true,
};

function slugify(str) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await listEvents();
    setEvents(data);
    setError(err);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (ev) => setForm({ ...ev, program: (ev.program || []).join("\n"), _originalImageUrl: ev.image_url });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      description: form.description,
      image_url: form.image_url,
      event_date: form.event_date,
      event_time: form.event_time,
      price: form.price,
      capacity: form.capacity,
      location: form.location,
      program: form.program.split("\n").map((s) => s.trim()).filter(Boolean),
      menu_special: form.menu_special,
      is_active: form.is_active,
    };
    const result = form.id ? await updateEvent(form.id, payload) : await createEvent(payload);
    setSaving(false);
    if (result.error) {
      toast.error("Erreur : " + result.error);
      return;
    }
    if (form._originalImageUrl) {
      await cleanupPreviousImage(BUCKETS.events, form._originalImageUrl, form.image_url);
    }
    toast.success(form.id ? "Événement mis à jour." : "Événement créé.");
    setForm(null);
    load();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error: err } = await deleteEvent(toDelete.id);
    if (!err) {
      const path = pathFromPublicUrl(BUCKETS.events, toDelete.image_url);
      if (path) await deleteImage(BUCKETS.events, path);
    }
    setDeleting(false);
    setToDelete(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Événement supprimé avec succès.");
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Événements</h1>
          <p className="text-neutral-500 text-sm mt-1">{events.length} événement(s)</p>
        </div>
        <button onClick={() => setForm(emptyForm)} className="px-5 py-2.5 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition-colors">
          + Ajouter un événement
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : error ? (
          <ErrorState message={error} />
        ) : events.length === 0 ? (
          <EmptyState title="Aucun événement" />
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Événement</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actif</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    {ev.image_url && <img src={ev.image_url} alt="" className="w-10 h-10 object-cover rounded" />}
                    <span className="text-neutral-900">{ev.title}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{ev.event_date}</td>
                  <td className="px-4 py-3">
                    <Toggle checked={ev.is_active} onChange={(v) => updateEvent(ev.id, { is_active: v }).then(load)} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(ev)} className="text-xs uppercase tracking-wide text-neutral-600 hover:text-neutral-900">Modifier</button>
                    <button onClick={() => setToDelete(ev)} className="text-xs uppercase tracking-wide text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Modifier l'événement" : "Ajouter un événement"} wide>
        {form && (
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <ImageUploader bucket={BUCKETS.events} value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} label="Image de l'événement" />

            <FormField label="Titre">
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
            </FormField>

            <FormField label="Description">
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
            </FormField>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Date">
                <input required type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="input" />
              </FormField>
              <FormField label="Heure">
                <input value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} placeholder="20:00" className="input" />
              </FormField>
              <FormField label="Prix">
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
              </FormField>
              <FormField label="Places / Capacité">
                <input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="input" />
              </FormField>
            </div>

            <FormField label="Lieu">
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" />
            </FormField>

            <FormField label="Programme (une étape par ligne)">
              <textarea rows={4} value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} className="input resize-none" />
            </FormField>

            <FormField label="Menu spécial">
              <textarea rows={2} value={form.menu_special} onChange={(e) => setForm({ ...form, menu_special: e.target.value })} className="input resize-none" />
            </FormField>

            <Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Événement publié" />

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <button type="button" onClick={() => setForm(null)} className="px-5 py-2.5 text-sm border border-neutral-200">Annuler</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm bg-neutral-900 text-white disabled:opacity-50">
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Supprimer l'événement "${toDelete?.title}" ?`}
      />
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
      {children}
    </label>
  );
}
