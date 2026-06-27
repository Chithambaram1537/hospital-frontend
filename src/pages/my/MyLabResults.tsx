import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { getLabResults } from '../../services/labService';
import type { LabResult } from '../../types/lab';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';

export default function MyLabResults() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<LabResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.patientId) return;
    getLabResults(user.patientId)
      .then(setResults)
      .catch(() => setError('Could not load your lab results'))
      .finally(() => setIsLoading(false));
  }, [user?.patientId]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">My lab results</h1>
      {error && <Alert variant="error">{error}</Alert>}
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {!isLoading && !error && results.length === 0 && <p className="text-gray-500 text-sm">No lab results on file yet.</p>}
      {!isLoading && results.length > 0 && (
        <div className="space-y-3">
          {results.map((r) => (
            <Card key={r.id}>
              <button onClick={() => navigate(`/my/lab-results/${r.id}`)} className="w-full text-left flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.testName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.date} — ordered by {r.doctorName}</p>
                </div>
                <div className="flex items-center gap-2">
                  {r.isAbnormal && <StatusBadge status="abnormal" />}
                  <StatusBadge status={r.status} />
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}