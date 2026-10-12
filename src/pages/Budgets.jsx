import { useEffect, useState } from 'react';
import { budgetApi } from '../services/api.js';
import { CATEGORIES, formatTaka, currentMonth } from '../constants.js';
import { useToast } from '../context/ToastContext.jsx';
import PageMotion from '../components/PageMotion.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Budgets() {
  const { push } = useToast();
  const [month, setMonth] = useState(currentMonth());
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ category: CATEGORIES.expense[0], limit: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await budgetApi.list({ month });
      setItems(data.items || []);
    } catch {
      push('বাজেট লোড হয়নি', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const save = async (e) => {
    e.preventDefault();
    try {
      await budgetApi.upsert({ category: form.category, limit: Number(form.limit) });
      push('বাজেট সেভ হয়েছে');
      setForm((f) => ({ ...f, limit: '' }));
      load();
    } catch (err) {
      push(err.response?.data?.message || 'সেভ হয়নি', 'error');
    }
  };

  const remove = async (id) => {
    try {
      await budgetApi.remove(id);
      push('বাজেট মুছে ফেলা হয়েছে');
      load();
    } catch {
      push('মুছা যায়নি', 'error');
    }
  };

  return (
    <PageMotion className="space-y-4">
      <h2 className="text-2xl font-bold">বাজেট</h2>
      <p className="text-sm text-slate-500">ক্যাটাগরি অনুযায়ী মাসিক লিমিট সেট করুন। ৮০% পার হলে ড্যাশবোর্ডে অ্যালার্ট দেখাবে।</p>

      <form onSubmit={save} className="card flex flex-wrap gap-3 items-end">
        <label className="flex-1 min-w-[140px]">
          <span className="text-sm text-slate-500">মাস</span>
          <input className="input mt-1" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>
        <label className="flex-1 min-w-[140px]">
          <span className="text-sm text-slate-500">ক্যাটাগরি</span>
          <select className="input mt-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.expense.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="flex-1 min-w-[140px]">
          <span className="text-sm text-slate-500">লিমিট (৳)</span>
          <input
            className="input mt-1"
            type="number"
            min="0"
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
            required
          />
        </label>
        <button className="btn">সেভ</button>
      </form>

      {loading ? (
        <p className="text-slate-500">লোড হচ্ছে...</p>
      ) : items.length === 0 ? (
        <div className="card">
          <EmptyState title="কোনো বাজেট নেই" hint="উপরে ক্যাটাগরি বেছে লিমিট দিন" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <div key={b._id} className="card">
              <div className="flex justify-between gap-3 mb-2">
                <div>
                  <p className="font-medium">{b.category}</p>
                  <p className="text-xs text-slate-500">
                    {formatTaka(b.spent)} / {formatTaka(b.limit)}
                  </p>
                </div>
                <button className="text-red-500 text-sm" onClick={() => remove(b._id)}>
                  মুছুন
                </button>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${b.percent >= 100 ? 'bg-red-500' : b.percent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(b.percent, 100)}%` }}
                />
              </div>
              <p className="text-xs mt-2 text-slate-500">{b.percent}% ব্যবহৃত</p>
            </div>
          ))}
        </div>
      )}
    </PageMotion>
  );
}
