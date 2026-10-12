export default function EmptyState({ title, hint }) {
  return (
    <div className="text-center py-10 px-4">
      <div className="text-4xl mb-3">📭</div>
      <p className="font-medium">{title}</p>
      {hint && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
