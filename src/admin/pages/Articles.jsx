import { useEffect, useState } from "react";
import { listArticles, createArticle, updateArticle, deleteArticle } from "../../services/articles";
import { deleteImage, pathFromPublicUrl, cleanupPreviousImage } from "../../services/storage";
import { EmptyState, ErrorState, TableSkeleton } from "../components/States";
import { Toggle } from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";
import { useToast } from "../context/ToastContext";
import { BUCKETS } from "../../lib/supabase";
import { articleCategories } from "../../data/articles";

const emptyForm = {
  id: null,
  title: "",
  slug: "",
  subtitle: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  category: articleCategories[0],
  author: "Maison Noor",
  published_at: new Date().toISOString().split("T")[0],
  is_published: false,
};

function slugify(str) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await listArticles();
    setArticles(data);
    setError(err);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (a) => setForm({ ...a, published_at: a.published_at?.split("T")[0] || "", _originalImageUrl: a.cover_image_url });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      subtitle: form.subtitle,
      excerpt: form.excerpt,
      content: form.content,
      cover_image_url: form.cover_image_url,
      category: form.category,
      author: form.author,
      published_at: form.published_at || null,
      is_published: form.is_published,
    };
    const result = form.id ? await updateArticle(form.id, payload) : await createArticle(payload);
    setSaving(false);
    if (result.error) {
      toast.error("Erreur : " + result.error);
      return;
    }
    if (form._originalImageUrl) {
      await cleanupPreviousImage(BUCKETS.articles, form._originalImageUrl, form.cover_image_url);
    }
    toast.success(form.id ? "Article mis à jour." : "Article créé.");
    setForm(null);
    load();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const path = pathFromPublicUrl(BUCKETS.articles, toDelete.cover_image_url);
    const { error: err } = await deleteArticle(toDelete.id);
    if (!err && path) await deleteImage(BUCKETS.articles, path);
    setDeleting(false);
    setToDelete(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Article supprimé avec succès.");
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Articles</h1>
          <p className="text-neutral-500 text-sm mt-1">{articles.length} article(s)</p>
        </div>
        <button onClick={() => setForm(emptyForm)} className="px-5 py-2.5 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition-colors">
          + Nouvel article
        </button>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : error ? (
          <ErrorState message={error} />
        ) : articles.length === 0 ? (
          <EmptyState title="Aucun article" />
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Article</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Publié</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    {a.cover_image_url && <img src={a.cover_image_url} alt="" className="w-10 h-10 object-cover rounded" />}
                    <span className="text-neutral-900">{a.title}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{a.category}</td>
                  <td className="px-4 py-3">
                    <Toggle checked={a.is_published} onChange={(v) => updateArticle(a.id, { is_published: v }).then(load)} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(a)} className="text-xs uppercase tracking-wide text-neutral-600 hover:text-neutral-900">Modifier</button>
                    <button onClick={() => setToDelete(a)} className="text-xs uppercase tracking-wide text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Modifier l'article" : "Nouvel article"} wide>
        {form && (
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <ImageUploader bucket={BUCKETS.articles} value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} label="Image de couverture" />

            <FormField label="Titre">
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
            </FormField>
            <FormField label="Sous-titre">
              <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input" />
            </FormField>
            <FormField label="Extrait">
              <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="input resize-none" />
            </FormField>
            <FormField label="Contenu (un paragraphe par ligne vide)">
              <textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input resize-none font-mono text-xs" />
            </FormField>

            <div className="grid sm:grid-cols-3 gap-4">
              <FormField label="Catégorie">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                  {articleCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Auteur">
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input" />
              </FormField>
              <FormField label="Date de publication">
                <input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className="input" />
              </FormField>
            </div>

            <Toggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} label="Publier cet article" />

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
        message={`Supprimer l'article "${toDelete?.title}" ?`}
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
