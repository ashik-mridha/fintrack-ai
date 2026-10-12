import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionApi } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import PageMotion from '../components/PageMotion.jsx';

export default function AddExpense() {
  const navigate = useNavigate();
  const { push } = useToast();
  const [saving, setSaving] = useState(false);

  const onSubmit = async (payload) => {
    setSaving(true);
    try {
      await transactionApi.create(payload);
      push('লেনদেন সেভ হয়েছে');
      navigate('/transactions');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageMotion className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-1">নতুন এন্ট্রি</h2>
      <p className="text-sm text-slate-500 mb-4">নোট লিখে AI বাটনে চাপলে ক্যাটাগরি অনুমান হবে</p>
      <div className="card">
        <TransactionForm onSubmit={onSubmit} saving={saving} />
      </div>
    </PageMotion>
  );
}
