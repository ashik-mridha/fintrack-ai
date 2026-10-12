import { motion } from 'framer-motion';
import { formatTaka } from '../constants.js';

export default function StatCard({ title, amount, color = 'text-slate-900 dark:text-white', delay = 0, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={`card overflow-hidden relative ${accent || ''}`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{formatTaka(amount)}</p>
    </motion.div>
  );
}
