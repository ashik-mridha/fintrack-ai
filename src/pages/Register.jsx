import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Register() {
  const { register, user, checking } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!checking && user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      push('অ্যাকাউন্ট তৈরি হয়েছে');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'রেজিস্টার করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-950">
      <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl animate-pulse" />
      <motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="card w-full max-w-sm space-y-4 relative z-10"
      >
        <h2 className="text-2xl font-bold text-center">নতুন অ্যাকাউন্ট</h2>
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-xl">{error}</p>}
        <input
          className="input"
          placeholder="আপনার নাম"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="ইমেইল"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn w-full" disabled={loading}>
          {loading ? 'অপেক্ষা করুন...' : 'রেজিস্টার'}
        </button>
        <p className="text-sm text-center text-slate-600 dark:text-slate-400">
          আগে থেকেই অ্যাকাউন্ট আছে?{' '}
          <Link to="/login" className="text-emerald-600 font-medium">
            লগইন
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
