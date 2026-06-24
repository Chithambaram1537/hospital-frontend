import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Stethoscope, Calendar, Clock, Plus, ListOrdered } from 'lucide-react';
import { getPatients } from '../../services/patientService';
import { getDoctors } from '../../services/doctorService';
import { getAppointments } from '../../services/appointmentService';
import type { Patient } from '../../types/patient';
import type { Doctor } from '../../types/doctor';
import type { Appointment } from '../../types/appointment';
import { todayString } from '../../utils/date';
import { useAuth } from '../../store/AuthContext';
import StatCard from '../../components/StatCard';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getPatients(), getDoctors(), getAppointments()])
      .then(([p, d, a]) => { setPatients(p); setDoctors(d); setAppointments(a); })
      .catch(() => setError('Could not load dashboard data'))
      .finally(() => setIsLoading(false));
  }, []);

  const todaysAppointments = appointments.filter((a) => a.date === todayString());
  const recentPatients = [...patients].sort((a, b) => b.id - a.id).slice(0, 5);

  if (isLoading) return <p className="text-gray-500">Loading dashboard...</p>;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening across the hospital today.</p>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {!error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total patients" value={patients.length} icon={<Users size={18} />} />
            <StatCard label="Total doctors" value={doctors.length} icon={<Stethoscope size={18} />} />
            <StatCard label="Total appointments" value={appointments.length} icon={<Calendar size={18} />} />
            <StatCard label="Today's appointments" value={todaysAppointments.length} icon={<Clock size={18} />} />
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={() => navigate('/patients/new')}>
              <span className="flex items-center gap-1.5"><Plus size={16} />Add patient</span>
            </Button>
            <Button variant="secondary" onClick={() => navigate('/doctors/new')}>
              <span className="flex items-center gap-1.5"><Plus size={16} />Add doctor</span>
            </Button>
            <Button variant="secondary" onClick={() => navigate('/queue')}>
              <span className="flex items-center gap-1.5"><ListOrdered size={16} />View queue</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Today's appointments</h2>
              {todaysAppointments.length === 0 && <p className="text-gray-500 text-sm">No appointments scheduled for today.</p>}
              <div className="space-y-1">
                {todaysAppointments.map((a) => (
                  <div key={a.id} onClick={() => navigate(`/appointments/${a.id}`)} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{a.patientName}</p>
                      <p className="text-xs text-gray-500">with {a.doctorName} at {a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Recently added patients</h2>
              {recentPatients.length === 0 && <p className="text-gray-500 text-sm">No patients yet.</p>}
              <div className="space-y-1">
                {recentPatients.map((p) => (
                  <div key={p.id} onClick={() => navigate(`/patients/${p.id}`)} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.phone}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
}