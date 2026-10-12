import { useEffect, useState } from 'react';
import { transactionApi } from '../services/api.js';
import { CATEGORIES, formatTaka } from '../constants.js';
import { useToast } from '../context/ToastContext.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import PageMotion from '../components/PageMotion.jsx';
import EmptyState from '../components/EmptyState.jsx';

const allCategories = [...new Set([...CATEGORIES.expense, ...CATEGORIES.income])];

export default function Transactions() {
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ month: '', category: '', search: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await transactionApi.list(params);
      setItems(data);
    } catch {
      push('লেনদেন লোড হয়নি', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.month, filters.category, filters.type]);

  const handleDelete = async (id) => {
    if (!confirm('এই লেনদেনটি মুছে ফেলবেন?')) return;
    try {
      await transactionApi.remove(id);
      setItems((list) => list.filter((t) => t._id !== id));
      push('মুছে ফেলা হয়েছে');
    } catch (err) {
      push(err.response?.data?.message || 'মুছা যায়নি', 'error');
    }
  };

  const saveEdit = async (payload) => {
    setSaving(true);
    try {
      const { data } = await transactionApi.update(editing._id, payload);
      setItems((list) => list.map((t) => (t._id === data._id ? data : t)));
      setEditing(null);
      push('আপডেট হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const header = 'date,type,category,amount,note';
    const rows = items.map((t) =>
      [t.date?.slice(0, 10), t.type, t.category, t.amount, `"${(t.note || '').replace(/"/g, '""')}"`].join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fintrack-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageMotion className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3">
        <h2 className="text-2xl font-bold">লেনদেন</h2>
        <button className="btn-ghost border border-slate-200 dark:border-slate-700" onClick={exportCsv} disabled={!items.length}>
          CSV এক্সপোর্ট
        </button>
      </div>

      <div className="card flex flex-wrap gap-3">
        <input
          type="month"
          className="input max-w-[180px]"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        />
        <select
          className="input max-w-[160px]"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">সব ধরন</option>
          <option value="expense">খরচ</option>
          <option value="income">আয়</option>
        </select>
        <select
          className="input max-w-[180px]"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">সব ক্যাটাগরি</option>
          {allCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <form
          className="flex gap-2 flex-1 min-w-[200px]"
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <input
            className="input"
            placeholder="নোটে খুঁজুন..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <button className="btn">খুঁজুন</button>
        </form>
      </div>

      <div className="hidden md:block card overflow-x-auto p-0">
        {loading ? (
          <p className="p-5 text-slate-500">লোড হচ্ছে...</p>
        ) : items.length === 0 ? (
          <EmptyState title="কোনো লেনদেন পাওয়া যায়নি" hint="ফিল্টার বদলান বা নতুন এন্ট্রি যোগ করুন" />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-slate-500">
              <tr>
                <th className="p-3">তারিখ</th>
                <th className="p-3">ক্যাটাগরি</th>
                <th className="p-3">নোট</th>
                <th className="p-3 text-right">পরিমাণ</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t._id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3">{new Date(t.date).toLocaleDateString('bn-BD')}</td>
                  <td className="p-3">{t.category}</td>
                  <td className="p-3 text-slate-500">{t.note}</td>
                  <td className={`p-3 text-right font-medium ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatTaka(t.amount)}
                  </td>
                  <td className="p-3 text-right space-x-3 whitespace-nowrap">
                    <button onClick={() => setEditing(t)} className="text-emerald-600 hover:underline">
                      সম্পাদনা
                    </button>
                    <button onClick={() => handleDelete(t._id)} className="text-red-500 hover:underline">
                      মুছুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="md:hidden space-y-3">
        {loading && <p className="text-slate-500">লোড হচ্ছে...</p>}
        {!loading && items.length === 0 && <EmptyState title="কোনো লেনদেন নেই" />}
        {items.map((t) => (
          <div key={t._id} className="card">
            <div className="flex justify-between gap-3">
              <div>
                <p className="font-medium">{t.category}</p>
                <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString('bn-BD')}</p>
                {t.note && <p className="text-sm mt-1">{t.note}</p>}
              </div>
              <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'} {formatTaka(t.amount)}
              </p>
            </div>
            <div className="flex gap-4 mt-3 text-sm">
              <button onClick={() => setEditing(t)} className="text-emerald-600">
                সম্পাদনা
              </button>
              <button onClick={() => handleDelete(t._id)} className="text-red-500">
                মুছুন
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="card relative z-10 w-full max-w-lg">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">লেনদেন সম্পাদনা</h3>
              <button onClick={() => setEditing(null)}>✕</button>
            </div>
            <TransactionForm initial={editing} onSubmit={saveEdit} saving={saving} submitLabel="আপডেট" />
          </div>
        </div>
      )}
    </PageMotion>
  );
}
