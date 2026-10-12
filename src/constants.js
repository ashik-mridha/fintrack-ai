export const CATEGORIES = {
  expense: ['খাবার', 'যাতায়াত', 'বিল', 'বাজার', 'শপিং', 'স্বাস্থ্য', 'শিক্ষা', 'বিনোদন', 'অন্যান্য'],
  income: ['বেতন', 'ফ্রিল্যান্সিং', 'ব্যবসা', 'উপহার', 'অন্যান্য'],
};

export const CHART_COLORS = [
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#64748b',
];

export const formatTaka = (n) => `৳ ${Number(n || 0).toLocaleString('en-IN')}`;

export const today = () => new Date().toISOString().slice(0, 10);

export const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const NAV_LINKS = [
  { to: '/', label: 'ড্যাশবোর্ড', icon: '🏠' },
  { to: '/add', label: 'নতুন এন্ট্রি', icon: '➕' },
  { to: '/transactions', label: 'লেনদেন', icon: '📒' },
  { to: '/reports', label: 'রিপোর্ট', icon: '📊' },
  { to: '/budgets', label: 'বাজেট', icon: '🎯' },
];
