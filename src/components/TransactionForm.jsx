import { useEffect, useState } from 'react';
import { aiApi } from '../services/api.js';
import { CATEGORIES, today } from '../constants.js';

export default function TransactionForm({ initial, onSubmit, saving, submitLabel = 'সেভ করুন' }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: CATEGORIES.expense[0],
    date: today(),
    note: '',
    ...initial,
  });
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        type: initial.type || 'expense',
        amount: initial.amount ?? '',
        category: initial.category || CATEGORIES.expense[0],
        date: initial.date ? String(initial.date).slice(0, 10) : today(),
        note: initial.note || '',
      });
    }
  }, [initial]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const changeType = (type) => setForm((f) => ({ ...f, type, category: CATEGORIES[type][0] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
    } catch (err) {
      setError(err.response?.data?.message || 'সেভ করা যায়নি');
    }
  };

  const smartFill = async () => {
    if (!form.note.trim()) return;
    try {
      const { data } = await aiApi.categorize(form.note);
      setForm((f) => ({
        ...f,
        type: data.type || f.type,
        category: data.category || f.category,
        amount: data.amount || f.amount,
      }));
      setHint(`অটো: ${data.category}${data.amount ? ` · ৳${data.amount}` : ''}`);
    } catch {
      setHint('অটো-ক্যাটাগরি এখন কাজ করেনি');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 p-2 rounded-xl">{error}</p>}
      {hint && <p className="text-xs text-emerald-700 dark:text-emerald-300">{hint}</p>}

      <div className="flex gap-2">
        {['expense', 'income'].map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => changeType(t)}
            className={`flex-1 py-2 rounded-xl border transition ${
              form.type === t
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-glow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            {t === 'expense' ? 'খরচ' : 'আয়'}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="text-sm text-slate-500">নোট / স্মার্ট এন্ট্রি</span>
        <div className="flex gap-2 mt-1">
          <input
            className="input"
            value={form.note}
            placeholder="যেমন: Pathao 150"
            onChange={(e) => update('note', e.target.value)}
          />
          <button type="button" className="btn-ghost border border-slate-200 dark:border-slate-700" onClick={smartFill}>
            AI
          </button>
        </div>
      </label>

      <label className="block">
        <span className="text-sm text-slate-500">পরিমাণ (৳)</span>
        <input
          className="input mt-1"
          type="number"
          min="1"
          value={form.amount}
          onChange={(e) => update('amount', e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-500">ক্যাটাগরি</span>
        <select className="input mt-1" value={form.category} onChange={(e) => update('category', e.target.value)}>
          {CATEGORIES[form.type].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-slate-500">তারিখ</span>
        <input className="input mt-1" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required />
      </label>

      <button className="btn w-full" disabled={saving}>
        {saving ? 'সেভ হচ্ছে...' : submitLabel}
      </button>
    </form>
  );
}
