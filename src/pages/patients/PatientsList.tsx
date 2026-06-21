import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatients } from '../../services/patientService';
import  type { Patient } from '../../types/patient';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch(() => setError('Could not load patients'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button onClick={() => navigate('/patients/new')}>+ Add patient</Button>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {isLoading && <p className="text-gray-500">Loading patients...</p>}
      {!isLoading && !error && (
        <Card>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="py-2">Name</th><th className="py-2">Age</th>
                <th className="py-2">Phone</th><th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.age}</td>
                  <td className="py-2">{p.phone}</td>
                  <td className="py-2 capitalize">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </Layout>
  );
}