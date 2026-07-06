import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getWards, getBedsForWard, createAdmission } from '../../services/wardService';
import { getDoctors } from '../../services/doctorService';
import { getPatients } from '../../services/patientService';
import type { Ward, Bed } from '../../types/ward';
import type { Doctor } from '../../types/doctor';
import type { Patient } from '../../types/patient';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Input from '../../components/Input';
import { todayString } from '../../utils/date';

export default function NewAdmission() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledBedId = searchParams.get('bedId') ?? '';
  const prefilledWardId = searchParams.get('wardId') ?? '';

  const [wards, setWards] = useState<Ward[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [patientId, setPatientId] = useState('');
  const [wardId, setWardId] = useState(prefilledWardId);
  const [bedId, setBedId] = useState(prefilledBedId);
  const [doctorId, setDoctorId] = useState('');
  const [admissionDate, setAdmissionDate] = useState(todayString());
  const [expectedDischargeDate, setExpectedDischargeDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  useEffect(() => {
    Promise.all([getWards(), getPatients(), getDoctors()])
      .then(([w, p, d]) => { setWards(w); setPatients(p); setDoctors(d); })
      .catch(() => setError('Could not load data'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!wardId) { setBeds([]); setBedId(''); return; }
    getBedsForWard(wardId, 'available').then(setBeds).catch(() => {});
  }, [wardId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await createAdmission({
        patientId, wardId, bedId, admittingDoctorId: doctorId,
        admissionDate, expectedDischargeDate: expectedDischargeDate || undefined,
        diagnosis: diagnosis || undefined,
      });
      navigate('/admissions');
    } catch {
      setError('Could not create admission — check that the bed is still available');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Admit patient</h1>
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {!isLoading && (
        <Card>
          {error && <div className="mb-4"><Alert variant="error">{error}</Alert></div>}
          <form onSubmit={handleSubmit}>
            <Select label="Patient" value={patientId} onChange={setPatientId}
              options={patients.filter((p) => p.isActive !== false).map((p) => ({ value: p.id, label: `${p.name} · ${p.phone}` }))} />
            <Select label="Ward" value={wardId} onChange={(v) => { setWardId(v); setBedId(''); }}
              options={wards.filter((w) => w.isActive).map((w) => ({ value: w.id, label: `${w.wardName} (${w.availableBeds} available)` }))} />
            {wardId && (
              <Select label="Bed" value={bedId} onChange={setBedId}
                options={beds.map((b) => ({ value: b.id, label: b.bedNumber }))} />
            )}
            {wardId && beds.length === 0 && (
              <div className="mb-4"><Alert variant="warning">No available beds in this ward.</Alert></div>
            )}
            <Select label="Admitting doctor" value={doctorId} onChange={setDoctorId}
              options={doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.specialty})` }))} />
            <Input label="Admission date" type="date" value={admissionDate} onChange={setAdmissionDate} />
            <Input label="Expected discharge date" type="date" value={expectedDischargeDate} onChange={setExpectedDischargeDate} />
            <Input label="Primary diagnosis" value={diagnosis} onChange={setDiagnosis} placeholder="Initial diagnosis or reason for admission" />
            <div className="flex gap-2">
              <Button variant="secondary" type="button" onClick={() => navigate('/admissions')}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting || !patientId || !wardId || !bedId || !doctorId}>
                {isSubmitting ? 'Admitting...' : 'Admit patient'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </Layout>
  );
}