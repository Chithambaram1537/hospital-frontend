import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoctorById } from '../../services/doctorService';
import type { Doctor } from '../../types/doctor';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getDoctorById(id).then(setDoctor).catch(() => setError('Could not load doctor'));
  }, [id]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Doctor details</h1>
      {error && <Alert variant="error">{error}</Alert>}
      {doctor && (
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-gray-500 text-sm">Name</span><p>{doctor.name}</p></div>
            <div><span className="text-gray-500 text-sm">Specialty</span><p>{doctor.specialty}</p></div>
            <div><span className="text-gray-500 text-sm">Phone</span><p>{doctor.phone}</p></div>
            <div><span className="text-gray-500 text-sm">Email</span><p>{doctor.email}</p></div>
            <div><span className="text-gray-500 text-sm">Experience</span><p>{doctor.experience} years</p></div>
            <div><span className="text-gray-500 text-sm">Status</span><p className="capitalize">{doctor.status}</p></div>
          </div>
        </Card>
      )}
    </Layout>
  );
}