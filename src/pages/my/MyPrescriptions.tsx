import { useEffect, useState } from 'react';
import { Pill } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { getAppointments } from '../../services/appointmentService';
import type { Appointment, Prescription } from '../../types/appointment';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

interface FlatPrescription extends Prescription {
  date: string;
  doctorName: string;
}

export default function MyPrescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<FlatPrescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAppointments()
      .then((all: Appointment[]) => {
        const mine = all.filter((a) => a.patientId === user?.patientId && a.prescriptions?.length);
        const flat: FlatPrescription[] = [];
        mine.forEach((a) => {
          a.prescriptions?.forEach((p) => flat.push({ ...p, date: a.date, doctorName: a.doctorName }));
        });
        flat.sort((a, b) => b.date.localeCompare(a.date));
        setPrescriptions(flat);
      })
      .catch(() => setError('Could not load your prescriptions'))
      .finally(() => setIsLoading(false));
  }, [user?.patientId]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">My prescriptions</h1>
      {error && <Alert variant="error">{error}</Alert>}
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {!isLoading && !error && prescriptions.length === 0 && <p className="text-gray-500 text-sm">No prescriptions on file yet.</p>}
      {!isLoading && prescriptions.length > 0 && (
        <Card>
          <div className="space-y-2">
            {prescriptions.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Pill size={15} /></div>
                  <div>
                    <p className="text-sm font-medium">{p.medicine}</p>
                    <p className="text-xs text-gray-500">{p.dosage} · {p.frequency}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{p.date}</p>
                  <p className="text-xs text-gray-500">{p.doctorName}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Layout>
  );
}