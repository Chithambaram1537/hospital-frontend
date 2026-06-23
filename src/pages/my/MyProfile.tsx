import { useEffect, useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { getPatientById } from '../../services/patientService';
import type { Patient } from '../../types/patient';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';

export default function MyProfile() {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.patientId) return;
    getPatientById(String(user.patientId))
      .then(setPatient)
      .catch(() => setError('Could not load your profile'));
  }, [user?.patientId]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">My profile</h1>
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
    </Layout>
  );
}