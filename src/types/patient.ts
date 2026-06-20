export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  bloodGroup: string;
  address: string;
  status: 'admitted' | 'discharged' | 'outpatient';
  hospitalId: number;
}

export interface PatientListResponse {
  patients: Patient[];
}

export interface PatientResponse {
  patient: Patient;
}

export interface CreatePatientRequest {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  bloodGroup: string;
  address: string;
  status: 'admitted' | 'discharged' | 'outpatient';
}