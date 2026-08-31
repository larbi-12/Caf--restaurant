import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "Confirmer", message, danger = true, loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-neutral-600 text-sm mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-sm border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-5 py-2.5 text-sm text-white transition-colors disabled:opacity-50 ${
            danger ? "bg-red-600 hover:bg-red-700" : "bg-neutral-900 hover:bg-neutral-800"
          }`}
        >
          {loading ? "..." : "Supprimer"}
        </button>
      </div>
    </Modal>
  );
}
