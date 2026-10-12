import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { transactionApi } from '../services/api.js';
import { formatTaka } from '../constants.js';
import PageMotion from '../components/PageMotion.jsx';

export default function Reports() {
  const yearNow = new Date().getFullYear();
  const [year, setYear] = useState(yearNow);
  const [data, setData] = useState({ months: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    transactionApi
      .monthly({ year })
      .then(({ data: d }) => setData(d))
      .catch(() => setError('রিপোর্ট লোড হয়নি'));
  }, [year]);

  const totals = data.months.reduce(
    (acc, m) => ({ income: acc.income + m.income, expense: acc.expense + m.expense }),
    { income: 0, expense: 0 }
  );

  return (
    <PageMotion className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 items-center">
        <h2 className="text-2xl font-bold">রিপোর্ট</h2>
        <select className="input max-w-[140px]" value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[yearNow, yearNow - 1, yearNow - 2].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">বার্ষিক আয়</p>
          <p className="text-xl font-bold text-emerald-600">{formatTaka(totals.income)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">বার্ষিক খরচ</p>
          <p className="text-xl font-bold text-red-500">{formatTaka(totals.expense)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">সঞ্চয়</p>
          <p className="text-xl font-bold">{formatTaka(totals.income - totals.expense)}</p>
        </div>
      </div>

      <div className="card h-[320px]">
        <h3 className="font-semibold mb-3">মাসভিত্তিক আয় বনাম খরচ</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data.months}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(v) => formatTaka(v)} />
            <Legend />
            <Bar dataKey="income" name="আয়" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="খরচ" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card h-[280px]">
        <h3 className="font-semibold mb-3">ব্যালেন্স ট্রেন্ড</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data.months}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(v) => formatTaka(v)} />
            <Line type="monotone" dataKey="balance" name="ব্যালেন্স" stroke="#14b8a6" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </PageMotion>
  );
}
