import { useEffect, useState } from "react";
import { listFaqs, createFaq, updateFaq, deleteFaq } from "../../services/faqs";
import { EmptyState, ErrorState, TableSkeleton } from "../components/States";
import { Toggle } from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

const emptyForm = { id: null, question: "", answer: "", display_order: 0, is_published: true };

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await listFaqs();
    setFaqs(data);
    setError(err);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      display_order: Number(form.display_order) || 0,
      is_published: form.is_published,
    };
    const result = form.id ? await updateFaq(form.id, payload) : await createFaq(payload);
    setSaving(false);
    if (result.error) {
      toast.error("Erreur : " + result.error);
      return;
    }
    toast.success(form.id ? "Question mise à jour." : "Question ajoutée.");
    setForm(null);
    load();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error: err } = await deleteFaq(toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Question supprimée avec succès.");
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">FAQ</h1>
          <p className="text-neutral-500 text-sm mt-1">{faqs.length} question(s)</p>
        </div>
        <button
          onClick={() => setForm({ ...emptyForm, display_order: faqs.length + 1 })}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition-colors"
        >
          + Ajouter une question
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={4} cols={3} />
        ) : error ? (
          <ErrorState message={error} />
        ) : faqs.length === 0 ? (
          <EmptyState title="Aucune question" />
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Question</th>
                <th className="px-4 py-3 font-medium">Publiée</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((f) => (
                <tr key={f.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 text-neutral-900">{f.question}</td>
                  <td className="px-4 py-3">
                    <Toggle checked={f.is_published} onChange={(v) => updateFaq(f.id, { is_published: v }).then(load)} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => setForm(f)} className="text-xs uppercase tracking-wide text-neutral-600 hover:text-neutral-900">Modifier</button>
                    <button onClick={() => setToDelete(f)} className="text-xs uppercase tracking-wide text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Modifier la question" : "Ajouter une question"}>
        {form && (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-wide text-neutral-500">Question</span>
              <input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="input" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-wide text-neutral-500">Réponse</span>
              <textarea required rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="input resize-none" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-wide text-neutral-500">Ordre d'affichage</span>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="input" />
            </label>
            <Toggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} label="Publiée sur le site" />
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
        message="Supprimer cette question ?"
      />
    </div>
  );
}
