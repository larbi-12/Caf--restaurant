export default function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white border border-neutral-200 p-6 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
      <span className="font-serif text-3xl text-neutral-900">{value}</span>
      {hint && <span className="text-xs text-neutral-400">{hint}</span>}
    </div>
  );
}
