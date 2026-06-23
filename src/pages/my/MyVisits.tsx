import { useEffect, useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { getAppointments } from '../../services/appointmentService';
import type { Appointment } from '../../types/appointment';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function MyVisits() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAppointments()
      .then((all) => {
        const completed = all
          .filter((a) => a.patientId === user?.patientId && a.status === 'completed')
          .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
        setVisits(completed);
      })
      .catch(() => setError('Could not load visit history'))
      .finally(() => setIsLoading(false));
  }, [user?.patientId]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Visit history</h1>
      {error && <Alert variant="error">{error}</Alert>}
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {!isLoading && !error && visits.length === 0 && (
        <p className="text-gray-500 text-sm">No completed visits on record yet.</p>
      )}
      {!isLoading && visits.length > 0 && (
        <div className="relative pl-6 space-y-6">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />
          {visits.map((v) => (
            <div key={v.id} className="relative">
              <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white" />
              <Card>
                <p className="text-xs text-gray-400 mb-1">{v.date}</p>
                <p className="font-medium">{v.doctorName}</p>
                <p className="text-sm text-gray-500 mt-1">{v.reason}</p>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}