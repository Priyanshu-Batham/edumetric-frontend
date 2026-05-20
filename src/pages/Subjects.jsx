import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { subjectsApi, analyticsApi } from '../lib/api';
import {
  Card, Table, Modal, SearchInput, Loading, ErrorState,
  SectionHeader, Badge, StatCard, CHART_TOOLTIP, CHART_COLORS,
} from '../components/ui';
import { BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

/* ── Subject stats modal (view-only) ───────────────────────────── */
function SubjectStatsModal({ subject, onClose }) {
  const { data, loading, error } = useFetch(() => analyticsApi.subject(subject.id), [subject.id]);
  const { data: histData }       = useFetch(() => analyticsApi.subjectHistogram(subject.id, 8), [subject.id]);

  return (
    <Modal open onClose={onClose} title={`📊 ${subject.paper_code} — ${subject.paper_name}`} wide>
      {loading && <Loading />}
      {error   && <ErrorState message={error} />}
      {data && (
        <div className="flex flex-col gap-5">

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard label="Students" value={data.total_students} />
            <StatCard label="Avg Marks" value={data.marks_stats?.average} color="accent" />
            <StatCard label="Highest"   value={data.marks_stats?.highest} color="emerald" />
            <StatCard label="Median"    value={data.marks_stats?.median}  color="violet" />
          </div>

          {/* Grade chips */}
          <div>
            <p className="font-display font-semibold text-sm text-txt mb-3">Grade Distribution</p>
            <div className="flex flex-wrap gap-2">
              {(data.grade_distribution || []).map(g => (
                <div key={g.grade} className="bg-bg-3 rounded-lg px-3 py-2 text-center min-w-[60px]">
                  <div className="font-display font-bold text-accent text-xl">{g.grade}</div>
                  <div className="font-mono text-[10px] text-txt-3">{g.count} ({g.percentage}%)</div>
                </div>
              ))}
            </div>
          </div>

          {/* Histogram */}
          {histData?.histogram?.length > 0 && (
            <div>
              <p className="font-display font-semibold text-sm text-txt mb-3">Marks Histogram</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={histData.histogram} barSize={20}>
                  <XAxis dataKey="range" tick={{ fill: '#5c6480', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5c6480', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Bar dataKey="count" fill="#4fc3f7" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top scorers */}
          <div>
            <p className="font-display font-semibold text-sm text-txt mb-3">Top Scorers</p>
            <div className="flex flex-col gap-1.5">
              {(data.student_results || []).slice(0, 8).map((r, i) => (
                <div key={i} className="flex items-center gap-3 bg-bg-3 rounded-lg px-3.5 py-2.5">
                  <span className="font-mono text-[10px] text-txt-3 w-6">#{i + 1}</span>
                  <span className="flex-1 text-sm text-txt truncate">{r.name}</span>
                  <span className="font-mono text-[11px] text-txt-3">{r.enrollment_no}</span>
                  <span className="font-display font-bold text-accent text-lg">{r.marks}</span>
                  {r.grade && <Badge color={r.grade === 'F' ? 'red' : 'blue'}>{r.grade}</Badge>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function Subjects() {
  const [search, setSearch]       = useState('');
  const [statsSubject, setStats]  = useState(null);

  const { data: subjects, loading, error } = useFetch(() => subjectsApi.list(search), [search]);

  const columns = [
    {
      key: 'paper_code', label: 'Code',
      render: v => <span className="font-mono text-xs text-accent">{v}</span>,
    },
    {
      key: 'paper_name', label: 'Subject Name',
      render: v => <span className="font-medium text-txt">{v}</span>,
      wrap: true,
    },
    {
      key: '_actions', label: 'Actions',
      render: (_, row) => (
        <button
          onClick={e => { e.stopPropagation(); setStats(row); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
        >
          <BarChart2 size={12} /> Stats
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <SectionHeader title="Subjects" subtitle={`${subjects?.length ?? 0} subjects`} />

      <div className="max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by code or name…" />
      </div>

      <Card className="!p-0">
        {loading && <Loading />}
        {error   && <div className="p-5"><ErrorState message={error} /></div>}
        {!loading && !error && (
          <Table columns={columns} data={subjects} emptyMessage="No subjects found" />
        )}
      </Card>

      {statsSubject && (
        <SubjectStatsModal subject={statsSubject} onClose={() => setStats(null)} />
      )}
    </div>
  );
}
