import { useFetch } from '../hooks/useFetch';
import { analyticsApi, rankingsApi } from '../lib/api';
import { StatCard, Card, Loading, ErrorState, RankBadge, CHART_TOOLTIP, CHART_COLORS } from '../components/ui';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  Tooltip, XAxis, YAxis, ResponsiveContainer, Legend,
} from 'recharts';

export default function Dashboard() {
  const { data: overview, loading, error } = useFetch(analyticsApi.overview);
  const { data: topPerformers }            = useFetch(() => rankingsApi.overall());
  const { data: gradeData }                = useFetch(analyticsApi.gradeDistribution);
  const { data: sgpaDist }                 = useFetch(analyticsApi.sgpaDistribution);

  if (loading) return <Loading text="Loading dashboard…" />;
  if (error)   return <ErrorState message={error} />;

  const passRate = (() => {
    const p = overview?.pass_fail?.pass ?? 0;
    const f = overview?.pass_fail?.fail ?? 0;
    return p + f > 0 ? `${((p / (p + f)) * 100).toFixed(1)}%` : '—';
  })();

  const top5 = (topPerformers || []).slice(0, 5);

  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      {/* ── CGPA Note ── */}
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
        <p className="text-sm text-yellow-200 leading-relaxed">
          ⚠️ The CGPA on this platform is calculated as the average SGPAs of available semesters
          and not using the official credit-based formula of NPGC.
        </p>
      </div>

      {/* ── KPI row: 2 cols on mobile → 3 on sm → 6 on xl ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard label="Total Students"  value={overview?.totals?.students}        icon="👤" color="accent" />
        <StatCard label="Exam Sessions"   value={overview?.totals?.exam_sessions}   icon="📋" color="accent-2" />
        <StatCard label="Subject Results" value={overview?.totals?.subject_results} icon="📝" color="violet" />
        <StatCard label="Pass Rate"       value={passRate}                           icon="✅" color="emerald" />
        <StatCard label="Avg SGPA"        value={overview?.sgpa?.average}           icon="⭐" color="accent" />
        <StatCard label="Peak SGPA"       value={overview?.sgpa?.highest}           icon="🏆" color="accent" />
      </div>

      {/* ── Charts: 1 col mobile → 3 cols md ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">

        <Card>
          <p className="font-display font-semibold text-sm mb-4 text-txt">Pass vs Fail</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Pass',  value: overview?.pass_fail?.pass  || 0 },
                  { name: 'Fail',  value: overview?.pass_fail?.fail  || 0 },
                  { name: 'Other', value: overview?.pass_fail?.other || 0 },
                ].filter(d => d.value > 0)}
                cx="50%" cy="50%" innerRadius={48} outerRadius={74}
                paddingAngle={3} dataKey="value"
              >
                <Cell fill="#4caf82" /><Cell fill="#ef5350" /><Cell fill="#5c6480" />
              </Pie>
              <Tooltip {...CHART_TOOLTIP} />
              <Legend formatter={v => <span className="text-txt-2 text-xs">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="font-display font-semibold text-sm mb-4 text-txt">SGPA Distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sgpaDist?.distribution || []} barSize={16}>
              <XAxis dataKey="range" tick={{ fill: '#5c6480', fontSize: 9, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5c6480', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip {...CHART_TOOLTIP} />
              <Bar dataKey="count" fill="#f0c040" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="font-display font-semibold text-sm mb-4 text-txt">Grade Spread</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={gradeData || []} cx="50%" cy="50%" outerRadius={74} paddingAngle={2} dataKey="count" nameKey="grade">
                {(gradeData || []).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip {...CHART_TOOLTIP} />
              <Legend formatter={v => <span className="text-txt-2 text-[11px]">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Bottom: 1 col mobile → 2 cols md ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

        <Card>
          <p className="font-display font-semibold text-sm mb-4 text-txt">🏆 Top 5 — All-time CGPA</p>
          <div className="flex flex-col gap-2.5">
            {top5.length === 0 && <p className="text-txt-3 text-xs">No data yet</p>}
            {top5.map(p => (
              <div key={p.student_id} className="flex items-center gap-3 bg-bg-3 rounded-xl px-3.5 py-3">
                <RankBadge rank={p.rank} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-txt">{p.name}</div>
                  <div className="font-mono text-[10px] text-txt-3 truncate">{p.enrollment_no} · {p.course}</div>
                </div>
                <div className="font-display font-bold text-accent text-xl shrink-0">{p.cgpa}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="font-display font-semibold text-sm mb-4 text-txt">Course Distribution</p>
          <div className="flex flex-col gap-3">
            {(overview?.course_distribution || []).map((c, i) => {
              const total = (overview?.course_distribution || []).reduce((s, x) => s + x.count, 0);
              const pct   = total ? Math.round((c.count / total) * 100) : 0;
              return (
                <div key={c.course} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs gap-2">
                    <span className="text-txt-2 truncate">{c.course}</span>
                    <span className="font-mono text-txt-3 shrink-0">{c.count} ({pct}%)</span>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-700"
                      style={{ width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
            {!overview?.course_distribution?.length && <p className="text-txt-3 text-xs">No course data</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
