import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import type { Prescription, Vitals } from '../types/appointment';

interface AddConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { chiefComplaint: string; diagnosis: string; vitals: Vitals; prescriptions: Prescription[] }) => Promise<void>;
}

export default function AddConsultationModal({ isOpen, onClose, onSave }: AddConsultationModalProps) {
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [bp, setBp] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [oxygen, setOxygen] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([{ medicine: '', dosage: '', frequency: '' }]);
  const [isSaving, setIsSaving] = useState(false);

  function updatePrescription(index: number, field: keyof Prescription, value: string) {
    setPrescriptions((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }

  function addPrescriptionRow() {
    setPrescriptions((prev) => [...prev, { medicine: '', dosage: '', frequency: '' }]);
  }

  function removePrescriptionRow(index: number) {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave({
        chiefComplaint, diagnosis,
        vitals: { bp, temperature, weight, oxygen },
        prescriptions: prescriptions.filter((p) => p.medicine.trim()),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add consultation notes">
      <Input label="Chief complaint" value={chiefComplaint} onChange={setChiefComplaint} placeholder="What brought the patient in" />
      <Input label="Diagnosis" value={diagnosis} onChange={setDiagnosis} />

      <p className="text-sm font-medium text-gray-700 mb-2 mt-2">Vitals</p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Input label="Blood pressure" value={bp} onChange={setBp} placeholder="120/80" />
        <Input label="Temperature" value={temperature} onChange={setTemperature} placeholder="98.6°F" />
        <Input label="Weight" value={weight} onChange={setWeight} placeholder="70kg" />
        <Input label="Oxygen (SpO2)" value={oxygen} onChange={setOxygen} placeholder="98%" />
      </div>

      <p className="text-sm font-medium text-gray-700 mb-2 mt-2">Prescriptions</p>
      <div className="space-y-2 mb-2">
        {prescriptions.map((p, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1"><Input label="Medicine" value={p.medicine} onChange={(v) => updatePrescription(i, 'medicine', v)} /></div>
            <div className="w-24"><Input label="Dosage" value={p.dosage} onChange={(v) => updatePrescription(i, 'dosage', v)} /></div>
            <div className="w-28"><Input label="Frequency" value={p.frequency} onChange={(v) => updatePrescription(i, 'frequency', v)} /></div>
            <button onClick={() => removePrescriptionRow(i)} className="text-gray-400 hover:text-danger mb-4" aria-label="Remove">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addPrescriptionRow} className="text-sm text-primary font-medium flex items-center gap-1 mb-4">
        <Plus size={14} />Add medicine
      </button>

      <Button onClick={handleSave} disabled={isSaving} fullWidth>{isSaving ? 'Saving...' : 'Save & mark completed'}</Button>
    </Modal>
  );
}