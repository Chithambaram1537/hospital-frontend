import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors } from '../../services/doctorService';
import type { Doctor } from '../../types/doctor';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch(() => setError('Could not load doctors'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <Button onClick={() => navigate('/doctors/new')}>+ Add doctor</Button>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {isLoading && <p className="text-gray-500">Loading doctors...</p>}
      {!isLoading && !error && (
        <Card>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="py-2">Name</th><th className="py-2">Specialty</th>
                <th className="py-2">Phone</th><th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id} onClick={() => navigate(`/doctors/${d.id}`)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="py-2">{d.name}</td>
                  <td className="py-2">{d.specialty}</td>
                  <td className="py-2">{d.phone}</td>
                  <td className="py-2 capitalize">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </Layout>
  );
}