import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { studentsApi } from '../lib/api';
import {
  Card, Table, Modal, Select, SearchInput, Loading, ErrorState,
  SectionHeader, Badge, StatCard, CHART_TOOLTIP,
} from '../components/ui';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

/* ── Performance detail modal (view-only) ──────────────────────── */
function PerformanceModal({ student, onClose }) {
  const { data, loading, error } = useFetch(
    () => studentsApi.performance(student.id),
    [student.id]
  );

  const trendData = (data?.semester_wise || [])
    .map(s => ({ name: s.semester, sgpa: s.sgpa, pct: s.percentage }))
    .filter(s => s.sgpa != null);

  return (
    <Modal open onClose={onClose} title={`📊 ${student.name}`} wide>
      {loading && <Loading />}
      {error   && <ErrorState message={error} />}
      {data && (
        <div className="flex flex-col gap-5">

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="CGPA"      value={data.summary?.cgpa}            color="accent" />
            <StatCard label="Semesters" value={data.summary?.total_semesters} color="accent-2" />
            <StatCard label="Pass"      value={data.summary?.pass_count}      color="emerald" />
            <StatCard label="Fail"      value={data.summary?.fail_count}      color="crimson" />
          </div>

          {/* SGPA trend line chart */}
          {trendData.length > 0 && (
            <div>
              <p className="font-display font-semibold text-sm text-txt mb-3">SGPA Trend</p>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3148" />
                  <XAxis dataKey="name" tick={{ fill: '#5c6480', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#5c6480', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Line type="monotone" dataKey="sgpa" stroke="#f0c040" strokeWidth={2}
                    dot={{ fill: '#f0c040', r: 4 }} name="SGPA" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Semester cards */}
          <div>
            <p className="font-display font-semibold text-sm text-txt mb-3">Semester Breakdown</p>
            <div className="flex flex-col gap-3">
              {(data.semester_wise || []).map(sem => (
                <div key={sem.semester} className="bg-bg-3 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-display font-semibold text-txt">{sem.semester} Sem</span>
                      <span className="font-mono text-[11px] text-txt-3 ml-2">{sem.exam_session}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {sem.percentage != null && (
                        <span className="font-mono text-xs text-txt-2">{sem.percentage}%</span>
                      )}
                      <span className="font-display font-bold text-accent text-xl">{sem.sgpa ?? '—'}</span>
                      <Badge color={sem.result?.toUpperCase() === 'PASS' ? 'green' : 'red'}>
                        {sem.result || '—'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(sem.subjects || []).map(sub => (
                      <div key={sub.paper_code}
                        className="flex items-center gap-1.5 bg-surface rounded-md px-2.5 py-1 text-xs">
                        <span className="font-mono text-txt-3 text-[10px]">{sub.paper_code}</span>
                        <span className="text-txt-2">{sub.marks ?? '—'}</span>
                        {sub.grade && (
                          <Badge color={sub.grade === 'F' ? 'red' : 'blue'}>{sub.grade}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ── Student info modal ────────────────────────────────────────── */
function StudentInfoModal({ student, onClose }) {
  return (
    <Modal open onClose={onClose} title="Student Details">
      <div className="flex flex-col gap-3 text-sm">
        {[
          ['Enrollment No', student.enrollment_no],
          ['Roll No',       student.roll_no],
          ['Full Name',     student.name],
          ['Course',        student.course],
          ["Father's Name", student.father_name],
          ["Mother's Name", student.mother_name],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
            <span className="font-mono text-[10px] text-txt-3 tracking-widest uppercase">{label}</span>
            <span className="text-txt font-medium">{val || '—'}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function Students() {
  const [search, setSearch]         = useState('');
  const [courseFilter, setCourse]   = useState('');
  const [infoStudent, setInfo]      = useState(null);
  const [perfStudent, setPerf]      = useState(null);

  const { data: students, loading, error } = useFetch(
    () => studentsApi.list({ name: search, course: courseFilter }),
    [search, courseFilter]
  );
  const { data: courses } = useFetch(studentsApi.courses);

  const columns = [
    {
      key: 'enrollment_no', label: 'Enrollment',
      render: v => <span className="font-mono text-xs text-accent">{v}</span>,
    },
    {
      key: 'roll_no', label: 'Roll No',
      render: v => <span className="font-mono text-xs text-txt-2">{v}</span>,
    },
    {
      key: 'name', label: 'Name',
      render: v => <span className="font-medium text-txt">{v}</span>,
    },
    {
      key: 'course', label: 'Course',
      render: v => v ? <Badge color="blue">{v}</Badge> : '—',
    },
    { key: 'father_name', label: "Father's Name" },
    {
      key: '_actions', label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={e => { e.stopPropagation(); setInfo(row); }}
            className="px-3 py-1.5 text-xs rounded-lg border border-border text-txt-2 hover:border-accent hover:text-accent transition-colors"
          >
            Info
          </button>
          <button
            onClick={e => { e.stopPropagation(); setPerf(row); }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          >
            <TrendingUp size={12} /> Performance
          </button>
        </div>
      ),
    },
  ];

  return (
<<<<<<< HEAD
    <div className="flex flex-col">
=======
    <div className="flex flex-col gap-5">
>>>>>>> f191a61a8c32d72267da551d10031902b7070b83
      <SectionHeader title="Students" subtitle={`${students?.length ?? 0} records`} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name…" />
        <div className="sm:w-52 shrink-0">
          <Select
            value={courseFilter}
            onChange={setCourse}
            options={(courses || []).map(c => ({ label: c, value: c }))}
            placeholder="All Courses"
          />
        </div>
        {(search || courseFilter) && (
          <button
            onClick={() => { setSearch(''); setCourse(''); }}
            className="px-3 py-2.5 text-xs text-txt-3 border border-border rounded-lg hover:text-txt hover:border-border-2 transition-colors self-start sm:self-end"
          >
            Clear
          </button>
        )}
      </div>

      <Card className="!p-0">
        {loading && <Loading />}
        {error   && <div className="p-5"><ErrorState message={error} /></div>}
        {!loading && !error && (
          <Table columns={columns} data={students} emptyMessage="No students found" />
        )}
      </Card>

      {infoStudent && <StudentInfoModal student={infoStudent} onClose={() => setInfo(null)} />}
      {perfStudent && <PerformanceModal student={perfStudent} onClose={() => setPerf(null)} />}
    </div>
  );
}
