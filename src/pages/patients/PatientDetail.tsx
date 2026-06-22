import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPatientById } from '../../services/patientService';
import type { Patient } from '../../types/patient';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function PatientDetail() {
  const { id } = useParams();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    getPatientById(id)
      .then(setPatient)
      .catch(() => setError('Could not load patient'));
  }, [id]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Patient Details
        </h1>
        <p className="text-gray-500 mt-1">
          View complete patient information and medical profile.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {patient && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
                {patient.name.charAt(0)}
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {patient.name}
              </h2>

              <p className="text-gray-500 text-sm">
                Patient ID #{patient.id}
              </p>

              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    patient.status === 'admitted'
                      ? 'bg-green-100 text-green-700'
                      : patient.status === 'discharged'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {patient.status}
                </span>
              </div>
            </div>
          </Card>

          {/* Details Card */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Patient Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {patient.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Age
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {patient.age} Years
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Gender
                  </p>
                  <p className="font-medium text-gray-900 mt-1 capitalize">
                    {patient.gender}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Blood Group
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {patient.bloodGroup}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone Number
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {patient.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>
                  <p className="font-medium text-gray-900 mt-1 capitalize">
                    {patient.status}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">
                    Address
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {patient.address}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </Layout>
  );
}