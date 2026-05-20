import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Subjects from './pages/Subjects';
import ExamSessions from './pages/ExamSessions';
import Analytics from './pages/Analytics';
import Rankings from './pages/Rankings';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/exam-sessions" element={<ExamSessions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/rankings" element={<Rankings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
