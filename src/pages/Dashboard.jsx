import { useCallback, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import PageMotion from '../components/PageMotion.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { aiApi, budgetApi, transactionApi } from '../services/api.js';
import { CHART_COLORS, formatTaka } from '../constants.js';

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, byCategory: [] });
  const [ai, setAi] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    transactionApi
      .summary()
      .then(({ data }) => setSummary(data))
      .catch(() => setError('ডাটা লোড করা যায়নি। সার্ভার চালু আছে তো?'));
    aiApi
      .summary()
      .then(({ data }) => setAi(data))
      .catch(() => setAi(null));
    budgetApi
      .list()
      .then(({ data }) => setAlerts((data.items || []).filter((i) => i.percent >= 80)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [load]);

  return (
    <PageMotion className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">ড্যাশবোর্ড</h2>
          <p className="text-sm text-slate-500">আয়, খরচ আর AI পরামর্শ এক নজরে</p>
        </div>
        <Link to="/add" className="btn">
          + নতুন এন্ট্রি
        </Link>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {alerts.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 p-4 text-sm">
          {alerts.map((a) => (
            <p key={a._id}>
              ⚠️ {a.category} বাজেটের {a.percent}% খরচ হয়েছে ({formatTaka(a.spent)} / {formatTaka(a.limit)})
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="মোট আয়" amount={summary.income} color="text-emerald-600" delay={0.05} />
        <StatCard title="মোট খরচ" amount={summary.expense} color="text-red-500" delay={0.12} />
        <StatCard
          title="ব্যালেন্স"
          amount={summary.balance}
          color={summary.balance >= 0 ? 'text-teal-600' : 'text-red-500'}
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-4">ক্যাটাগরি অনুযায়ী খরচ</h3>
          {summary.byCategory.length === 0 ? (
            <EmptyState title="এখনো কোনো খরচ নেই" hint="নতুন এন্ট্রি যোগ করুন" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={summary.byCategory} dataKey="total" nameKey="category" innerRadius={55} outerRadius={100}>
                  {summary.byCategory.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatTaka(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card bg-gradient-to-br from-emerald-600 to-teal-500 text-white border-0">
          <h3 className="font-semibold mb-2">🤖 AI পরামর্শ</h3>
          {ai ? (
            <>
              <p className="text-sm text-emerald-50 leading-relaxed">{ai.summary}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {(ai.tips || []).map((tip) => (
                  <li key={tip} className="bg-white/15 rounded-xl px-3 py-2">
                    {tip}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-emerald-100">পরামর্শ লোড হচ্ছে...</p>
          )}
        </div>
      </div>
    </PageMotion>
  );
}
