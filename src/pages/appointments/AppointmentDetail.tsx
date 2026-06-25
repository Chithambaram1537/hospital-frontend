import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { getAppointmentById, deleteAppointment, addConsultationNotes } from '../../services/appointmentService';
import type { Appointment, Prescription, Vitals } from '../../types/appointment';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import AddConsultationModal from '../../components/AddConsultationModal';

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  function load() {
    if (!id) return;
    getAppointmentById(id).then(setAppointment).catch(() => setError('Could not load appointment'));
  }

  useEffect(load, [id]);

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm('Cancel and remove this appointment? This cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await deleteAppointment(id);
      navigate('/appointments');
    } catch {
      setError('Could not delete appointment');
      setIsDeleting(false);
    }
  }

  async function handleSaveNotes(data: { chiefComplaint: string; diagnosis: string; vitals: Vitals; prescriptions: Prescription[] }) {
    if (!id) return;
    await addConsultationNotes(id, { ...data, status: 'completed' });
    load();
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Appointment details</h1>
        {appointment && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsNotesOpen(true)}>
              <span className="flex items-center gap-1.5"><Stethoscope size={14} />Add notes</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate(`/appointments/${id}/edit`)}>Edit</Button>
            <Button variant="danger" size="sm" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {appointment && (
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-gray-500 text-sm">Patient</span><p>{appointment.patientName}</p></div>
            <div><span className="text-gray-500 text-sm">Doctor</span><p>{appointment.doctorName}</p></div>
            <div><span className="text-gray-500 text-sm">Date</span><p>{appointment.date}</p></div>
            <div><span className="text-gray-500 text-sm">Time</span><p>{appointment.time}</p></div>
            <div className="col-span-2"><span className="text-gray-500 text-sm">Reason</span><p>{appointment.reason}</p></div>
            <div><span className="text-gray-500 text-sm">Status</span><div className="mt-1"><StatusBadge status={appointment.status} /></div></div>
          </div>
          {appointment.diagnosis && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-gray-500 text-sm">Diagnosis</span>
              <p className="text-sm mt-1">{appointment.diagnosis}</p>
            </div>
          )}
        </Card>
      )}

      <AddConsultationModal isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} onSave={handleSaveNotes} />
    </Layout>
  );
}