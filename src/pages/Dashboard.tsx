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
      .catch(() => {
        setError('Could not load dashboard data');
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      {/* Welcome Banner */}

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-2">
          Welcome Back 👋
        </h1>

        <p className="text-blue-100 text-lg">
          Monitor patients, doctors and appointments in real time.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => navigate('/patients/new')}
            className="bg-white text-blue-600 px-5 py-2 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            Add Patient
          </button>

          <button
            onClick={() => navigate('/doctors/new')}
            className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition"
          >
            Add Doctor
          </button>

          <button
            onClick={() => navigate('/appointments/new')}
            className="bg-white text-purple-600 px-5 py-2 rounded-xl font-semibold hover:bg-purple-50 transition"
          >
            Add Appointment
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {!error && (
        <>
          {/* Stats */}

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

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Appointments */}

            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Today's Appointments
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Scheduled consultations for today
                    </p>
                  </div>
                </div>

                {todaysAppointments.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-gray-500">
                      No appointments scheduled for today.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                            Patient
                          </th>

                          <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                            Doctor
                          </th>

                          <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                            Time
                          </th>

                          <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {todaysAppointments.map((a) => (
                          <tr
                            key={a.id}
                            onClick={() =>
                              navigate(`/appointments/${a.id}`)
                            }
                            className="border-b border-gray-100 hover:bg-blue-50 transition cursor-pointer"
                          >
                            <td className="px-4 py-4 font-medium">
                              {a.patientName}
                            </td>

                            <td className="px-4 py-4">
                              {a.doctorName}
                            </td>

                            <td className="px-4 py-4">
                              {a.time}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  a.status === 'scheduled'
                                    ? 'bg-green-100 text-green-700'
                                    : a.status === 'completed'
                                    ? 'bg-blue-100 text-blue-700'
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
            </div>

            {/* Recent Activity */}

            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Recent Activity
              </h2>

              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-green-50">
                  ✅ New patient registered
                </div>

                <div className="p-3 rounded-xl bg-blue-50">
                  🩺 Doctor profile updated
                </div>

                <div className="p-3 rounded-xl bg-purple-50">
                  📅 Appointment scheduled
                </div>

                <div className="p-3 rounded-xl bg-yellow-50">
                  🏥 Hospital records synchronized
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </Layout>
  );
}