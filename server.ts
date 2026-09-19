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

// 7. AI Symptom Search & Medical Triage Engine
app.post('/api/ai/symptom-search', async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms || typeof symptoms !== 'string') {
    return res.status(400).json({ success: false, error: 'Symptoms description is required.' });
  }

  const query = symptoms.toLowerCase();

  // Intelligent clinical heuristic dictionary mapping for 21 specialties
  const specialtyRules: { id: string; keywords: string[]; name: string; action: string; tests: string[] }[] = [
    {
      id: 'cardiologist',
      name: 'Cardiologists',
      keywords: ['chest pain', 'heart', 'palpitation', 'angina', 'breathless', 'blood pressure', 'hypertension', 'arrhythmia', 'pulse', 'cholesterol', 'cardio'],
      action: 'Consult a Cardiologist for clinical evaluation and cardiovascular risk profiling.',
      tests: ['12-Lead ECG', 'Lipid Profile', 'Troponin-T', 'Echocardiogram']
    },
    {
      id: 'pulmonologist',
      name: 'Pulmonologists',
      keywords: ['cough', 'wheezing', 'asthma', 'lung', 'shortness of breath', 'phlegm', 'copd', 'bronchitis', 'sleep apnea', 'chest congestion'],
      action: 'Consult a Pulmonologist for spirometry, lung function testing, and respiratory management.',
      tests: ['Chest X-Ray / CT Thorax', 'Spirometry (PFT)', 'Blood Oxygen Evaluation']
    },
    {
      id: 'nephrologist',
      name: 'Nephrologists',
      keywords: ['kidney', 'creatinine', 'urea', 'urine protein', 'renal', 'swollen feet', 'dialysis', 'flank pain', 'edema'],
      action: 'Consult a Nephrologist for renal function assessment and glomerular filtration review.',
      tests: ['Kidney Function Test (KFT)', 'Urine Microalbumin', 'Renal Ultrasound']
    },
    {
      id: 'gynecologist',
      name: 'Gynecologists',
      keywords: ['period', 'menstrual', 'pregnancy', 'pcos', 'pelvic', 'ovary', 'uterus', 'vagina', 'fertility', 'cramps', 'bleeding'],
      action: 'Consult a Gynecologist for reproductive health examination and pelvic evaluation.',
      tests: ['Pelvic Ultrasound', 'Hormone Panel (FSH/LH/Prolactin)', 'Pap Smear']
    },
    {
      id: 'orthopedist',
      name: 'Orthopedists',
      keywords: ['bone', 'joint', 'knee', 'fracture', 'ligament', 'back pain', 'spine', 'shoulder', 'arthritis', 'sprain', 'hip', 'swollen knee'],
      action: 'Consult an Orthopedic Surgeon for musculoskeletal alignment and joint imaging.',
      tests: ['Digital X-Ray', 'MRI Joint Scan', 'Bone Mineral Density (DEXA)']
    },
    {
      id: 'dermatologist',
      name: 'Dermatologists',
      keywords: ['skin', 'rash', 'acne', 'itching', 'eczema', 'psoriasis', 'hair loss', 'scalp', 'dermatitis', 'fungal', 'pigmentation', 'mole'],
      action: 'Consult a Dermatologist for dermatoscopic evaluation and topical therapy.',
      tests: ['Skin Scraping for KOH', 'Allergy Patch Test', 'Biopsy Evaluation']
    },
    {
      id: 'endocrinologist',
      name: 'Endocrinologists',
      keywords: ['diabetes', 'sugar', 'thyroid', 'tsh', 'weight gain', 'weight loss', 'fatigue', 'hormone', 'hba1c', 'adrenal', 'hyperthyroid'],
      action: 'Consult an Endocrinologist for metabolic regulation and hormonal balance.',
      tests: ['HbA1c & Fasting Glucose', 'Complete Thyroid Profile (T3, T4, TSH)', 'Fasting Insulin']
    },
    {
      id: 'gastroenterologist',
      name: 'Gastroenterologists',
      keywords: ['stomach', 'acid', 'gerd', 'reflux', 'liver', 'fatty liver', 'jaundice', 'bloating', 'constipation', 'diarrhea', 'ibs', 'gut', 'ulcer'],
      action: 'Consult a Gastroenterologist for gastrointestinal tract and hepatology assessment.',
      tests: ['Liver Function Test (LFT)', 'Abdominal Ultrasound', 'Endoscopy']
    },
    {
      id: 'neurologist',
      name: 'Neurologists',
      keywords: ['headache', 'migraine', 'brain', 'seizure', 'epilepsy', 'numbness', 'tingling', 'tremor', 'stroke', 'dizziness', 'vertigo', 'parkinson'],
      action: 'Consult a Neurologist for comprehensive neuro-imaging and nerve conduction study.',
      tests: ['Brain MRI 3.0T', 'Electroencephalogram (EEG)', 'Carotid Doppler']
    },
    {
      id: 'oncologist',
      name: 'Oncologists',
      keywords: ['cancer', 'tumor', 'lump', 'biopsy', 'chemo', 'unexplained weight loss', 'malignancy', 'oncology', 'carcinoma'],
      action: 'Consult an Oncologist for specialized oncological screening and tissue diagnosis.',
      tests: ['PET-CT Whole Body Scan', 'Biopsy / Histopathology', 'Tumor Biomarkers']
    },
    {
      id: 'pediatrician',
      name: 'Pediatricians',
      keywords: ['child', 'baby', 'toddler', 'pediatric', 'vaccine', 'infant', 'milestone', 'growth', 'newborn', 'kids fever'],
      action: 'Consult a Pediatrician for pediatric growth assessment and illness resolution.',
      tests: ['Complete Blood Picture', 'Pediatric Wellness Panel', 'Vaccination Audit']
    },
    {
      id: 'urologist',
      name: 'Urologists',
      keywords: ['urine', 'burning urine', 'prostate', 'urinary', 'kidney stone', 'hematuria', 'bladder', 'difficulty urinating', 'bph'],
      action: 'Consult a Urologist for urinary tract endoscopy and renal calculus screening.',
      tests: ['Urine Routine & Culture', 'KUB Ultrasound', 'Serum PSA']
    },
    {
      id: 'ophthalmologist',
      name: 'Ophthalmologists',
      keywords: ['eye', 'vision', 'blur', 'cataract', 'glaucoma', 'retina', 'spectacles', 'red eye', 'eye pain', 'dry eye', 'squint'],
      action: 'Consult an Ophthalmologist for slit-lamp biomicroscopy and intraocular pressure check.',
      tests: ['Comprehensive Eye Exam', 'OCT Retina Scan', 'Visual Field Test']
    },
    {
      id: 'otolaryngologist',
      name: 'Otolaryngologists',
      keywords: ['ear', 'nose', 'throat', 'ent', 'sinus', 'tonsil', 'tinnitus', 'hearing loss', 'hoarseness', 'nasal blockage', 'earache', 'sore throat'],
      action: 'Consult an ENT Specialist for diagnostic endoscopy of upper airways and audiology.',
      tests: ['Pure Tone Audiometry', 'Diagnostic Nasal Endoscopy', 'CT Paranasal Sinuses']
    },
    {
      id: 'hematologist',
      name: 'Hematologists',
      keywords: ['anemia', 'platelet', 'blood clotting', 'bruising', 'bleeding gums', 'thalassemia', 'hemoglobin', 'white blood cells', 'leukemia', 'iron deficiency'],
      action: 'Consult a Hematologist for bone marrow biopsy and blood coagulation analysis.',
      tests: ['Complete Hemogram with Peripheral Smear', 'Iron Profile & Ferritin', 'Coagulation Profile (PT/INR)']
    },
    {
      id: 'rheumatologist',
      name: 'Rheumatologists',
      keywords: ['arthritis', 'rheumatoid', 'autoimmune', 'lupus', 'sle', 'joint stiffness', 'morning stiffness', 'swelling fingers', 'fibromyalgia'],
      action: 'Consult a Rheumatologist for autoimmune serology and targeted biologic evaluation.',
      tests: ['Rheumatoid Factor (RA/RF)', 'Anti-CCP Antibodies', 'ANA Profile by Immunofluorescence']
    },
    {
      id: 'general_practitioner',
      name: 'General Practitioner',
      keywords: ['fever', 'weakness', 'body ache', 'general', 'cold', 'flu', 'checkup', 'unwell', 'exhaustion', 'routine check'],
      action: 'Consult a General Practitioner for primary diagnostic triage and medical prescription.',
      tests: ['Complete Blood Picture (CBP)', 'Urine Routine', 'Serum Electrolytes']
    },
    {
      id: 'podiatrist',
      name: 'Podiatrist',
      keywords: ['foot', 'feet', 'heel pain', 'plantar fasciitis', 'toe', 'diabetic foot', 'corn', 'callus', 'flat foot', 'ankle pain'],
      action: 'Consult a Podiatrist for foot biomechanics assessment and wound management.',
      tests: ['Foot X-Ray Weight-Bearing', 'Diabetic Foot Neuropathy Doppler', 'Podiatric Gait Analysis']
    },
    {
      id: 'radiologist',
      name: 'Radiologist',
      keywords: ['xray', 'mri', 'ct scan', 'ultrasound', 'imaging', 'scan report', 'sonography', 'mammography', 'radiology'],
      action: 'Consult a Radiologist for second-opinion image review and protocolized imaging.',
      tests: ['MRI 3.0T High Resolution', '128-Slice CT Scan', 'Ultrasound Doppler']
    },
    {
      id: 'pathologist',
      name: 'Pathologist',
      keywords: ['biopsy', 'lab report', 'tissue analysis', 'histopathology', 'cytology', 'abnormal blood test', 'smear', 'pap smear'],
      action: 'Consult a Clinical Pathologist for cytology examination and specimen review.',
      tests: ['Histopathology Tissue Analysis', 'FNAC Biopsy', 'Automated Flow Cytometry']
    },
    {
      id: 'immunologist',
      name: 'Immunologist',
      keywords: ['allergy', 'anaphylaxis', 'food allergy', 'hives', 'immunodeficiency', 'recurrent infection', 'drug reaction', 'hay fever', 'immunology'],
      action: 'Consult an Immunologist for comprehensive allergen profiling and immunotherapy.',
      tests: ['Comprehensive Allergen Specific IgE', 'Immune Globulin Profile (IgG/IgA/IgM)', 'Skin Prick Testing']
    }
  ];

  // Try Gemini AI first if configured
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are a world-class clinical triage doctor and medical matcher.
Analyze this user's stated health symptoms: "${symptoms}".
You MUST select the SINGLE best matching medical specialty from this exact list of 21 specialties:
- Cardiologists (cardiologist)
- Pulmonologists (pulmonologist)
- Nephrologists (nephrologist)
- Gynecologists (gynecologist)
- Orthopedists (orthopedist)
- Dermatologists (dermatologist)
- Endocrinologists (endocrinologist)
- Gastroenterologists (gastroenterologist)
- Neurologists (neurologist)
- Oncologists (oncologist)
- Pediatricians (pediatrician)
- Urologists (urologist)
- Ophthalmologists (ophthalmologist)
- Otolaryngologists (otolaryngologist)
- Hematologists (hematologist)
- Rheumatologists (rheumatologist)
- General Practitioner (general_practitioner)
- Podiatrist (podiatrist)
- Radiologist (radiologist)
- Pathologist (pathologist)
- Immunologist (immunologist)

Respond ONLY with valid JSON in this exact structure:
{
  "specialtyId": "<exact id from above>",
  "specialtyName": "<exact name from above>",
  "confidenceScore": <integer 80-99>,
  "triageUrgency": "<Routine | Moderate | High>",
  "clinicalRationale": "<Concise 1-2 sentence clinical explanation of why these symptoms map to this specialty>",
  "recommendedAction": "<Concise 1 sentence recommendation on what to do next>",
  "suggestedTests": ["Test 1", "Test 2", "Test 3"]
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        const validSpecialty = MEDICAL_SPECIALTIES.find((s) => s.id === parsed.specialtyId);
        if (validSpecialty) {
          return res.json({
            success: true,
            source: 'gemini-ai',
            result: {
              ...parsed,
              specialty: validSpecialty,
            },
          });
        }
      }
    } catch (aiErr) {
      console.warn('Gemini symptom triage fallback to rule engine:', aiErr);
    }
  }

  // Robust Medical Heuristic Matcher
  let bestMatch = specialtyRules[0];
  let maxScore = 0;

  for (const rule of specialtyRules) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (query.includes(kw)) {
        score += kw.length > 5 ? 3 : 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = rule;
    }
  }

  // If no specific match, default to General Practitioner
  if (maxScore === 0) {
    bestMatch = specialtyRules.find((r) => r.id === 'general_practitioner') || specialtyRules[0];
  }

  const specialtyObj = MEDICAL_SPECIALTIES.find((s) => s.id === bestMatch.id) || MEDICAL_SPECIALTIES[0];
  const confidence = maxScore > 0 ? Math.min(97, 84 + maxScore * 3) : 82;
  const urgency = maxScore >= 6 ? 'High' : maxScore >= 3 ? 'Moderate' : 'Routine';

  res.json({
    success: true,
    source: 'clinical-triage-engine',
    result: {
      specialtyId: specialtyObj.id,
      specialtyName: specialtyObj.name,
      confidenceScore: confidence,
      triageUrgency: urgency,
      clinicalRationale: `Based on your reported symptoms (${symptoms.slice(0, 60)}...), our clinical matching protocol identifies ${specialtyObj.name} as the most accurate diagnostic authority for primary assessment.`,
      recommendedAction: bestMatch.action,
      suggestedTests: bestMatch.tests,
      specialty: specialtyObj,
    },
  });
});

// 8. AI Optical Prescription Scanner (OCR & Test Matcher)
app.post('/api/ai/ocr-prescription', async (req, res) => {
  const { samplePresetId, textHint, imageBase64 } = req.body;

  // Preset prescriptions for instant testing or when image simulated
  const presets: Record<string, {
    doctorName: string;
    clinicHospital: string;
    patientName: string;
    patientAgeGender: string;
    rxText: string;
    detectedCategoryId: string;
    matchedCategoryName: string;
    confidence: number;
    extractedParameters: string[];
    clinicalNotes: string;
    fastingRequired: boolean;
  }> = {
    cardiac: {
      doctorName: 'Dr. K. S. Somaraju, MD, DM (Cardiology)',
      clinicHospital: 'Care Hospital Heart Institute, Banjara Hills',
      patientName: 'Venkatesh Rao',
      patientAgeGender: 'Male, 52 yrs',
      rxText: 'Rx: Advised Comprehensive Cardiac Risk Profile: 1. Lipid Profile (Fasting 12h) 2. High-Sensitivity CRP (hs-CRP) 3. Resting 12-Lead ECG 4. Serum Troponin-T 5. Serum Homocysteine. Review in OPD with reports.',
      detectedCategoryId: 'cardiac_risk_panel',
      matchedCategoryName: 'Advanced Cardiac Risk Panel',
      confidence: 98.6,
      extractedParameters: [
        'Lipid Profile (Total, HDL, LDL, VLDL, Triglycerides)',
        'High-Sensitivity C-Reactive Protein (hs-CRP)',
        '12-Lead Resting ECG with ST-segment evaluation',
        'Serum Troponin-T (hs-cTnT)',
        'Serum Homocysteine (Vascular Thrombosis Marker)'
      ],
      clinicalNotes: 'Prescription explicitly mandates cardiac biomarker screen and resting 12-lead ECG before initiating statin titration.',
      fastingRequired: true,
    },
    full_body: {
      doctorName: 'Dr. Suresh Babu, MBBS, MD (Family Medicine)',
      clinicHospital: 'Apollo Health City, Jubilee Hills',
      patientName: 'Pooja Agarwal',
      patientAgeGender: 'Female, 38 yrs',
      rxText: 'Rx: Annual Health Checkup & Executive Blood Panel: Complete Blood Picture (CBP/ESR), Liver Function Test (LFT), Kidney Function Test (KFT), Fasting Lipid Profile, Thyroid TSH, Fasting Blood Sugar (FBS), Complete Urine Routine.',
      detectedCategoryId: 'full_body_checkup',
      matchedCategoryName: 'Full Body Health Checkup',
      confidence: 99.1,
      extractedParameters: [
        'Complete Blood Picture (CBP) with Automated Differential',
        'Liver Function Test (SGPT, SGOT, Bilirubin, Albumin)',
        'Kidney Function Test (Serum Creatinine, BUN, Uric Acid)',
        'Thyroid Profile (Ultrasensitive TSH)',
        'Fasting Blood Sugar & Lipid Profile',
        'Complete Urine Routine & Microscopy'
      ],
      clinicalNotes: 'Comprehensive 68-parameter full body wellness protocol with 10-12 hours overnight fasting.',
      fastingRequired: true,
    },
    diabetes: {
      doctorName: 'Dr. M. S. V. Prasad, MD, DM (Endocrinology)',
      clinicHospital: 'Yashoda Super Specialty Hospital',
      patientName: 'Mohd. Farooq',
      patientAgeGender: 'Male, 46 yrs',
      rxText: 'Rx: Diabetes Glycemic Evaluation: 1. HbA1c (HPLC) 2. Fasting Plasma Glucose (FBS) 3. Post-Prandial Glucose (PPBS - 2 hrs after meal) 4. Serum Fasting Insulin (HOMA-IR) 5. Spot Urine Microalbumin-to-Creatinine Ratio.',
      detectedCategoryId: 'diabetes_care_package',
      matchedCategoryName: 'Diabetes Care Package',
      confidence: 97.8,
      extractedParameters: [
        'HbA1c (Gold-standard HPLC method)',
        'Fasting Blood Sugar (FBS)',
        'Post-Prandial Blood Sugar (PPBS - 2hr Post Meal)',
        'Fasting Serum Insulin & HOMA-IR Calculation',
        'Spot Urine Microalbumin-to-Creatinine Ratio'
      ],
      clinicalNotes: 'Required dual blood draws (fasting + exactly 120 mins post-breakfast) to assess glycemic variability and renal micro-leakage.',
      fastingRequired: true,
    },
    scans: {
      doctorName: 'Dr. B. Chandra Sekhar, MD, DM (Neurology)',
      clinicHospital: 'NIMS Institute of Medical Sciences',
      patientName: 'Ramesh Naidu',
      patientAgeGender: 'Male, 44 yrs',
      rxText: 'Rx: Neuro-radiology Scan: MRI Brain & Lumbar Spine (3.0 Tesla Silent Scan) with Non-Ionic IV Contrast protocol. Rule out L4-L5 disc protrusion and radiculopathy. Cloud DICOM & Senior Radiologist sign-off required.',
      detectedCategoryId: 'advanced_imaging_scans',
      matchedCategoryName: 'Advanced Imaging Scans (MRI / CT / X-Ray)',
      confidence: 98.4,
      extractedParameters: [
        'Multi-sequence MRI Brain & Lumbar Spine (3.0T High-Field)',
        'Sub-millimeter Volumetric 3D Reconstructions',
        'IV Non-Ionic Contrast Perfusion',
        'Senior Radiologist Certified DICOM Reporting'
      ],
      clinicalNotes: 'High-resolution cross-sectional scan bay booking with 4-hour fasting prior to non-ionic contrast injection.',
      fastingRequired: true,
    },
    fever: {
      doctorName: 'Dr. P. V. Ramana, MD (Internal Medicine)',
      clinicHospital: 'Medicover Multi-Specialty Hospital',
      patientName: 'Kavitha Swaminathan',
      patientAgeGender: 'Female, 29 yrs',
      rxText: 'Rx: Acute Febrile Illness Emergency Workup: 1. Complete Blood Count (CBC) with Platelet Count 2. Dengue Combo (NS1 Antigen + IgG/IgM) 3. Malaria Rapid Antigen Card (Pv/Pf) 4. Quantitative Serum CRP 5. Widal Slide Test.',
      detectedCategoryId: 'fever_infection_panel',
      matchedCategoryName: 'Fever & Infection Panel',
      confidence: 99.4,
      extractedParameters: [
        'CBC with Serial Platelet Count & Hemocrit Monitoring',
        'Dengue NS1 Early Antigen + IgM/IgG Serology',
        'Rapid Malaria Antigen Detection (P. falciparum & P. vivax)',
        'Quantitative C-Reactive Protein (CRP)',
        'Widal Agglutination (Typhoid TO/TH)'
      ],
      clinicalNotes: 'Emergency turnaround requested (1-2 hrs) to rule out thrombocytopenia and acute infectious etiology. No fasting required.',
      fastingRequired: false,
    }
  };

  // Check if a preset was chosen or matched from textHint
  const selectedPresetKey = samplePresetId || (textHint && (
    textHint.includes('cardiac') || textHint.includes('heart') || textHint.includes('chest') ? 'cardiac' :
    textHint.includes('diabet') || textHint.includes('sugar') || textHint.includes('hba1c') ? 'diabetes' :
    textHint.includes('scan') || textHint.includes('mri') || textHint.includes('ct') ? 'scans' :
    textHint.includes('fever') || textHint.includes('dengue') || textHint.includes('malaria') ? 'fever' :
    'full_body'
  )) || 'full_body';

  const preset = presets[selectedPresetKey] || presets.full_body;
  const matchedCategory = DIAGNOSTIC_TEST_CATEGORIES.find((c) => c.id === preset.detectedCategoryId) || DIAGNOSTIC_TEST_CATEGORIES[0];

  res.json({
    success: true,
    data: {
      ...preset,
      categoryObj: matchedCategory,
      scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  });
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
