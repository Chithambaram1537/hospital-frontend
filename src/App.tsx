import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';
import PatientsList from './pages/patients/PatientsList';
import PatientDetail from './pages/patients/PatientDetail';
import AddPatient from './pages/patients/AddPatient';
function Dashboard() {
  return <Layout><h1 className="text-2xl font-bold">Dashboard (placeholder)</h1></Layout>;
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><PatientsList /></ProtectedRoute>} />
        <Route path="/patients/new" element={<ProtectedRoute><AddPatient /></ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute><PatientDetail /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}