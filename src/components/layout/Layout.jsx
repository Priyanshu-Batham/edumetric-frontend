import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  BarChart2, Trophy, ChevronRight,
} from 'lucide-react';

const NAV = [
  { path: '/',              label: 'Dashboard',     icon: LayoutDashboard },
  { path: '/students',      label: 'Students',      icon: Users },
  { path: '/subjects',      label: 'Subjects',      icon: BookOpen },
  { path: '/exam-sessions', label: 'Exam Sessions', icon: ClipboardList },
  { path: '/analytics',     label: 'Analytics',     icon: BarChart2 },
  { path: '/rankings',      label: 'Rankings',      icon: Trophy },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pageTitle = NAV.find(n => n.path === location.pathname)?.label || 'EduMetrics';

  return (
    <div className="flex min-h-screen bg-bg font-body text-txt">

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={clsx(
        'fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-bg-2 border-r border-border transition-[width] duration-300 overflow-hidden',
        collapsed ? 'w-[72px]' : 'w-60'
      )}>

        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-5 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-display font-extrabold text-base text-bg shrink-0">
            E
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-display font-bold text-base leading-tight text-txt">EduMetrics</div>
              <div className="font-mono text-[9px] text-txt-3 tracking-[0.12em] uppercase">Exam Analytics</div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto">
          {NAV.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 overflow-hidden whitespace-nowrap',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-txt-2 hover:bg-surface hover:text-txt'
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-txt-3 hover:text-txt-2 hover:bg-surface transition-all duration-150 text-sm"
          >
            <ChevronRight
              size={18}
              className={clsx('shrink-0 transition-transform duration-300', !collapsed && 'rotate-180')}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────── */}
      <div className={clsx(
        'flex-1 flex flex-col min-w-0 transition-[margin-left] duration-300',
        collapsed ? 'ml-[72px]' : 'ml-60'
      )}>

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 h-16 px-7 bg-bg-2 border-b border-border">
          <h1 className="flex-1 font-display text-xl font-bold text-txt">{pageTitle}</h1>
          <span className="font-mono text-[11px] text-txt-3 tracking-wide">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          {/* API status dot */}
          <span
            className="w-2 h-2 rounded-full bg-emerald animate-pulse shadow-[0_0_6px_#4caf82]"
            title="API Connected"
          />
        </header>

        {/* Page content */}
        <main className="flex-1 p-7 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
