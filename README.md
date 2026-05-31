# 🎨 EduMetrics — Exam Analytics Frontend For [National Post Graduate College](https://www.npgc.in/)

<img width="1710" height="995" alt="Screenshot 2026-05-31 at 10 32 12 AM" src="https://github.com/user-attachments/assets/8e9af199-005d-48ef-947c-3726a592377b" />

### ⚠️ No longer being hosted due to server costs.

For more Screenshots, goto screenshots dir of this project.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

> The Vite dev server automatically proxies `/api` requests to `http://localhost:3000` (NestJS backend).  
> Have the backend server setup first. [Backend Project](https://github.com/Priyanshu-Batham/edumetric-backend)

## 🏗️ Build for Production

```bash
npm run build
# Output in /dist — serve with any static host (Nginx, Vercel, etc.)
```

## 📁 Project Structure

```
src/
├── lib/
│   └── api.js            # All API calls (auto-proxied to backend)
├── hooks/
│   └── useFetch.js       # useFetch + useAsync hooks
├── components/
│   ├── ui/               # Design system components
│   │   └── index.jsx     # Card, Table, Modal, Button, Input, Badge, etc.
│   └── layout/
│       └── Layout.jsx    # Sidebar + topbar shell
├── pages/
│   ├── Dashboard.jsx     # KPI overview + charts
│   ├── Students.jsx      # Student CRUD + performance modal
│   ├── Subjects.jsx      # Subject CRUD + stats modal
│   ├── ExamSessions.jsx  # Sessions + inline result entry
│   ├── Analytics.jsx     # Semester/subject/compare tabs
│   └── Rankings.jsx      # All-time, semester, subject, lookup tabs
├── index.css             # CSS variables + global styles
└── App.jsx               # Router
```

## 🎨 Design

- **Dark theme** with `#0c0e14` base and `#f0c040` gold accent
- **Syne** display font + **DM Sans** body + **DM Mono** for codes
- Recharts for all charts (bar, line, pie)
- Fully responsive sidebar (collapsible)

## 📡 Pages & Features

| Page | Features |
|------|---------|
| Dashboard | KPI stats, pass/fail pie, SGPA distribution, grade spread, top-5, course distribution |
| Students | Search, filter by course, CRUD, full performance modal with SGPA trend chart |
| Subjects | Search, CRUD, per-subject stats + histogram modal |
| Exam Sessions | Filter by semester/session/result, CRUD, detail view with inline subject result entry |
| Analytics | Global overview, semester drill-down, subject drill-down, multi-student comparison |
| Rankings | All-time CGPA leaderboard, semester rank, subject rank, student rank/percentile lookup |

## 🔧 Changing the API URL

Edit `vite.config.js` to point the proxy at a different backend:

```js
proxy: {
  '/api': {
    target: 'http://your-backend-url:3000',
    changeOrigin: true,
  },
},
```

For production builds, set `VITE_API_BASE` or configure your reverse proxy to route `/api` to the backend.
