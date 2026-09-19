import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { 
  MEDICAL_SPECIALTIES, 
  HOSPITALS, 
  DOCTORS, 
  DIAGNOSTIC_TEST_CATEGORIES, 
  LAB_FACILITIES, 
  CITIES 
} from './src/data/mediflowData';
import { 
  DoctorAppointmentToken, 
  LabBookingToken, 
  AnyToken,
  PaymentDetails 
} from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory active tokens store
const issuedTokens: AnyToken[] = [];

// Lazy load Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Gemini client initialization warning:', err);
    }
  }
  return aiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MediFlow',
    specialtiesCount: MEDICAL_SPECIALTIES.length,
    hospitalsCount: HOSPITALS.length,
    doctorsCount: DOCTORS.length,
    testCategoriesCount: DIAGNOSTIC_TEST_CATEGORIES.length,
    labsCount: LAB_FACILITIES.length,
    tokensCount: issuedTokens.length,
    timestamp: new Date().toISOString(),
  });
});

// 2. Master Data Endpoints
app.get('/api/cities', (req, res) => {
  res.json({ success: true, data: CITIES });
});

app.get('/api/specialties', (req, res) => {
  res.json({ success: true, data: MEDICAL_SPECIALTIES });
});

app.get('/api/hospitals', (req, res) => {
  const { city, specialtyId } = req.query;
  let list = [...HOSPITALS];

  if (city && city !== 'all') {
    list = list.filter((h) => h.city.toLowerCase() === String(city).toLowerCase());
  }

  if (specialtyId && specialtyId !== 'all') {
    list = list.filter((h) => h.specialtiesOffered.includes(String(specialtyId)));
  }

  res.json({ success: true, total: list.length, data: list });
});

app.get('/api/doctors', (req, res) => {
  const { hospitalId, specialtyId } = req.query;
  let list = [...DOCTORS];

  if (hospitalId) {
    list = list.filter((d) => d.hospitalId === String(hospitalId));
  }

  if (specialtyId && specialtyId !== 'all') {
    list = list.filter((d) => d.specialtyId === String(specialtyId));
  }

  res.json({ success: true, total: list.length, data: list });
});

app.get('/api/test-categories', (req, res) => {
  res.json({ success: true, data: DIAGNOSTIC_TEST_CATEGORIES });
});

app.get('/api/labs', (req, res) => {
  const { testId, city } = req.query;
  let list = [...LAB_FACILITIES];

  if (city && city !== 'all') {
    list = list.filter((l) => l.city.toLowerCase() === String(city).toLowerCase());
  }

  if (testId && testId !== 'all') {
    list = list.filter((l) => l.supportedCategories.includes(String(testId)));
  }

  res.json({ success: true, total: list.length, data: list });
});

// 3. Process Doctor Appointment Booking & Payment
app.post('/api/book-doctor', (req, res) => {
  const { 
    doctorId, 
    patientName, 
    patientPhone, 
    patientAge, 
    patientGender, 
    paymentMethod 
  } = req.body;

  const doctor = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
  const hospital = HOSPITALS.find((h) => h.id === doctor.hospitalId) || HOSPITALS[0];

  const now = new Date();
  const waitMins = doctor.approxWaitMinutes;
  const apptDate = new Date(now.getTime() + waitMins * 60000);
  const approxAppointmentTime = apptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const tokenNumber = `DOC-${doctor.specialtyId.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const txnId = `TXN-MED-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const payment: PaymentDetails = {
    method: paymentMethod || 'upi',
    transactionId: txnId,
    amount: doctor.consultationFee,
    tax: Math.round(doctor.consultationFee * 0.05),
    total: Math.round(doctor.consultationFee * 1.05),
    status: 'completed',
    paidAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const token: DoctorAppointmentToken = {
    id: `token-${Date.now()}`,
    type: 'doctor',
    tokenNumber,
    patientName: patientName || 'Patient',
    patientPhone: patientPhone || '+91 98490 12345',
    patientAge: Number(patientAge) || 32,
    patientGender: patientGender || 'Male',
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialtyName: doctor.specialtyName,
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    roomNumber: doctor.roomNumber,
    patientsBeforeThem: doctor.patientsBeforeYou,
    approxAppointmentTime,
    approxWaitMinutes: waitMins,
    payment,
    status: doctor.patientsBeforeYou <= 1 ? 'Approaching' : 'Confirmed',
    generatedAt: now.toLocaleString(),
  };

  // Update in-memory doctor queue state
  doctor.patientsBeforeYou += 1;
  issuedTokens.push(token);

  res.json({
    success: true,
    token,
  });
});

// 4. Process Lab Test Booking & Payment
app.post('/api/book-lab', (req, res) => {
  const { 
    labId, 
    testId, 
    patientName, 
    patientPhone, 
    patientAge, 
    patientGender, 
    paymentMethod 
  } = req.body;

  const lab = LAB_FACILITIES.find((l) => l.id === labId) || LAB_FACILITIES[0];
  const testCat = DIAGNOSTIC_TEST_CATEGORIES.find((t) => t.id === testId) || DIAGNOSTIC_TEST_CATEGORIES[0];

  const basePrice = lab.pricing[testCat.id] ?? 1200;
  const now = new Date();
  const waitMins = lab.checklist.realWaitingTimeMinutes;
  const turnDate = new Date(now.getTime() + waitMins * 60000);
  const approxTimeUntilTurn = turnDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const tokenNumber = `LAB-${testCat.name.slice(0, 3).toUpperCase()}-${Math.floor(200 + Math.random() * 800)}`;
  const txnId = `TXN-LAB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const payment: PaymentDetails = {
    method: paymentMethod || 'upi',
    transactionId: txnId,
    amount: basePrice,
    tax: Math.round(basePrice * 0.05),
    total: Math.round(basePrice * 1.05),
    status: 'completed',
    paidAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const token: LabBookingToken = {
    id: `token-${Date.now()}`,
    type: 'lab',
    tokenNumber,
    patientName: patientName || 'Patient',
    patientPhone: patientPhone || '+91 98490 12345',
    patientAge: Number(patientAge) || 35,
    patientGender: patientGender || 'Female',
    testId: testCat.id,
    testName: testCat.name,
    labId: lab.id,
    labName: lab.name,
    labAddress: `${lab.branch}, ${lab.locality}, ${lab.city}`,
    tokenCounter: testCat.category === 'Advanced Imaging' ? 'Scanner Bay 2 / Radiology Suite' : 'Phlebotomy Sample Counter 4',
    patientsBeforeThem: lab.checklist.patientsAhead,
    approxTimeUntilTurn,
    approxWaitMinutes: waitMins,
    payment,
    status: 'Confirmed',
    safeguardProtectionActive: true,
    generatedAt: now.toLocaleString(),
  };

  lab.checklist.patientsAhead += 1;
  issuedTokens.push(token);

  res.json({
    success: true,
    token,
  });
});

// 5. Dynamic Queue Advance Simulation (Real-time turn progression)
app.post('/api/queue/advance-token', (req, res) => {
  const { tokenId } = req.body;
  const token = issuedTokens.find((t) => t.id === tokenId);

  if (!token) {
    return res.status(404).json({ success: false, error: 'Token not found' });
  }

  if (token.patientsBeforeThem > 0) {
    token.patientsBeforeThem -= 1;
    token.approxWaitMinutes = Math.max(5, token.approxWaitMinutes - 10);
  }

  let alertMessage = '';
  if (token.type === 'doctor') {
    if (token.patientsBeforeThem === 0) {
      token.status = 'In Consultation';
      alertMessage = `PLEASE PROCEED: Dr. ${token.doctorName} is ready to see you now in ${token.roomNumber}!`;
    } else if (token.patientsBeforeThem === 1) {
      token.status = 'Approaching';
      alertMessage = `TURN APPROACHING: Only 1 patient remains ahead. Please be seated outside ${token.roomNumber}.`;
    }
  } else {
    if (token.patientsBeforeThem === 0) {
      token.status = 'Sample Collection / Scan Ready';
      alertMessage = `YOUR TURN: Token #${token.tokenNumber} please proceed to ${token.tokenCounter}!`;
    } else if (token.patientsBeforeThem === 1) {
      token.status = 'Confirmed';
      alertMessage = `TURN APPROACHING: 1 patient ahead for ${token.testName} at ${token.labName}.`;
    }
  }

  res.json({
    success: true,
    token,
    alertMessage,
  });
});

// 6. Get All User Tokens
app.get('/api/tokens', (req, res) => {
  res.json({ success: true, data: issuedTokens });
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediFlow unified server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
