import { useRef, useState } from "react";
import { uploadImage } from "../../services/storage";
import { useToast } from "../context/ToastContext";

/**
 * Uploads a new image and reports its URL via onChange — it never deletes
 * anything itself. The previous image (if replaced) is only cleaned up by the
 * parent form after the record has actually been saved successfully; see
 * cleanupPreviousImage() in services/storage.js. This avoids ever leaving the
 * database pointing at a file that was deleted before the save was confirmed.
 */
export default function ImageUploader({ bucket, value, onChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const toast = useToast();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error } = await uploadImage(bucket, file);
    setUploading(false);
    if (error) {
      toast.error("Échec de l'upload : " + error);
      return;
    }
    onChange(url);
    toast.success("Image téléchargée — cliquez sur Enregistrer pour confirmer le changement.");
    e.target.value = "";
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-neutral-300 text-xs">Aucune</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-xs uppercase tracking-wide border border-neutral-300 hover:border-neutral-900 transition-colors disabled:opacity-50"
          >
            {uploading ? "Envoi en cours..." : value ? "Remplacer" : "Uploader une image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 text-xs uppercase tracking-wide text-red-600 hover:underline"
            >
              Supprimer
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}
