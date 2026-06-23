import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Queue from './pages/Queue';
import PatientsList from './pages/patients/PatientsList';
import PatientDetail from './pages/patients/PatientDetail';
import AddPatient from './pages/patients/AddPatient';
import EditPatient from './pages/patients/EditPatient';
import DoctorsList from './pages/doctors/DoctorsList';
import DoctorDetail from './pages/doctors/DoctorDetail';
import AddDoctor from './pages/doctors/AddDoctor';
import EditDoctor from './pages/doctors/EditDoctor';
import AppointmentsList from './pages/appointments/AppointmentsList';
import AppointmentDetail from './pages/appointments/AppointmentDetail';
import AddAppointment from './pages/appointments/AddAppointment';
import EditAppointment from './pages/appointments/EditAppointment';
import MyAppointments from './pages/my/MyAppointments';
import MyVisits from './pages/my/MyVisits';
import MyProfile from './pages/my/MyProfile';

const STAFF = ['admin', 'doctor'];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={STAFF}><Dashboard /></ProtectedRoute>} />
        <Route path="/queue" element={<ProtectedRoute allowedRoles={STAFF}><Queue /></ProtectedRoute>} />

        <Route path="/patients" element={<ProtectedRoute allowedRoles={STAFF}><PatientsList /></ProtectedRoute>} />
        <Route path="/patients/new" element={<ProtectedRoute allowedRoles={STAFF}><AddPatient /></ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute allowedRoles={STAFF}><PatientDetail /></ProtectedRoute>} />
        <Route path="/patients/:id/edit" element={<ProtectedRoute allowedRoles={STAFF}><EditPatient /></ProtectedRoute>} />

        <Route path="/doctors" element={<ProtectedRoute allowedRoles={STAFF}><DoctorsList /></ProtectedRoute>} />
        <Route path="/doctors/new" element={<ProtectedRoute allowedRoles={STAFF}><AddDoctor /></ProtectedRoute>} />
        <Route path="/doctors/:id" element={<ProtectedRoute allowedRoles={STAFF}><DoctorDetail /></ProtectedRoute>} />
        <Route path="/doctors/:id/edit" element={<ProtectedRoute allowedRoles={STAFF}><EditDoctor /></ProtectedRoute>} />

        <Route path="/appointments" element={<ProtectedRoute allowedRoles={STAFF}><AppointmentsList /></ProtectedRoute>} />
        <Route path="/appointments/new" element={<ProtectedRoute allowedRoles={STAFF}><AddAppointment /></ProtectedRoute>} />
        <Route path="/appointments/:id" element={<ProtectedRoute allowedRoles={STAFF}><AppointmentDetail /></ProtectedRoute>} />
        <Route path="/appointments/:id/edit" element={<ProtectedRoute allowedRoles={STAFF}><EditAppointment /></ProtectedRoute>} />

        <Route path="/my/appointments" element={<ProtectedRoute allowedRoles={['patient']}><MyAppointments /></ProtectedRoute>} />
        <Route path="/my/visits" element={<ProtectedRoute allowedRoles={['patient']}><MyVisits /></ProtectedRoute>} />
        <Route path="/my/profile" element={<ProtectedRoute allowedRoles={['patient']}><MyProfile /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}