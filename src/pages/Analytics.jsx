import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { analyticsApi, examSessionsApi, subjectsApi, studentsApi } from '../lib/api';
import {
  Card, Loading, ErrorState, SectionHeader, Tabs, Select,
  StatCard, Badge, CHART_TOOLTIP, CHART_COLORS,
} from '../components/ui';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend,
} from 'recharts';

/* ── Semester tab ───────────────────────────────────────────────── */
function SemesterTab() {
  const { data: semesters } = useFetch(examSessionsApi.semesters);
  const [selected, setSelected] = useState('');
  const { data, loading, error } = useFetch(
    () => selected ? analyticsApi.semester(selected) : Promise.resolve(null),
    [selected]
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="max-w-xs">
        <Select
          label="Select Semester"
          value={selected}
          onChange={setSelected}
          options={(semesters || []).map(s => ({ label: s, value: s }))}
          placeholder="Choose a semester…"
        />
      </div>

      {!selected && (
        <div className="flex items-center justify-center py-16 text-txt-3 text-sm">
          ← Select a semester to view analytics
        </div>
      )}

      {loading && <Loading />}
      {error   && <ErrorState message={error} />}

      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Students" value={data.total_students} />
            <StatCard label="Pass %"   value={data.pass_percentage != null ? `${data.pass_percentage}%` : '—'} color="emerald" />
            <StatCard label="Avg SGPA" value={data.sgpa?.average} color="accent" />
            <StatCard label="Top SGPA" value={data.sgpa?.highest} color="accent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <p className="font-display font-semibold text-sm text-txt mb-4">Grade Distribution</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.grade_distribution || []} barSize={28}>
                  <XAxis dataKey="grade" tick={{ fill: '#5c6480', fontSize: 12, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5c6480', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]}>
                    {(data.grade_distribution || []).map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <p className="font-display font-semibold text-sm text-txt mb-4">Pass vs Fail</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Pass', value: data.pass_count || 0 },
                      { name: 'Fail', value: data.fail_count || 0 },
                    ]}
                    cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value"
                  >
                    <Cell fill="#4caf82" /><Cell fill="#ef5350" />
                  </Pie>
                  <Tooltip {...CHART_TOOLTIP} />
                  <Legend formatter={v => <span className="text-txt-2 text-xs">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Subject tab ────────────────────────────────────────────────── */
function SubjectTab() {
  const { data: subjects } = useFetch(subjectsApi.list);
  const [selected, setSelected] = useState('');
  const { data, loading }     = useFetch(
    () => selected ? analyticsApi.subject(selected) : Promise.resolve(null),
    [selected]
  );
  const { data: histData } = useFetch(
    () => selected ? analyticsApi.subjectHistogram(selected, 10) : Promise.resolve(null),
    [selected]
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="max-w-sm">
        <Select
          label="Select Subject"
          value={selected}
          onChange={setSelected}
          options={(subjects || []).map(s => ({ label: `${s.paper_code} — ${s.paper_name}`, value: String(s.id) }))}
          placeholder="Choose a subject…"
        />
      </div>

      {!selected && (
        <div className="flex items-center justify-center py-16 text-txt-3 text-sm">
          ← Select a subject to view analytics
        </div>
      )}

      {loading && <Loading />}

      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Students"  value={data.total_students} />
            <StatCard label="Avg Marks" value={data.marks_stats?.average} color="accent" />
            <StatCard label="Highest"   value={data.marks_stats?.highest} color="emerald" />
            <StatCard label="Median"    value={data.marks_stats?.median}  color="violet" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <p className="font-display font-semibold text-sm text-txt mb-4">Marks Histogram</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={histData?.histogram || []} barSize={20}>
                  <XAxis dataKey="range" tick={{ fill: '#5c6480', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5c6480', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Bar dataKey="count" fill="#4fc3f7" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <p className="font-display font-semibold text-sm text-txt mb-4">Grade Distribution</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.grade_distribution || []} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="count" nameKey="grade">
                    {(data.grade_distribution || []).map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...CHART_TOOLTIP} />
                  <Legend formatter={v => <span className="text-txt-2 text-[11px]">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Compare tab ────────────────────────────────────────────────── */
function CompareTab() {
  const { data: students } = useFetch(studentsApi.list);
  const [ids, setIds]      = useState(['', '']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const doCompare = async () => {
    const valid = ids.filter(Boolean);
    if (valid.length < 2) return;
    setLoading(true);
    try {
      const data = await analyticsApi.compareStudents(valid);
      setResult(data);
    } finally { setLoading(false); }
  };

  const semesters = result
    ? [...new Set(result.flatMap(r => r.semester_data.map(s => s.semester)))].sort()
    : [];

  const chartData = semesters.map(sem => {
    const row = { semester: sem };
    result?.forEach(r => {
      const s = r.semester_data.find(x => x.semester === sem);
      row[r.name || String(r.student_id)] = s?.sgpa ?? null;
    });
    return row;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Selector row */}
      <div className="flex flex-wrap gap-3 items-end">
        {ids.map((id, i) => (
          <div key={i} className="w-60">
            <Select
              label={`Student ${i + 1}`}
              value={id}
              onChange={v => { const next = [...ids]; next[i] = v; setIds(next); }}
              options={(students || []).map(s => ({ label: `${s.name} (${s.enrollment_no})`, value: String(s.id) }))}
              placeholder={`Pick student ${i + 1}`}
            />
          </div>
        ))}
        <button
          onClick={() => setIds(prev => [...prev, ''])}
          className="px-3 py-2.5 bg-surface-2 border border-border rounded-lg text-txt-2 hover:border-accent hover:text-accent transition-colors text-sm"
        >
          + Add
        </button>
        <button
          onClick={doCompare}
          disabled={loading || ids.filter(Boolean).length < 2}
          className="px-5 py-2.5 bg-accent text-bg font-semibold rounded-lg text-sm hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Comparing…' : 'Compare →'}
        </button>
      </div>

      {/* Result cards */}
      {result && (
        <>
          <div className="flex flex-wrap gap-4">
            {result.map((r, i) => (
              <div key={r.student_id} className="flex-1 min-w-[160px] bg-surface border border-border rounded-xl p-4">
                <div className="font-display font-bold text-base text-txt">{r.name}</div>
                <div className="font-mono text-[10px] text-txt-3 mb-3">{r.enrollment_no}</div>
                <div className="font-display font-extrabold text-3xl" style={{ color: CHART_COLORS[i] }}>
                  {r.cgpa ?? '—'}
                </div>
                <div className="text-[10px] text-txt-3 mt-0.5">CGPA · {r.semester_data?.length} sems</div>
              </div>
            ))}
          </div>

          {chartData.length > 0 && (
            <Card>
              <p className="font-display font-semibold text-sm text-txt mb-4">SGPA Comparison by Semester</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3148" />
                  <XAxis dataKey="semester" tick={{ fill: '#5c6480', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#5c6480', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Legend formatter={v => <span className="text-txt-2 text-xs">{v}</span>} />
                  {result.map((r, i) => (
                    <Line
                      key={r.student_id}
                      type="monotone"
                      dataKey={r.name || String(r.student_id)}
                      stroke={CHART_COLORS[i]}
                      strokeWidth={2}
                      dot={{ r: 4, fill: CHART_COLORS[i] }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

/* ── Global tab ─────────────────────────────────────────────────── */
function GlobalTab() {
  const { data: gradeData, loading: gl } = useFetch(analyticsApi.gradeDistribution);
  const { data: sgpaData,  loading: sl } = useFetch(analyticsApi.sgpaDistribution);
  const { data: topPerfs,  loading: tl } = useFetch(() => analyticsApi.topPerformers({ limit: 20 }));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <p className="font-display font-semibold text-sm text-txt mb-4">Overall Grade Distribution</p>
          {gl ? <Loading /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={gradeData || []} barSize={28}>
                <XAxis dataKey="grade" tick={{ fill: '#5c6480', fontSize: 12, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5c6480', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP} />
                <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
                  {(gradeData || []).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card>
          <p className="font-display font-semibold text-sm text-txt mb-4">SGPA Range Distribution</p>
          {sl ? <Loading /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sgpaData?.distribution || []} barSize={28}>
                <XAxis dataKey="range" tick={{ fill: '#5c6480', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5c6480', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP} />
                <Bar dataKey="count" fill="#f0c040" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card>
        <p className="font-display font-semibold text-sm text-txt mb-4">Top 20 Performers</p>
        {tl ? <Loading /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(topPerfs || []).map((p, i) => (
              <div key={i} className="bg-bg-3 rounded-xl p-3.5">
                <div className="font-mono text-[10px] text-txt-3 mb-1">
                  #{p.rank} · {p.exam_session}
                </div>
                <div className="font-medium text-sm text-txt truncate mb-0.5">{p.name}</div>
                <div className="text-[11px] text-txt-3 mb-2 truncate">{p.course}</div>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-accent text-2xl">{p.sgpa}</span>
                  <Badge color={p.result === 'PASS' ? 'green' : 'red'}>{p.result}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function Analytics() {
  const [tab, setTab] = useState('global');
  const tabs = [
    { id: 'global',   label: 'Overview',  icon: '🌐' },
    { id: 'semester', label: 'Semester',  icon: '📅' },
    { id: 'subject',  label: 'Subject',   icon: '📖' },
    { id: 'compare',  label: 'Compare',   icon: '⚡' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Analytics" subtitle="Deep dive into exam performance data" />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div>
        {tab === 'global'   && <GlobalTab />}
        {tab === 'semester' && <SemesterTab />}
        {tab === 'subject'  && <SubjectTab />}
        {tab === 'compare'  && <CompareTab />}
      </div>
    </div>
  );
}
