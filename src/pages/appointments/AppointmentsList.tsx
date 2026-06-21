import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments } from '../../services/appointmentService';
import type { Appointment } from '../../types/appointment';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAppointments()
      .then(setAppointments)
      .catch(() => setError('Could not load appointments'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button onClick={() => navigate('/appointments/new')}>+ Add appointment</Button>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {isLoading && <p className="text-gray-500">Loading appointments...</p>}
      {!isLoading && !error && (
        <Card>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="py-2">Patient</th><th className="py-2">Doctor</th>
                <th className="py-2">Date</th><th className="py-2">Time</th><th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} onClick={() => navigate(`/appointments/${a.id}`)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="py-2">{a.patientName}</td>
                  <td className="py-2">{a.doctorName}</td>
                  <td className="py-2">{a.date}</td>
                  <td className="py-2">{a.time}</td>
                  <td className="py-2 capitalize">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </Layout>
  );
}