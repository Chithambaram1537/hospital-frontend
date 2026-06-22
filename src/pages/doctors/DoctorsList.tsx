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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Doctors
          </h1>
          <p className="text-gray-500 mt-1">
            Manage hospital doctors and their availability.
          </p>
        </div>

        <Button onClick={() => navigate('/doctors/new')}>
          + Add Doctor
        </Button>
      </div>

      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {isLoading && (
        <Card>
          <p className="text-gray-500 text-center py-6">
            Loading doctors...
          </p>
        </Card>
      )}

      {!isLoading && !error && (
        <Card>
          {doctors.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-700">
                No Doctors Found
              </h3>
              <p className="text-gray-500 mt-2">
                Start by adding your first doctor.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wide">
                    <th className="py-4 px-2">Doctor</th>
                    <th className="py-4 px-2">Specialty</th>
                    <th className="py-4 px-2">Phone</th>
                    <th className="py-4 px-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {doctors.map((d) => (
                    <tr
                      key={d.id}
                      onClick={() => navigate(`/doctors/${d.id}`)}
                      className="border-b border-gray-100 hover:bg-blue-50 transition cursor-pointer"
                    >
                      <td className="py-4 px-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {d.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Doctor ID: #{d.id}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-2">
                        {d.specialty}
                      </td>

                      <td className="py-4 px-2">
                        {d.phone}
                      </td>

                      <td className="py-4 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            d.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : d.status === 'on-leave'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {d.status}
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