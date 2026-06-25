import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientById, deletePatient } from '../../services/patientService';
import { getAppointments } from '../../services/appointmentService';
import type { Patient } from '../../types/patient';
import type { Appointment } from '../../types/appointment';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import HealthTimeline from '../../components/HealthTimeline';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPatientById(id).then(setPatient).catch(() => setError('Could not load patient'));
    getAppointments().then((all) => setAppointments(all.filter((a) => String(a.patientId) === id))).catch(() => {});
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm('Delete this patient record? This cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await deletePatient(id);
      navigate('/patients');
    } catch {
      setError('Could not delete patient');
      setIsDeleting(false);
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Patient details</h1>
        {patient && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate(`/patients/${id}/edit`)}>Edit</Button>
            <Button variant="danger" size="sm" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {patient && (
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-gray-500 text-sm">Name</span><p>{patient.name}</p></div>
            <div><span className="text-gray-500 text-sm">Age</span><p>{patient.age}</p></div>
            <div><span className="text-gray-500 text-sm">Phone</span><p>{patient.phone}</p></div>
            <div><span className="text-gray-500 text-sm">Blood group</span><p>{patient.bloodGroup}</p></div>
            <div className="col-span-2"><span className="text-gray-500 text-sm">Address</span><p>{patient.address}</p></div>
           <div><span className="text-gray-500 text-sm">Status</span><div className="mt-1"><StatusBadge status={patient.status} /></div></div>
          </div>
        </Card>
      )}

      {patient && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Medical history</h2>
          <HealthTimeline appointments={appointments} />
        </div>
      )}
    </Layout>
  );
}