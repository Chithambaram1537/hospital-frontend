import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatients } from '../../services/patientService';
import type { Patient } from '../../types/patient';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Input from '../../components/Input';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 10;

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch(() => setError('Could not load patients'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter((p) => p.name.toLowerCase().includes(term) || p.phone.includes(term));
  }, [patients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button onClick={() => navigate('/patients/new')}>+ Add patient</Button>
      </div>

      <div className="mb-4 max-w-sm">
        <Input label="Search" value={search} onChange={handleSearchChange} placeholder="Name or phone..." />
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {isLoading && <p className="text-gray-500">Loading patients...</p>}
      {!isLoading && !error && (
        <Card>
          {filtered.length === 0 && <p className="text-gray-500 text-sm py-4 text-center">No patients match your search.</p>}
          {filtered.length > 0 && (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="py-2">Name</th><th className="py-2">Age</th>
                    <th className="py-2">Phone</th><th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => (
                    <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <td className="py-2">{p.name}</td>
                      <td className="py-2">{p.age}</td>
                      <td className="py-2">{p.phone}</td>
                      <td className="py-2"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </Card>
      )}
    </Layout>
  );
}