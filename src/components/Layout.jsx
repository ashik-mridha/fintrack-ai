import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { NAV_LINKS } from '../constants.js';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-xl text-sm font-medium transition ${
    isActive
      ? 'bg-emerald-500 text-white shadow-glow'
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
  }`;

export default function Layout() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/70 via-slate-50 to-slate-50 dark:from-emerald-950/40 dark:via-slate-950 dark:to-slate-950">
      <header className="sticky top-0 z-40 border-b border-white/50 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden btn-ghost" onClick={() => setOpen(true)} aria-label="মেনু">
              ☰
            </button>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              FinTrack AI
            </h1>
          </div>
          <nav className="hidden md:flex gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <button onClick={toggle} className="btn-ghost" aria-label="থিম">
              {dark ? '☀️' : '🌙'}
            </button>
            <span className="hidden sm:inline text-slate-600 dark:text-slate-300 max-w-[120px] truncate">
              {user?.name}
            </span>
            <button onClick={logout} className="text-red-500 hover:underline">
              লগআউট
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="relative h-full w-72 bg-white dark:bg-slate-900 p-5 space-y-2 shadow-2xl"
            >
              <p className="font-bold text-emerald-600 mb-4">মেনু</p>
              {NAV_LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass} onClick={() => setOpen(false)}>
                  {l.icon} {l.label}
                </NavLink>
              ))}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl">
        <div className="grid grid-cols-5">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 text-[11px] ${isActive ? 'text-emerald-600' : 'text-slate-500'}`
              }
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
