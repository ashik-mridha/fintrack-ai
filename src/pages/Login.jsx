import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const { login, user, checking } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!checking && user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      push('স্বাগতম!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'লগইন করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-950">
      <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-500/40 blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-teal-400/30 blur-3xl" />
      <motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="card w-full max-w-sm space-y-4 relative z-10 bg-white/90 dark:bg-slate-900/90"
      >
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          FinTrack AI
        </h2>
        <p className="text-center text-sm text-slate-500">আপনার খরচ, স্মার্টভাবে</p>
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-xl">{error}</p>}
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
          placeholder="পাসওয়ার্ড"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn w-full" disabled={loading}>
          {loading ? 'অপেক্ষা করুন...' : 'লগইন'}
        </button>
        <p className="text-sm text-center text-slate-600 dark:text-slate-400">
          অ্যাকাউন্ট নেই?{' '}
          <Link to="/register" className="text-emerald-600 font-medium">
            রেজিস্টার করুন
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
