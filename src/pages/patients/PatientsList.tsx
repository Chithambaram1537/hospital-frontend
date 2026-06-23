import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatients } from '../../services/patientService';
import type { Patient } from '../../types/patient';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch(() => setError('Could not load patients'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Patients
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and monitor patient records.
          </p>
        </div>

        <Button onClick={() => navigate('/patients/new')}>
          + Add Patient
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {isLoading && (
        <Card>
          <p className="text-gray-500 text-center py-6">
            Loading patients...
          </p>
        </Card>
      )}

      {!isLoading && !error && (
        <Card>
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-700">
                No Patients Found
              </h3>

              <p className="text-gray-500 mt-2">
                Try a different search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wide">
                    <th className="py-4 px-2">Patient</th>
                    <th className="py-4 px-2">Age</th>
                    <th className="py-4 px-2">Phone</th>
                    <th className="py-4 px-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatients.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/patients/${p.id}`)}
                      className="border-b border-gray-100 hover:bg-blue-50 transition cursor-pointer"
                    >
                      <td className="py-4 px-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {p.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            Patient ID: #{p.id}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-2">
                        {p.age}
                      </td>

                      <td className="py-4 px-2">
                        {p.phone}
                      </td>

                      <td className="py-4 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            p.status === 'admitted'
                              ? 'bg-green-100 text-green-700'
                              : p.status === 'discharged'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </Layout>
  );
}