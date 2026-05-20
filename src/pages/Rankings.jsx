import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { rankingsApi, examSessionsApi, subjectsApi, studentsApi } from '../lib/api';
import {
  Card, Table, Loading, ErrorState, SectionHeader, Tabs,
  Select, StatCard, Badge, RankBadge,
} from '../components/ui';

/* ── All-time CGPA ranking ──────────────────────────────────────── */
function OverallRanking() {
  const { data: courses } = useFetch(studentsApi.courses);
  const [course, setCourse] = useState('');
  const { data, loading, error } = useFetch(
    () => rankingsApi.overall(course ? { course } : {}),
    [course]
  );

  const cols = [
    { key: 'rank',       label: 'Rank',    render: v => <RankBadge rank={v} /> },
    {
      key: 'name', label: 'Student',
      render: (v, r) => (
        <div>
          <div className="font-medium text-txt text-sm">{v}</div>
          <div className="font-mono text-[10px] text-txt-3">{r.enrollment_no}</div>
        </div>
      ),
    },
    { key: 'roll_no',    label: 'Roll',    render: v => <span className="font-mono text-xs text-txt-2">{v}</span> },
    { key: 'course',     label: 'Course',  render: v => v ? <Badge color="blue">{v}</Badge> : '—' },
    { key: 'semesters_completed', label: 'Sems', align: 'center' },
    {
      key: 'cgpa', label: 'CGPA',
      render: v => <span className="font-display font-bold text-accent text-xl">{v}</span>,
    },
    {
      key: 'overall_percentage', label: 'Overall %',
      render: v => v != null ? `${v}%` : '—',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="w-56">
        <Select
          label="Filter by Course"
          value={course}
          onChange={setCourse}
          options={(courses || []).map(c => ({ label: c, value: c }))}
          placeholder="All courses"
        />
      </div>
      {loading && <Loading />}
      {error   && <ErrorState message={error} />}
      {data    && <Card className="!p-0"><Table columns={cols} data={data} emptyMessage="No ranking data" /></Card>}
    </div>
  );
}

/* ── Semester ranking ───────────────────────────────────────────── */
function SemRanking() {
  const { data: semesters }    = useFetch(examSessionsApi.semesters);
  const { data: sessionNames } = useFetch(examSessionsApi.sessionNames);
  const [sem, setSem]          = useState('');
  const [session, setSession]  = useState('');
  const { data, loading, error } = useFetch(
    () => sem ? rankingsApi.bySemester(sem, session ? { exam_session: session } : {}) : Promise.resolve(null),
    [sem, session]
  );

  const cols = [
    { key: 'rank',   label: 'Rank',   render: v => <RankBadge rank={v} /> },
    {
      key: 'name', label: 'Student',
      render: (v, r) => (
        <div>
          <div className="font-medium text-txt text-sm">{v}</div>
          <div className="font-mono text-[10px] text-txt-3">{r.enrollment_no}</div>
        </div>
      ),
    },
    { key: 'roll_no',    label: 'Roll',   render: v => <span className="font-mono text-xs text-txt-2">{v}</span> },
    { key: 'course',     label: 'Course', render: v => v ? <Badge color="blue">{v}</Badge> : '—' },
    { key: 'sgpa',       label: 'SGPA',   render: v => <span className="font-display font-bold text-accent text-xl">{v ?? '—'}</span> },
    { key: 'percentage', label: '%',      render: v => v != null ? `${v}%` : '—' },
    { key: 'result',     label: 'Result', render: v => v ? <Badge color={v === 'PASS' ? 'green' : 'red'}>{v}</Badge> : '—' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 flex-wrap">
        <div className="w-44">
          <Select label="Semester" value={sem} onChange={setSem}
            options={(semesters || []).map(s => ({ label: s, value: s }))} placeholder="Select semester…" />
        </div>
        <div className="w-52">
          <Select label="Exam Session" value={session} onChange={setSession}
            options={(sessionNames || []).map(s => ({ label: s, value: s }))} placeholder="All sessions" />
        </div>
      </div>
      {!sem && (
        <div className="flex items-center justify-center py-14 text-txt-3 text-sm">
          ← Select a semester to view rankings
        </div>
      )}
      {loading && <Loading />}
      {error   && <ErrorState message={error} />}
      {data    && <Card className="!p-0"><Table columns={cols} data={data} emptyMessage="No data for this semester" /></Card>}
    </div>
  );
}

/* ── Subject ranking ────────────────────────────────────────────── */
function SubjectRanking() {
  const { data: subjects }  = useFetch(subjectsApi.list);
  const { data: semesters } = useFetch(examSessionsApi.semesters);
  const [subjectId, setSubjectId] = useState('');
  const [sem, setSem]             = useState('');
  const { data, loading, error }  = useFetch(
    () => subjectId ? rankingsApi.bySubject(subjectId, sem ? { semester: sem } : {}) : Promise.resolve(null),
    [subjectId, sem]
  );

  const cols = [
    { key: 'rank',  label: 'Rank',  render: v => <RankBadge rank={v} /> },
    {
      key: 'name', label: 'Student',
      render: (v, r) => (
        <div>
          <div className="font-medium text-txt text-sm">{v}</div>
          <div className="font-mono text-[10px] text-txt-3">{r.enrollment_no}</div>
        </div>
      ),
    },
    { key: 'roll_no',    label: 'Roll',    render: v => <span className="font-mono text-xs text-txt-2">{v}</span> },
    { key: 'marks',      label: 'Marks',   render: v => <span className="font-display font-bold text-accent text-xl">{v ?? '—'}</span> },
    { key: 'grade',      label: 'Grade',   render: v => v ? <Badge color={v === 'F' ? 'red' : 'blue'}>{v}</Badge> : '—' },
    { key: 'semester',   label: 'Sem',     render: v => <Badge color="purple">{v}</Badge> },
    { key: 'exam_session', label: 'Session', render: v => <span className="font-mono text-[11px] text-txt-3">{v}</span> },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 flex-wrap">
        <div className="w-72">
          <Select label="Subject" value={subjectId} onChange={setSubjectId}
            options={(subjects || []).map(s => ({ label: `${s.paper_code} — ${s.paper_name}`, value: String(s.id) }))}
            placeholder="Select subject…" />
        </div>
        <div className="w-44">
          <Select label="Semester" value={sem} onChange={setSem}
            options={(semesters || []).map(s => ({ label: s, value: s }))} placeholder="All semesters" />
        </div>
      </div>
      {!subjectId && (
        <div className="flex items-center justify-center py-14 text-txt-3 text-sm">
          ← Select a subject to view rankings
        </div>
      )}
      {loading && <Loading />}
      {error   && <ErrorState message={error} />}
      {data    && <Card className="!p-0"><Table columns={cols} data={data.rankings} emptyMessage="No data" /></Card>}
    </div>
  );
}

/* ── Student rank lookup ────────────────────────────────────────── */
function StudentRankLookup() {
  const { data: students }  = useFetch(studentsApi.list);
  const { data: semesters } = useFetch(examSessionsApi.semesters);
  const [studentId, setStudentId] = useState('');
  const [sem, setSem]             = useState('');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);

  const lookup = async () => {
    if (!studentId || !sem) return;
    setLoading(true);
    try {
      const [rank, percentile] = await Promise.all([
        rankingsApi.studentRank(studentId, sem),
        rankingsApi.studentPercentile(studentId, sem),
      ]);
      setResult({ rank, percentile });
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3 flex-wrap items-end">
        <div className="w-72">
          <Select label="Student" value={studentId} onChange={setStudentId}
            options={(students || []).map(s => ({ label: `${s.name} (${s.enrollment_no})`, value: String(s.id) }))}
            placeholder="Select student…" />
        </div>
        <div className="w-44">
          <Select label="Semester" value={sem} onChange={setSem}
            options={(semesters || []).map(s => ({ label: s, value: s }))} placeholder="Select semester…" />
        </div>
        <button
          onClick={lookup}
          disabled={loading || !studentId || !sem}
          className="px-5 py-2.5 bg-accent text-bg font-semibold rounded-lg text-sm hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Looking up…' : 'Find Rank →'}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Rank"        value={result.rank?.rank ? `#${result.rank.rank}` : '—'} color="accent" />
          <StatCard label="Out of"      value={result.rank?.total_students}                       color="accent-2" />
          <StatCard label="SGPA"        value={result.rank?.sgpa}                                 color="emerald" />
          <StatCard label="Percentile"  value={result.percentile?.percentile != null ? `${result.percentile.percentile}%` : '—'} color="violet" />
        </div>
      )}

      {!result && !loading && (
        <div className="flex items-center justify-center py-14 text-txt-3 text-sm">
          Select a student and semester, then click Find Rank
        </div>
      )}
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function Rankings() {
  const [tab, setTab] = useState('overall');
  const tabs = [
    { id: 'overall',  label: 'All-time CGPA', icon: '🏆' },
    { id: 'semester', label: 'By Semester',   icon: '📅' },
    { id: 'subject',  label: 'By Subject',    icon: '📖' },
    { id: 'lookup',   label: 'Student Rank',  icon: '🔍' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <SectionHeader title="Rankings" subtitle="Performance leaderboards and rank lookup" />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div>
        {tab === 'overall'  && <OverallRanking />}
        {tab === 'semester' && <SemRanking />}
        {tab === 'subject'  && <SubjectRanking />}
        {tab === 'lookup'   && <StudentRankLookup />}
      </div>
    </div>
  );
}
