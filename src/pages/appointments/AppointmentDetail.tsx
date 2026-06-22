import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAppointmentById } from '../../services/appointmentService';
import type { Appointment } from '../../types/appointment';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function AppointmentDetail() {
  const { id } = useParams();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    getAppointmentById(id)
      .then(setAppointment)
      .catch(() => setError('Could not load appointment'));
  }, [id]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Appointment Details
        </h1>
        <p className="text-gray-500 mt-1">
          View appointment schedule and patient consultation information.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {appointment && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Card */}
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
                📅
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                Appointment #{appointment.id}
              </h2>

              <p className="text-gray-500 text-sm">
                Scheduled Consultation
              </p>

              <div className="mt-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    appointment.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-700'
                      : appointment.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            </div>
          </Card>

          {/* Main Information */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Appointment Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Patient Name
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {appointment.patientName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Doctor Name
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {appointment.doctorName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Appointment Date
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {appointment.date}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Appointment Time
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {appointment.time}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">
                    Consultation Reason
                  </p>

                  <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-900">
                      {appointment.reason}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>
                  <p className="font-medium text-gray-900 mt-1 capitalize">
                    {appointment.status}
                  </p>
                </div>
              </div>
            </Card>

            <div className="mt-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Appointment Summary
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">👨‍⚕️</div>
                    <p className="font-semibold text-gray-900">
                      Doctor
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {appointment.doctorName}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">🏥</div>
                    <p className="font-semibold text-gray-900">
                      Patient
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {appointment.patientName}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">⏰</div>
                    <p className="font-semibold text-gray-900">
                      Time
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.time}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}