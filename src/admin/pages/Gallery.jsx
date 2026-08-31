import { useEffect, useState } from "react";
import { listGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } from "../../services/gallery";
import { uploadImage, deleteImage, pathFromPublicUrl } from "../../services/storage";
import { EmptyState, ErrorState } from "../components/States";
import { Toggle } from "../components/Badge";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import { BUCKETS } from "../../lib/supabase";
import { galleryCategories } from "../../data/gallery";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await listGalleryImages();
    setImages(data);
    setError(err);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error: err } = await uploadImage(BUCKETS.gallery, file);
    if (err) {
      toast.error("Échec de l'upload : " + err);
      setUploading(false);
      return;
    }
    const { error: createErr } = await createGalleryImage({
      title: file.name.replace(/\.[^/.]+$/, ""),
      image_url: url,
      category: galleryCategories[0],
      display_order: images.length + 1,
    });
    setUploading(false);
    if (createErr) {
      toast.error("Erreur : " + createErr);
      return;
    }
    toast.success("Image ajoutée à la galerie.");
    load();
    e.target.value = "";
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const path = pathFromPublicUrl(BUCKETS.gallery, toDelete.image_url);
    const { error: err } = await deleteGalleryImage(toDelete.id);
    if (!err && path) await deleteImage(BUCKETS.gallery, path);
    setDeleting(false);
    setToDelete(null);
    if (err) {
      toast.error("Erreur : " + err);
      return;
    }
    toast.success("Image supprimée avec succès.");
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Galerie</h1>
          <p className="text-neutral-500 text-sm mt-1">{images.length} image(s)</p>
        </div>
        <label className="px-5 py-2.5 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition-colors cursor-pointer">
          {uploading ? "Envoi en cours..." : "+ Ajouter une image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} />
      ) : images.length === 0 ? (
        <EmptyState title="Aucune image" description="Ajoutez votre première photo à la galerie." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white border border-neutral-200 flex flex-col">
              <div className="aspect-square overflow-hidden">
                <img src={img.image_url} alt={img.title || ""} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex flex-col gap-2">
                <input
                  defaultValue={img.title || ""}
                  onBlur={(e) => e.target.value !== img.title && updateGalleryImage(img.id, { title: e.target.value }).then(load)}
                  className="input text-xs"
                  placeholder="Titre"
                />
                <select
                  defaultValue={img.category || ""}
                  onChange={(e) => updateGalleryImage(img.id, { category: e.target.value }).then(load)}
                  className="input text-xs"
                >
                  {galleryCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="flex items-center justify-between">
                  <Toggle
                    checked={img.is_featured}
                    onChange={(v) => updateGalleryImage(img.id, { is_featured: v }).then(load)}
                    label="Featured"
                  />
                  <button onClick={() => setToDelete(img)} className="text-xs text-red-600 hover:underline">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Êtes-vous sûr de vouloir supprimer cette image ?"
      />
    </div>
  );
}
