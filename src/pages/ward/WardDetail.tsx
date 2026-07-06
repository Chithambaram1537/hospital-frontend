import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BedDouble, Plus } from 'lucide-react';
import { getWardById, getBedsForWard, getAdmissions } from '../../services/wardService';
import type { Ward, Bed, Admission } from '../../types/ward';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';

const BED_STATUS_STYLES: Record<string, string> = {
  available: 'border-green-200 bg-green-50 dark:bg-green-900/20',
  occupied: 'border-red-200 bg-red-50 dark:bg-red-900/20',
  maintenance: 'border-amber-200 bg-amber-50 dark:bg-amber-900/20',
  reserved: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20',
};

export default function WardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ward, setWard] = useState<Ward | null>(null);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([getWardById(id), getBedsForWard(id), getAdmissions({ wardId: id, status: 'active' })])
      .then(([w, b, a]) => { setWard(w); setBeds(b); setAdmissions(a); })
      .catch(() => setError('Could not load ward details'));
  }, [id]);

  function getAdmissionForBed(bedId: string) {
    return admissions.find((a) => a.bedId === bedId);
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{ward?.wardName ?? 'Ward'}</h1>
          {ward && <p className="text-sm text-gray-500 mt-0.5">{ward.wardCode} · Floor {ward.floor ?? '—'}</p>}
        </div>
        <Button onClick={() => navigate('/admissions/new')}>
          <span className="flex items-center gap-1.5"><Plus size={16} />Admit patient</span>
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {ward && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 text-center">
            <p className="text-2xl font-mono font-semibold text-primary">{ward.availableBeds}</p>
            <p className="text-xs text-gray-500 mt-1">Available</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 text-center">
            <p className="text-2xl font-mono font-semibold text-danger">{ward.occupiedBeds}</p>
            <p className="text-xs text-gray-500 mt-1">Occupied</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 text-center">
            <p className="text-2xl font-mono font-semibold text-gray-900 dark:text-gray-100">{ward.totalBeds}</p>
            <p className="text-xs text-gray-500 mt-1">Total</p>
          </div>
        </div>
      )}

      <Card>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <BedDouble size={16} className="text-primary" />Bed map
        </h2>
        {beds.length === 0 && <p className="text-gray-500 text-sm">No beds recorded for this ward.</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {beds.map((bed) => {
            const admission = getAdmissionForBed(bed.id);
            return (
              <div key={bed.id} className={`rounded-xl border p-3 ${BED_STATUS_STYLES[bed.status] ?? ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{bed.bedNumber}</p>
                  <StatusBadge status={bed.status} />
                </div>
                {admission && (
                  <button onClick={() => navigate(`/admissions/${admission.id}`)} className="w-full text-left mt-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{admission.patientName}</p>
                    <p className="text-xs text-gray-400">Since {admission.admissionDate}</p>
                  </button>
                )}
                {!admission && bed.status === 'available' && (
                  <button onClick={() => navigate(`/admissions/new?bedId=${bed.id}&wardId=${id}`)}
                    className="text-xs text-primary font-medium mt-1 hover:underline">Admit patient</button>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </Layout>
  );
}