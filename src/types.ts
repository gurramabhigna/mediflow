export type FlowChoice = 'choice' | 'doctor' | 'lab';

export type DoctorFlowStep = 
  | 'specialty'   // Step 1: Select medical specialty & city
  | 'hospital'    // Step 2: Select hospital in chosen city
  | 'doctor'      // Step 3: Select doctor & view live queue / wait time
  | 'payment'     // Step 4: Integrated payment step
  | 'token';      // Step 5: Post-payment digital token pass

export type LabFlowStep = 
  | 'test_type'   // Step 1: Select diagnostic test type (or launch camera prescription scanner)
  | 'camera_scan' // Step 2: Camera / AI Prescription Scanner
  | 'labs'        // Step 3: List nearby labs/hospitals offering test
  | 'checklist'   // Step 4: Hospital-specific test breakdown & live checklist
  | 'payment'     // Step 5: Integrated payment step
  | 'token';      // Step 6: Post-payment digital token pass

export interface MedicalSpecialty {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon identifier
  commonConditions: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  specialtyName: string;
  qualification: string;
  experienceYears: number;
  hospitalId: string;
  hospitalName: string;
  roomNumber: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  availableDays: string;
  status: 'In OPD' | 'On Call' | 'In Procedure' | 'Rounding';
  patientsBeforeYou: number;
  approxWaitMinutes: number;
  nextSlotTime: string;
  photoUrl?: string;
  about: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  address: string;
  locality: string;
  phone: string;
  rating: number;
  type: 'Super Specialty' | 'Multi Specialty' | 'Government Medical College' | 'Teaching Institute';
  specialtiesOffered: string[];
  totalDoctors: number;
  distanceKm: number;
  emergencyAvailable: boolean;
}

export interface DiagnosticTestCategory {
  id: string;
  name: string;
  category: 'Full Body & Preventive' | 'Cardiac Diagnostics' | 'Diabetes & Metabolic' | 'Advanced Imaging' | 'Infection & Pathology';
  description: string;
  iconName: string;
  includedTests: string[]; // List of specific tests included in this package
  subTests: string[];
  clinicalResults: string[]; // Specific clinical parameters/results the user will receive
  turnaroundTime: string;
  sampleRequired: string;
  preparationAdvice: string;
}

export interface LabFacility {
  id: string;
  name: string;
  branch: string;
  city: string;
  locality: string;
  address: string;
  phone: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  accreditation: 'NABL & CAP' | 'NABL Accredited' | 'Govt. Empanelled' | 'ISO Certified';
  supportedCategories: string[];
  pricing: Record<string, number>; // testId -> price
  // Step 3 Diagnostic Checklist details:
  checklist: {
    testOperationalNow: boolean;
    machineServiceAvailable: boolean;
    machineModel: string;
    machineLastCalibrated: string;
    patientsAhead: number;
    realWaitingTimeMinutes: number;
    willAcceptSamplesWhenArriving: boolean;
    sampleCutoffTime: string;
    safeguardPolicy: {
      actionIfMachineFails: string;
      backupMachineAvailable: boolean;
      instantRefundGuaranteed: boolean;
      autoDivertFacilityName: string;
      transportProvidedOrCompensated: boolean;
    };
  };
}

export interface PaymentDetails {
  method: 'upi' | 'card' | 'netbanking' | 'insurance';
  upiId?: string;
  cardNumber?: string;
  transactionId: string;
  amount: number;
  tax: number;
  total: number;
  status: 'pending' | 'completed' | 'failed';
  paidAt: string;
}

export interface DoctorAppointmentToken {
  id: string;
  type: 'doctor';
  tokenNumber: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  doctorId: string;
  doctorName: string;
  specialtyName: string;
  hospitalId: string;
  hospitalName: string;
  roomNumber: string;
  patientsBeforeThem: number;
  approxAppointmentTime: string;
  approxWaitMinutes: number;
  payment: PaymentDetails;
  status: 'Confirmed' | 'Approaching' | 'In Consultation' | 'Completed';
  generatedAt: string;
}

export interface LabBookingToken {
  id: string;
  type: 'lab';
  tokenNumber: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  testId: string;
  testName: string;
  labId: string;
  labName: string;
  labAddress: string;
  tokenCounter: string; // e.g. "Counter 3 / Scanner 2"
  patientsBeforeThem: number;
  approxTimeUntilTurn: string;
  approxWaitMinutes: number;
  payment: PaymentDetails;
  status: 'Confirmed' | 'Sample Collection / Scan Ready' | 'Processing' | 'Report Ready';
  safeguardProtectionActive: boolean;
  generatedAt: string;
}

export type AnyToken = DoctorAppointmentToken | LabBookingToken;
