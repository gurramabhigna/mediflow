import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Wind, 
  ActivitySquare, 
  Sparkles, 
  Bone, 
  ScanFace, 
  Flame, 
  UtensilsCrossed, 
  Brain, 
  Ribbon, 
  Baby, 
  Droplets, 
  Eye, 
  Ear, 
  Dna, 
  ShieldAlert, 
  Stethoscope, 
  Footprints, 
  Scan, 
  Microscope, 
  ShieldCheck,
  Search,
  MapPin,
  Building2,
  Clock,
  ChevronRight,
  User,
  Star,
  DoorOpen,
  CreditCard,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { 
  MedicalSpecialty, 
  Hospital, 
  Doctor, 
  DoctorFlowStep, 
  DoctorAppointmentToken 
} from '../types';
import { CITIES } from '../data/mediflowData';
import { PaymentModal } from './PaymentModal';
import { TokenPassModal } from './TokenPassModal';
import { AISymptomSearchBar } from './AISymptomSearchBar';

// Icon mapper for 21 specialties
export const renderSpecialtyIcon = (iconName: string, className: string = 'w-6 h-6') => {
  switch (iconName) {
    case 'HeartPulse': return <HeartPulse className={className} />;
    case 'Wind': return <Wind className={className} />;
    case 'ActivitySquare': return <ActivitySquare className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Bone': return <Bone className={className} />;
    case 'ScanFace': return <ScanFace className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'UtensilsCrossed': return <UtensilsCrossed className={className} />;
    case 'Brain': return <Brain className={className} />;
    case 'Ribbon': return <Ribbon className={className} />;
    case 'Baby': return <Baby className={className} />;
    case 'Droplets': return <Droplets className={className} />;
    case 'Eye': return <Eye className={className} />;
    case 'Ear': return <Ear className={className} />;
    case 'Dna': return <Dna className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Stethoscope': return <Stethoscope className={className} />;
    case 'Footprints': return <Footprints className={className} />;
    case 'Scan': return <Scan className={className} />;
    case 'Microscope': return <Microscope className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    default: return <Stethoscope className={className} />;
  }
};

interface DoctorModuleProps {
  specialties: MedicalSpecialty[];
  hospitals: Hospital[];
  doctors: Doctor[];
  initialSpecialty?: MedicalSpecialty | null;
  initialDoctor?: Doctor | null;
  onBackToChoice: () => void;
  onTokenCreated: (token: DoctorAppointmentToken) => void;
}

export const DoctorModule: React.FC<DoctorModuleProps> = ({
  specialties,
  hospitals,
  doctors,
  initialSpecialty = null,
  initialDoctor = null,
  onBackToChoice,
  onTokenCreated,
}) => {
  // Navigation & Direct Route State
  const [isAiDirectRoute, setIsAiDirectRoute] = useState<boolean>(Boolean(initialSpecialty || initialDoctor));
  const [currentStep, setCurrentStep] = useState<DoctorFlowStep>(
    initialDoctor || initialSpecialty ? 'doctor' : 'specialty'
  );

  // Selections
  const [selectedSpecialty, setSelectedSpecialty] = useState<MedicalSpecialty | null>(
    initialSpecialty || (initialDoctor ? specialties.find(s => s.id === initialDoctor.specialtyId) || null : null)
  );
  const [selectedCity, setSelectedCity] = useState<string>('Hyderabad');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(initialDoctor);

  // Search queries
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [showAiSearch, setShowAiSearch] = useState(false);

  // Payment & Token Modals
  const [showPaymentModal, setShowPaymentModal] = useState(Boolean(initialDoctor));
  const [generatedToken, setGeneratedToken] = useState<DoctorAppointmentToken | null>(null);

  // Update when initialDoctor or initialSpecialty changes
  useEffect(() => {
    if (initialDoctor) {
      setSelectedDoctor(initialDoctor);
      const spec = specialties.find((s) => s.id === initialDoctor.specialtyId) || null;
      setSelectedSpecialty(spec);
      setIsAiDirectRoute(true);
      setCurrentStep('doctor');
      setShowPaymentModal(true);
    } else if (initialSpecialty) {
      setSelectedSpecialty(initialSpecialty);
      setIsAiDirectRoute(true);
      setSelectedHospital(null);
      setCurrentStep('doctor');
    }
  }, [initialDoctor, initialSpecialty, specialties]);

  // Filtered Specialties
  const filteredSpecialties = specialties.filter((s) =>
    s.name.toLowerCase().includes(specialtySearch.toLowerCase()) ||
    s.description.toLowerCase().includes(specialtySearch.toLowerCase()) ||
    s.commonConditions.some(c => c.toLowerCase().includes(specialtySearch.toLowerCase()))
  );

  // Filtered Hospitals in Selected City housing the selected specialty
  const filteredHospitals = hospitals.filter((h) => {
    const matchesCity = h.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSpecialty = selectedSpecialty 
      ? h.specialtiesOffered.includes(selectedSpecialty.id)
      : true;
    const matchesSearch = h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
      h.locality.toLowerCase().includes(hospitalSearch.toLowerCase());
    return matchesCity && matchesSpecialty && matchesSearch;
  });

  // Filtered Doctors in Selected Hospital and Specialty (or all hospitals in specialty when in AI direct route)
  const filteredDoctors = doctors.filter((d) => {
    const matchesHospital = selectedHospital ? d.hospitalId === selectedHospital.id : true;
    const matchesSpecialty = selectedSpecialty ? d.specialtyId === selectedSpecialty.id : true;
    return matchesHospital && matchesSpecialty;
  });

  // Flow handlers
  const handleSelectSpecialty = (spec: MedicalSpecialty, isAiDirect: boolean = false) => {
    setSelectedSpecialty(spec);
    if (isAiDirect) {
      setIsAiDirectRoute(true);
      setSelectedHospital(null);
      setCurrentStep('doctor');
    } else {
      setIsAiDirectRoute(false);
      setCurrentStep('hospital');
    }
  };

  const handleSelectHospital = (hosp: Hospital) => {
    setSelectedHospital(hosp);
    setCurrentStep('doctor');
  };

  const handleInitiateBooking = (doc: Doctor) => {
    setSelectedDoctor(doc);
    if (!selectedHospital) {
      const hosp = hospitals.find(h => h.id === doc.hospitalId) || hospitals[0];
      setSelectedHospital(hosp);
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (patientDetails: {
    name: string;
    phone: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    paymentMethod: 'upi' | 'card' | 'netbanking';
  }) => {
    if (!selectedDoctor) return;
    const hosp = selectedHospital || hospitals.find(h => h.id === selectedDoctor.hospitalId) || hospitals[0];

    try {
      const res = await fetch('/api/book-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          patientName: patientDetails.name,
          patientPhone: patientDetails.phone,
          patientAge: patientDetails.age,
          patientGender: patientDetails.gender,
          paymentMethod: patientDetails.paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        setShowPaymentModal(false);
        setGeneratedToken(data.token);
        setCurrentStep('token');
        onTokenCreated(data.token);
      }
    } catch (err) {
      console.error('Doctor booking error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Stepper Navigation Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentStep === 'specialty') onBackToChoice();
                else if (currentStep === 'hospital') setCurrentStep('specialty');
                else if (currentStep === 'doctor') {
                  if (isAiDirectRoute) {
                    if (initialSpecialty || initialDoctor) onBackToChoice();
                    else setCurrentStep('specialty');
                  } else {
                    setCurrentStep('hospital');
                  }
                }
                else if (currentStep === 'token') setCurrentStep('doctor');
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="Back to previous step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Doctor OPD
                </span>
                <span className="text-xs text-slate-500">Doctor Appointment Flow</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {currentStep === 'specialty' && 'Step 1: Choose Medical Specialty (21 Grid or AI Matcher)'}
                {currentStep === 'hospital' && `Step 2: Select Hospital in ${selectedCity}`}
                {currentStep === 'doctor' && (
                  isAiDirectRoute 
                    ? `Step 2 (AI Direct Route): Recommended Doctors for ${selectedSpecialty?.name || 'Selected Issue'}`
                    : `Step 3: Available Doctors at ${selectedHospital?.name || 'Selected Hospital'}`
                )}
                {currentStep === 'token' && (
                  isAiDirectRoute
                    ? 'Step 4: Digital OPD Queue Token Generated'
                    : 'Step 5: Digital OPD Queue Token Generated'
                )}
              </h2>
            </div>
          </div>

          {/* Stepper Dots */}
          {isAiDirectRoute ? (
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`px-2.5 py-1 rounded-lg font-bold ${currentStep === 'specialty' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                1. AI Symptom Match
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`px-2.5 py-1 rounded-lg font-bold ${currentStep === 'doctor' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                2. AI Direct Doctors
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`px-2.5 py-1 rounded-lg font-bold ${showPaymentModal ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                3. Pay
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`px-2.5 py-1 rounded-lg font-bold ${currentStep === 'token' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                4. Digital Token
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`px-2.5 py-1 rounded-lg font-bold ${currentStep === 'specialty' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                1. Specialty
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`px-2.5 py-1 rounded-lg font-bold ${currentStep === 'hospital' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                2. Hospital
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`px-2.5 py-1 rounded-lg font-bold ${currentStep === 'doctor' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                3. Doctor & Queue
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`px-2.5 py-1 rounded-lg font-bold ${currentStep === 'token' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                4/5. Pay & Token
              </span>
            </div>
          )}
        </div>
      </div>

      {/* STEP 1: Medical Specialties Grid (21 Specialties with exact icons) */}
      {currentStep === 'specialty' && (
        <div className="space-y-4">
          
          {/* AI Symptom Matcher Banner or Interactive Card */}
          <div className="bg-gradient-to-r from-slate-900 to-cyan-950 p-5 rounded-3xl text-white shadow-md border border-cyan-800/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Need Help Selecting a Specialist?
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Let our AI symptom matcher analyze your health condition and route you to the right medical department.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiSearch(!showAiSearch)}
                className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-xl transition cursor-pointer self-start sm:self-center shrink-0"
              >
                {showAiSearch ? 'Hide AI Matcher' : 'Use AI Symptom Matcher'}
              </button>
            </div>

            {showAiSearch && (
              <div className="pt-2 border-t border-cyan-800/60">
                <AISymptomSearchBar
                  compact
                  onRouteToSpecialty={(spec) => handleSelectSpecialty(spec, true)}
                  onSelectDoctor={(doc) => {
                    const spec = specialties.find((s) => s.id === doc.specialtyId) || null;
                    setSelectedSpecialty(spec);
                    setIsAiDirectRoute(true);
                    handleInitiateBooking(doc);
                  }}
                />
              </div>
            )}
          </div>

          {/* Controls: Search & City Selection */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={specialtySearch}
                onChange={(e) => setSpecialtySearch(e.target.value)}
                placeholder="Search specialty (e.g. Cardiologists, Neurologists, Orthopedists)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            {/* City selector */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-bold text-slate-700">City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-2 font-semibold focus:ring-2 focus:ring-cyan-500"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Specialties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredSpecialties.map((spec) => (
              <div
                key={spec.id}
                onClick={() => handleSelectSpecialty(spec)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-cyan-500 p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 group-hover:bg-cyan-600 text-cyan-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    {renderSpecialtyIcon(spec.iconName, 'w-5 h-5')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      {spec.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {spec.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Hospitals in {selectedCity}</span>
                  <span className="text-cyan-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* STEP 2: Hospital List in Chosen City housing that Doctor Category */}
      {currentStep === 'hospital' && selectedSpecialty && (
        <div className="space-y-4">
          
          {/* Active Context Banner */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center">
                {renderSpecialtyIcon(selectedSpecialty.iconName, 'w-5 h-5')}
              </div>
              <div>
                <span className="text-slate-500">Selected Specialty:</span>
                <h3 className="text-sm font-black text-slate-900">{selectedSpecialty.name} in {selectedCity}</h3>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('specialty')}
              className="text-xs text-cyan-700 hover:text-cyan-900 font-bold underline self-start sm:self-center"
            >
              Change Specialty / City
            </button>
          </div>

          {/* Hospitals List */}
          <div className="space-y-3">
            {filteredHospitals.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
                No hospitals found matching this specialty in {selectedCity}. Try selecting another city or specialty.
              </div>
            ) : (
              filteredHospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  onClick={() => handleSelectHospital(hosp)}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-cyan-500 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                        {hosp.type}
                      </span>
                      <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{hosp.rating}</span>
                      </span>
                      <span className="text-xs text-slate-400">• {hosp.locality}, {hosp.city}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      {hosp.name}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xl">
                      {hosp.address}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-cyan-600" />
                        <span>~{hosp.totalDoctors} Consultants</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Distance: {hosp.distanceKm} km</span>
                      </span>
                      {hosp.emergencyAvailable && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          24x7 Emergency Ready
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectHospital(hosp)}
                    className="self-start md:self-center bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 shrink-0"
                  >
                    <span>View Available Doctors</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* STEP 3 (or Step 2 in AI Direct Route): List of Available Doctors with Live Queue & Wait Time */}
      {currentStep === 'doctor' && selectedSpecialty && (
        <div className="space-y-4">
          
          {/* Selected Context */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
                {renderSpecialtyIcon(selectedSpecialty.iconName, 'w-5 h-5')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-cyan-100 text-cyan-800 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {isAiDirectRoute ? 'AI Direct Route' : 'Hospital OPD'}
                  </span>
                  {isAiDirectRoute && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Hospital Filter Skipped
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-black text-slate-900 mt-0.5">
                  Recommended Doctors for {selectedSpecialty.name}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  {selectedHospital 
                    ? `Practicing at ${selectedHospital.name} (${selectedHospital.locality}, ${selectedCity})`
                    : `Verified specialists across top hospitals in ${selectedCity}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {isAiDirectRoute ? (
                <button
                  onClick={() => {
                    setIsAiDirectRoute(false);
                    setCurrentStep('hospital');
                  }}
                  className="text-xs text-cyan-700 hover:text-cyan-900 font-bold bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200 transition cursor-pointer"
                >
                  Filter by Hospital
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep('hospital')}
                  className="text-xs text-cyan-700 hover:text-cyan-900 font-bold underline cursor-pointer"
                >
                  Change Hospital
                </button>
              )}
              <button
                onClick={() => setCurrentStep('specialty')}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                Change Specialty
              </button>
            </div>
          </div>

          {/* Doctors List */}
          <div className="space-y-4">
            {filteredDoctors.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
                No doctors currently listed for {selectedSpecialty.name} {selectedHospital ? `at ${selectedHospital.name}` : `in ${selectedCity}`}.
              </div>
            ) : (
              filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-13 h-13 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-lg shrink-0">
                        <User className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                            {doc.status}
                          </span>
                          <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{doc.rating}</span>
                            <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium">
                          {doc.qualification} • {doc.experienceYears} Years Experience
                        </p>

                        {/* Specific Hospital Name where doctor practices */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80 w-fit mt-1.5">
                          <Building2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span>{doc.hospitalName}</span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1.5 max-w-xl">
                          {doc.about}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-slate-400 text-xs block">Consultation Fee</span>
                      <span className="text-xl font-black text-slate-900">₹{doc.consultationFee}</span>
                    </div>
                  </div>

                  {/* Live Queue & Waiting Time Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Room Number:</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-0.5">
                        <DoorOpen className="w-4 h-4 text-cyan-600" />
                        <span className="text-cyan-800">Room {doc.roomNumber}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Patients Ahead Right Now:</span>
                      <span className="text-sm font-extrabold text-amber-700">
                        {doc.patientsBeforeYou} patient(s) waiting
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Approximate Waiting Time:</span>
                      <span className="text-sm font-extrabold text-emerald-700">
                        ~{doc.approxWaitMinutes} mins (Next slot ~{doc.nextSlotTime})
                      </span>
                    </div>
                  </div>

                  {/* Booking Trigger */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500">
                      Schedule: <strong className="text-slate-800">{doc.availableDays}</strong>
                    </span>
                    <button
                      onClick={() => handleInitiateBooking(doc)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Book & Proceed to Payment</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* STEP 5: Post-Payment Digital Token View */}
      {currentStep === 'token' && generatedToken && (
        <div className="max-w-2xl mx-auto">
          <TokenPassModal
            token={generatedToken}
            onClose={() => setCurrentStep('doctor')}
            onSimulateAdvance={() => {}}
          />
        </div>
      )}

      {/* STEP 4: Integrated Payment Modal */}
      {showPaymentModal && selectedDoctor && selectedHospital && (
        <PaymentModal
          title={`Doctor Appointment Consultation`}
          subTitle={`Consultation with ${selectedDoctor.name} (${selectedDoctor.specialtyName})`}
          facilityName={selectedHospital.name}
          amount={selectedDoctor.consultationFee}
          onClose={() => setShowPaymentModal(false)}
          onConfirmPayment={handlePaymentSuccess}
        />
      )}

    </div>
  );
};
