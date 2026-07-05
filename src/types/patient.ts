export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  bloodGroup: string;
  address: string;
  status: 'admitted' | 'discharged' | 'outpatient';
  hospitalId?: number;
  registeredAt?: string;
  isActive?: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface PatientListResponse { patients: Patient[]; }
export interface PatientResponse { patient: Patient; }
export interface CreatePatientRequest {
  name: string; age: number; gender: 'male' | 'female' | 'other';
  phone: string; bloodGroup: string; address: string;
  status: 'admitted' | 'discharged' | 'outpatient';
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}