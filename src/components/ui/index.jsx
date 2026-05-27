import { clsx } from 'clsx';

// ── Spinner ────────────────────────────────────────────────────────────
export function Spinner({ className }) {
  return (
    <div className={clsx(
      'w-5 h-5 rounded-full border-2 border-border-2 border-t-accent animate-spin shrink-0',
      className
    )} />
  );
}

// ── Loading ────────────────────────────────────────────────────────────
export function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 px-4 py-10 text-txt-2">
      <Spinner />
      <span className="font-mono text-xs tracking-wide">{text}</span>
    </div>
  );
}

// ── ErrorState ─────────────────────────────────────────────────────────
export function ErrorState({ message }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-crimson/10 border border-crimson text-crimson font-mono text-xs">
      ⚠ {message}
    </div>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-txt-3">
      <div className="text-4xl mb-3">{icon || '∅'}</div>
      <div className="font-display text-base text-txt-2 mb-1">{title}</div>
      {subtitle && <div className="text-xs">{subtitle}</div>}
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────
export function Card({ children, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-lg',
        onClick && 'cursor-pointer hover:border-accent transition-colors duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────
const STAT_ACCENTS = {
  accent:    'bg-accent',
  'accent-2':'bg-accent-2',
  emerald:   'bg-emerald',
  crimson:   'bg-crimson',
  violet:    'bg-violet',
};
const STAT_TEXT = {
  accent:    'text-accent',
  'accent-2':'text-accent-2',
  emerald:   'text-emerald',
  crimson:   'text-crimson',
  violet:    'text-violet',
};

export function StatCard({ label, value, sub, icon, color = 'accent' }) {
  return (
    <div className="relative bg-surface border border-border rounded-xl p-4 sm:p-5 flex flex-col gap-1 overflow-hidden shadow-lg">
      <div className={clsx('absolute top-0 left-0 right-0 h-0.5', STAT_ACCENTS[color] || 'bg-accent')} />
      {icon && <div className="text-xl sm:text-2xl mb-1">{icon}</div>}
      <div className="font-mono text-[9px] sm:text-[10px] text-txt-3 tracking-widest uppercase">{label}</div>
      <div className={clsx('font-display text-2xl sm:text-3xl font-bold leading-none', STAT_TEXT[color] || 'text-accent')}>
        {value ?? '—'}
      </div>
      {sub && <div className="text-xs text-txt-3">{sub}</div>}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  green:  'bg-emerald/10 text-emerald',
  red:    'bg-crimson/10 text-crimson',
  yellow: 'bg-accent/10 text-accent',
  blue:   'bg-accent-2/10 text-accent-2',
  purple: 'bg-violet/10 text-violet',
  gray:   'bg-bg-3 text-txt-2',
};

export function Badge({ children, color = 'gray' }) {
  return (
    <span className={clsx(
      'inline-block px-2 py-0.5 rounded-full font-mono text-[10px] font-medium tracking-wider uppercase',
      BADGE_STYLES[color] || BADGE_STYLES.gray
    )}>
      {children}
    </span>
  );
}

// ── Button ─────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary:   'bg-accent text-bg hover:bg-accent/90 font-semibold',
  secondary: 'bg-surface-2 text-txt border border-border-2 hover:border-accent',
  ghost:     'bg-transparent text-txt-2 border border-border hover:bg-surface',
};
const BTN_SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2',
};

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center rounded-lg font-body font-medium transition-all duration-150',
        BTN_VARIANTS[variant],
        BTN_SIZES[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

// ── Select ─────────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options, placeholder = 'Select…' }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="font-mono text-[10px] text-txt-2 tracking-widest uppercase">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-bg-2 border border-border-2 rounded-lg px-3 py-2.5 text-sm font-body text-txt outline-none cursor-pointer transition-colors hover:border-accent focus:border-accent w-full"
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

// ── SearchInput ────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative w-full">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-3 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border-2 rounded-lg text-sm font-body text-txt placeholder-txt-3 outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────
export function Table({ columns, data, onRowClick, emptyMessage = 'No data' }) {
  if (!data?.length) return <EmptyState title={emptyMessage} />;
  return (
    // -mx on mobile so table fills card edge-to-edge without outer padding fighting it
    <div className="overflow-x-auto -mx-0">
      <table className="w-full border-collapse min-w-[540px]">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={clsx(
                  'px-4 py-3 font-mono text-[10px] text-txt-3 tracking-widest uppercase border-b border-border whitespace-nowrap',
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={clsx(
                'border-b border-border transition-colors duration-100',
                i % 2 === 1 && 'bg-white/[0.01]',
                onRowClick ? 'cursor-pointer hover:bg-surface-2' : 'hover:bg-surface-2/50'
              )}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={clsx(
                    'px-4 py-3 text-sm text-txt',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    !col.wrap && 'whitespace-nowrap'
                  )}
                >
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-bg/85 backdrop-blur-sm animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={clsx(
        // On mobile: slides up from bottom as a sheet, full width, rounded top
        // On sm+: centred dialog with max-width
        'bg-bg-2 border border-border-2 shadow-2xl w-full animate-fade-up overflow-y-auto',
        'rounded-t-2xl sm:rounded-2xl',
        'max-h-[92vh] sm:max-h-[90vh]',
        wide ? 'sm:max-w-3xl' : 'sm:max-w-xl',
      )}>
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-border sticky top-0 bg-bg-2 z-10">
          <h2 className="font-display text-base sm:text-lg font-bold text-txt pr-4 leading-snug">{title}</h2>
          <button
            onClick={onClose}
            className="shrink-0 text-txt-3 hover:text-txt transition-colors text-xl leading-none p-1"
          >✕</button>
        </div>
        <div className="px-5 sm:px-6 py-4 sm:py-5">{children}</div>
      </div>
    </div>
  );
}

// ── SectionHeader ──────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-5 sm:mb-6">
      <h2 className="font-display text-xl sm:text-2xl font-bold text-txt">{title}</h2>
      {subtitle && <p className="text-txt-2 text-sm mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ── Tabs ───────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    // Full width on mobile, scrollable row so tabs never wrap mid-label
    <div className="w-full overflow-x-auto pb-0.5">
      <div className="flex gap-0.5 bg-bg-2 rounded-lg p-1 w-max min-w-full sm:w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap',
              active === tab.id
                ? 'bg-surface-2 text-txt shadow-sm'
                : 'text-txt-3 hover:text-txt-2'
            )}
          >
            {tab.icon && <span className="mr-1">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── RankBadge ──────────────────────────────────────────────────────────
export function RankBadge({ rank }) {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
  if (medals[rank]) return <span className="text-base sm:text-lg">{medals[rank]}</span>;
  return (
    <span className="font-mono text-xs text-txt-3 bg-bg-3 rounded px-2 py-0.5">
      #{rank}
    </span>
  );
}

// ── gradeColor helper ──────────────────────────────────────────────────
export function gradeColor(grade) {
  if (!grade) return 'gray';
  const g = grade.toUpperCase();
  if (['O', 'A+', 'EX'].includes(g)) return 'green';
  if (['A', 'A-', 'B+'].includes(g)) return 'blue';
  if (['B', 'B-', 'C+', 'C'].includes(g)) return 'yellow';
  if (['D', 'D+'].includes(g)) return 'purple';
  if (['F', 'FAIL', 'AB'].includes(g)) return 'red';
  return 'gray';
}

// ── Shared recharts tooltip style ──────────────────────────────────────
export const CHART_TOOLTIP = {
  contentStyle: {
    background: '#252b3b',
    border: '1px solid #374060',
    borderRadius: '8px',
    fontFamily: 'DM Mono, monospace',
    fontSize: 12,
    color: '#e8ecf5',
  },
  labelStyle: { color: '#9aa3bf', marginBottom: 2 },
};

export const CHART_COLORS = ['#f0c040', '#4fc3f7', '#4caf82', '#9c7aff', '#ef5350', '#ff8a65', '#26c6da', '#ab47bc'];
