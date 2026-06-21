import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPatientById } from '../../services/patientService';
import type { Patient } from '../../types/patient';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getPatientById(id).then(setPatient).catch(() => setError('Could not load patient'));
  }, [id]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Patient details</h1>
      {error && <Alert variant="error">{error}</Alert>}
      {patient && (
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-gray-500 text-sm">Name</span><p>{patient.name}</p></div>
            <div><span className="text-gray-500 text-sm">Age</span><p>{patient.age}</p></div>
            <div><span className="text-gray-500 text-sm">Phone</span><p>{patient.phone}</p></div>
            <div><span className="text-gray-500 text-sm">Blood group</span><p>{patient.bloodGroup}</p></div>
            <div className="col-span-2"><span className="text-gray-500 text-sm">Address</span><p>{patient.address}</p></div>
          </div>
        </Card>
      )}
    </Layout>
  );
}