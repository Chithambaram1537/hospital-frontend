import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatients } from '../services/patientService';
import { getDoctors } from '../services/doctorService';
import { getAppointments } from '../services/appointmentService';
import type { Patient } from '../types/patient';
import type { Doctor } from '../types/doctor';
import type { Appointment } from '../types/appointment';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Alert from '../components/Alert';

function todayString() {
  return new Date().toISOString().split('T')[0];
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getPatients(),
      getDoctors(),
      getAppointments(),
    ])
      .then(([p, d, a]) => {
        setPatients(p);
        setDoctors(d);
        setAppointments(a);
      })
      .catch(() =>
        setError('Could not load dashboard data')
      )
      .finally(() => setIsLoading(false));
  }, []);

  const admittedCount = patients.filter(
    (p) => p.status === 'admitted'
  ).length;

  const availableDoctorsCount = doctors.filter(
    (d) => d.status === 'available'
  ).length;

  const todaysAppointments = appointments.filter(
    (a) => a.date === todayString()
  );

  if (isLoading) {
    return (
      <Layout>
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Hospital Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor patients, doctors and appointments
          in real time.
        </p>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {!error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Patients"
              value={patients.length}
              sublabel={`${admittedCount} admitted`}
            />

            <StatCard
              label="Total Doctors"
              value={doctors.length}
              sublabel={`${availableDoctorsCount} available`}
            />

            <StatCard
              label="Appointments"
              value={appointments.length}
            />

            <StatCard
              label="Today's Appointments"
              value={todaysAppointments.length}
            />
          </div>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Today's Appointments
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Scheduled consultations for today
                </p>
              </div>
            </div>

            {todaysAppointments.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">
                  No appointments scheduled for today.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Patient
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Doctor
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Time
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {todaysAppointments.map((a) => (
                      <tr
                        key={a.id}
                        onClick={() =>
                          navigate(
                            `/appointments/${a.id}`
                          )
                        }
                        className="border-b border-gray-100 hover:bg-blue-50 transition cursor-pointer"
                      >
                        <td className="px-4 py-4 font-medium text-gray-900">
                          {a.patientName}
                        </td>

                        <td className="px-4 py-4 text-gray-700">
                          {a.doctorName}
                        </td>

                        <td className="px-4 py-4">
                          {a.time}
                        </td>

                        <td className="px-4 py-4">
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
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
        </>
      )}
    </Layout>
  );
}