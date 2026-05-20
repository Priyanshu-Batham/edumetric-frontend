import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { examSessionsApi } from '../lib/api';
import {
  Card, Table, Modal, Select, Loading, ErrorState,
  SectionHeader, Badge, StatCard,
} from '../components/ui';

/* ── Session detail modal (view-only) ──────────────────────────── */
function SessionDetailModal({ session, onClose }) {
  const { data, loading, error } = useFetch(
    () => examSessionsApi.get(session.id),
    [session.id]
  );

  return (
    <Modal open onClose={onClose} title={`Session — ${data?.student?.name || '…'}`} wide>
      {loading && <Loading />}
      {error   && <ErrorState message={error} />}
      {data && (
        <div className="flex flex-col gap-5">

          {/* Student info banner */}
          <div className="bg-bg-3 rounded-xl px-4 py-3 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-display font-bold text-accent text-lg">
              {data.student?.name?.[0] || '?'}
            </div>
            <div>
              <div className="font-semibold text-txt">{data.student?.name}</div>
              <div className="font-mono text-[10px] text-txt-3">
                {data.student?.enrollment_no} · {data.student?.course}
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard label="Semester" value={data.semester} />
            <StatCard label="SGPA"     value={data.sgpa}     color="accent" />
            <StatCard
              label="Marks"
              value={data.total_marks && data.max_marks ? `${data.total_marks}/${data.max_marks}` : '—'}
            />
            <StatCard
              label="Result"
              value={data.result || '—'}
              color={data.result?.toUpperCase() === 'PASS' ? 'emerald' : 'crimson'}
            />
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              ['Exam Session',    data.exam_session],
              ['Avg Grade',       data.average_grade],
              ['Total Credits',   data.total_credits],
            ].map(([label, val]) => (
              <div key={label} className="bg-bg-3 rounded-lg px-3.5 py-3">
                <div className="font-mono text-[10px] text-txt-3 uppercase tracking-widest mb-1">{label}</div>
                <div className="text-txt font-medium">{val ?? '—'}</div>
              </div>
            ))}
          </div>

          {/* Subject results table */}
          <div>
            <p className="font-display font-semibold text-sm text-txt mb-3">Subject Results</p>
            {(data.subject_results || []).length === 0 ? (
              <p className="text-txt-3 text-xs py-4">No subject results recorded</p>
            ) : (
              <div className="flex flex-col gap-2">
                {(data.subject_results || []).map(sr => (
                  <div key={sr.id}
                    className="flex items-center gap-3 bg-bg-3 rounded-lg px-3.5 py-2.5">
                    <span className="font-mono text-[11px] text-accent w-16 shrink-0">{sr.subject?.paper_code}</span>
                    <span className="flex-1 text-sm text-txt-2 truncate">{sr.subject?.paper_name}</span>
                    <span className="font-mono text-sm text-txt">{sr.marks ?? '—'}</span>
                    <span className="font-mono text-[10px] text-txt-3">cr:{sr.credit ?? '—'}</span>
                    {sr.grade && <Badge color={sr.grade === 'F' ? 'red' : 'blue'}>{sr.grade}</Badge>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function ExamSessions() {
  const [semFilter,     setSem]     = useState('');
  const [sessionFilter, setSession] = useState('');
  const [resultFilter,  setResult]  = useState('');
  const [detailSession, setDetail]  = useState(null);

  const { data: sessions, loading, error } = useFetch(
    () => examSessionsApi.list({ semester: semFilter, exam_session: sessionFilter, result: resultFilter }),
    [semFilter, sessionFilter, resultFilter]
  );
  const { data: semesters }    = useFetch(examSessionsApi.semesters);
  const { data: sessionNames } = useFetch(examSessionsApi.sessionNames);

  const passCount = (sessions || []).filter(s => s.result?.toUpperCase() === 'PASS').length;
  const failCount = (sessions || []).filter(s => s.result?.toUpperCase() === 'FAIL').length;
  const avgSgpa   = (() => {
    const vals = (sessions || []).filter(s => s.sgpa != null).map(s => s.sgpa);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null;
  })();

  const columns = [
    {
      key: 'student', label: 'Student',
      render: (_, r) => (
        <div>
          <div className="font-medium text-txt text-sm">{r.student?.name}</div>
          <div className="font-mono text-[10px] text-txt-3">{r.student?.enrollment_no}</div>
        </div>
      ),
    },
    {
      key: 'semester', label: 'Semester',
      render: v => <Badge color="blue">{v}</Badge>,
    },
    {
      key: 'exam_session', label: 'Session',
      render: v => <span className="font-mono text-xs text-txt-2">{v}</span>,
    },
    {
      key: 'sgpa', label: 'SGPA',
      render: v => v != null
        ? <span className="font-display font-bold text-accent text-lg">{v}</span>
        : '—',
    },
    {
      key: 'total_marks', label: 'Marks',
      render: (v, r) => v && r.max_marks ? `${v}/${r.max_marks}` : '—',
    },
    {
      key: 'result', label: 'Result',
      render: v => v ? <Badge color={v.toUpperCase() === 'PASS' ? 'green' : 'red'}>{v}</Badge> : '—',
    },
    {
      key: '_actions', label: '',
      render: (_, row) => (
        <button
          onClick={e => { e.stopPropagation(); setDetail(row); }}
          className="px-3 py-1.5 text-xs rounded-lg border border-border text-txt-2 hover:border-accent hover:text-accent transition-colors"
        >
          View Detail
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <SectionHeader title="Exam Sessions" subtitle={`${sessions?.length ?? 0} sessions`} />

      {/* Summary KPIs */}
      {sessions?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total"    value={sessions.length} />
          <StatCard label="Pass"     value={passCount}  color="emerald" />
          <StatCard label="Fail"     value={failCount}  color="crimson" />
          <StatCard label="Avg SGPA" value={avgSgpa}    color="accent" />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="w-44">
          <Select
            value={semFilter}
            onChange={setSem}
            options={(semesters || []).map(s => ({ label: s, value: s }))}
            placeholder="All Semesters"
          />
        </div>
        <div className="w-52">
          <Select
            value={sessionFilter}
            onChange={setSession}
            options={(sessionNames || []).map(s => ({ label: s, value: s }))}
            placeholder="All Sessions"
          />
        </div>
        <div className="w-36">
          <Select
            value={resultFilter}
            onChange={setResult}
            options={['PASS', 'FAIL']}
            placeholder="All Results"
          />
        </div>
        {(semFilter || sessionFilter || resultFilter) && (
          <button
            onClick={() => { setSem(''); setSession(''); setResult(''); }}
            className="px-3 py-2 text-xs text-txt-3 border border-border rounded-lg hover:text-txt hover:border-border-2 transition-colors self-end"
          >
            Clear
          </button>
        )}
      </div>

      <Card className="!p-0">
        {loading && <Loading />}
        {error   && <div className="p-5"><ErrorState message={error} /></div>}
        {!loading && !error && (
          <Table columns={columns} data={sessions} emptyMessage="No exam sessions found" />
        )}
      </Card>

      {detailSession && (
        <SessionDetailModal session={detailSession} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}
