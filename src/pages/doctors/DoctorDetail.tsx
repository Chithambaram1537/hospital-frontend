import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoctorById } from '../../services/doctorService';
import type { Doctor } from '../../types/doctor';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function DoctorDetail() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    getDoctorById(id)
      .then(setDoctor)
      .catch(() => setError('Could not load doctor'));
  }, [id]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Doctor Profile
        </h1>
        <p className="text-gray-500 mt-1">
          View doctor information, specialization and availability.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {doctor && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600 mb-4">
                {doctor.name.charAt(0)}
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {doctor.name}
              </h2>

              <p className="text-gray-500 text-sm">
                Doctor ID #{doctor.id}
              </p>

              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    doctor.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : doctor.status === 'on-leave'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {doctor.status}
                </span>
              </div>
            </div>
          </Card>

          {/* Information Card */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {doctor.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Specialty
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {doctor.specialty}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone Number
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {doctor.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email Address
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {doctor.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Experience
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {doctor.experience} Years
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Current Status
                  </p>
                  <p className="font-medium text-gray-900 mt-1 capitalize">
                    {doctor.status}
                  </p>
                </div>
              </div>
            </Card>

            <div className="mt-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Summary
                </h3>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-blue-600">
                      {doctor.experience}
                    </p>
                    <p className="text-xs text-gray-500">
                      Years Experience
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-lg font-bold text-green-600">
                      {doctor.specialty}
                    </p>
                    <p className="text-xs text-gray-500">
                      Specialty
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-lg font-bold text-purple-600 capitalize">
                      {doctor.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      Availability
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