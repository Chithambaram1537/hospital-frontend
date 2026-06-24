import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments } from '../../services/appointmentService';
import type { Appointment } from '../../types/appointment';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAppointments()
      .then(setAppointments)
      .catch(() => setError('Could not load appointments'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Appointments
          </h1>
          <p className="text-gray-500 mt-1">
            Manage patient appointments and schedules.
          </p>
        </div>

        <Button onClick={() => navigate('/appointments/book')}>+ Book appointment</Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by patient, doctor or status..."
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
            Loading appointments...
          </p>
        </Card>
      )}

      {!isLoading && !error && (
        <Card>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-700">
                No Appointments Found
              </h3>
              <p className="text-gray-500 mt-2">
                Try another search keyword.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wide">
                    <th className="py-4 px-2">Patient</th>
                    <th className="py-4 px-2">Doctor</th>
                    <th className="py-4 px-2">Date</th>
                    <th className="py-4 px-2">Time</th>
                    <th className="py-4 px-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => navigate(`/appointments/${a.id}`)}
                      className="border-b border-gray-100 hover:bg-blue-50 transition cursor-pointer"
                    >
                      <td className="py-4 px-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {a.patientName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Appointment #{a.id}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-2">
                        {a.doctorName}
                      </td>

                      <td className="py-4 px-2">
                        {a.date}
                      </td>

                      <td className="py-4 px-2">
                        {a.time}
                      </td>

                      <td className="py-4 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            a.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : a.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {a.status}
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