const BASE = import.meta.env.VITE_API_BASE_URL;

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

// Students
export const studentsApi = {
  list: (params = {}) => req('/students?' + new URLSearchParams(params)),
  get: (id) => req(`/students/${id}`),
  getByEnrollment: (no) => req(`/students/enrollment/${no}`),
  performance: (id) => req(`/students/${id}/performance`),
  courses: () => req('/students/courses'),
  count: () => req('/students/count'),
  create: (data) => req('/students', { method: 'POST', body: data }),
  update: (id, data) => req(`/students/${id}`, { method: 'PUT', body: data }),
  remove: (id) => req(`/students/${id}`, { method: 'DELETE' }),
};

// Subjects
export const subjectsApi = {
  list: (search) => req('/subjects' + (search ? `?search=${search}` : '')),
  get: (id) => req(`/subjects/${id}`),
  create: (data) => req('/subjects', { method: 'POST', body: data }),
  update: (id, data) => req(`/subjects/${id}`, { method: 'PUT', body: data }),
  remove: (id) => req(`/subjects/${id}`, { method: 'DELETE' }),
};

// Exam Sessions
export const examSessionsApi = {
  list: (params = {}) => req('/exam-sessions?' + new URLSearchParams(params)),
  get: (id) => req(`/exam-sessions/${id}`),
  forStudent: (studentId) => req(`/exam-sessions/student/${studentId}`),
  semesters: () => req('/exam-sessions/semesters'),
  sessionNames: () => req('/exam-sessions/exam-session-names'),
  create: (data) => req('/exam-sessions', { method: 'POST', body: data }),
  update: (id, data) => req(`/exam-sessions/${id}`, { method: 'PUT', body: data }),
  remove: (id) => req(`/exam-sessions/${id}`, { method: 'DELETE' }),
};

// Subject Results
export const subjectResultsApi = {
  list: (params = {}) => req('/subject-results?' + new URLSearchParams(params)),
  get: (id) => req(`/subject-results/${id}`),
  create: (data) => req('/subject-results', { method: 'POST', body: data }),
  bulkCreate: (results) => req('/subject-results/bulk', { method: 'POST', body: { results } }),
  update: (id, data) => req(`/subject-results/${id}`, { method: 'PUT', body: data }),
  remove: (id) => req(`/subject-results/${id}`, { method: 'DELETE' }),
};

// Analytics
export const analyticsApi = {
  overview: () => req('/analytics/overview'),
  semester: (semester) => req(`/analytics/semester/${encodeURIComponent(semester)}`),
  subject: (id, params = {}) => req(`/analytics/subject/${id}?` + new URLSearchParams(params)),
  subjectHistogram: (id, bins = 10) => req(`/analytics/subject/${id}/histogram?bins=${bins}`),
  gradeDistribution: (params = {}) => req('/analytics/grade-distribution?' + new URLSearchParams(params)),
  sgpaDistribution: (params = {}) => req('/analytics/sgpa-distribution?' + new URLSearchParams(params)),
  topPerformers: (params = {}) => req('/analytics/top-performers?' + new URLSearchParams(params)),
  compareStudents: (ids) => req(`/analytics/compare-students?ids=${ids.join(',')}`),
  compareExamSessions: (s1, s2) => req(`/analytics/compare-exam-sessions?session1=${encodeURIComponent(s1)}&session2=${encodeURIComponent(s2)}`),
  studentTrend: (id) => req(`/analytics/student/${id}/trend`),
  course: (course) => req(`/analytics/course/${encodeURIComponent(course)}`),
};

// Rankings
export const rankingsApi = {
  bySemester: (semester, params = {}) => req(`/rankings/semester/${encodeURIComponent(semester)}?` + new URLSearchParams(params)),
  bySubject: (id, params = {}) => req(`/rankings/subject/${id}?` + new URLSearchParams(params)),
  byCourse: (course, params = {}) => req(`/rankings/course/${encodeURIComponent(course)}?` + new URLSearchParams(params)),
  overall: (params = {}) => req('/rankings/overall?' + new URLSearchParams(params)),
  studentRank: (id, semester, params = {}) => req(`/rankings/student/${id}/rank?semester=${encodeURIComponent(semester)}&` + new URLSearchParams(params)),
  studentPercentile: (id, semester) => req(`/rankings/student/${id}/percentile?semester=${encodeURIComponent(semester)}`),
};
