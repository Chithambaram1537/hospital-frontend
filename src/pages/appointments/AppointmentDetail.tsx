import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAppointmentById } from '../../services/appointmentService';
import type { Appointment } from '../../types/appointment';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function AppointmentDetail() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getAppointmentById(id).then(setAppointment).catch(() => setError('Could not load appointment'));
  }, [id]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Appointment details</h1>
      {error && <Alert variant="error">{error}</Alert>}
      {appointment && (
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-gray-500 text-sm">Patient</span><p>{appointment.patientName}</p></div>
            <div><span className="text-gray-500 text-sm">Doctor</span><p>{appointment.doctorName}</p></div>
            <div><span className="text-gray-500 text-sm">Date</span><p>{appointment.date}</p></div>
            <div><span className="text-gray-500 text-sm">Time</span><p>{appointment.time}</p></div>
            <div className="col-span-2"><span className="text-gray-500 text-sm">Reason</span><p>{appointment.reason}</p></div>
            <div><span className="text-gray-500 text-sm">Status</span><p className="capitalize">{appointment.status}</p></div>
          </div>
        </Card>
      )}
    </Layout>
  );
}