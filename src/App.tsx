import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  FlaskConical, 
  ShieldCheck, 
  BellRing, 
  Ticket, 
  Home, 
  MapPin, 
  Calendar, 
  Sparkles,
  CheckCircle2,
  Users
} from 'lucide-react';
import { 
  FlowChoice, 
  MedicalSpecialty, 
  Hospital, 
  Doctor, 
  DiagnosticTestCategory, 
  LabFacility, 
  AnyToken,
  DoctorAppointmentToken,
  LabBookingToken
} from './types';
import { 
  MEDICAL_SPECIALTIES, 
  HOSPITALS, 
  DOCTORS, 
  DIAGNOSTIC_TEST_CATEGORIES, 
  LAB_FACILITIES,
  CITIES
} from './data/mediflowData';
import { ChoiceScreen } from './components/ChoiceScreen';
import { DoctorModule } from './components/DoctorModule';
import { LabModule } from './components/LabModule';
import { TokenPassModal } from './components/TokenPassModal';

export default function App() {
  // Main Choice Flow: 'choice' (Opening Screen) | 'doctor' (Module A) | 'lab' (Module B)
  const [currentChoice, setCurrentChoice] = useState<FlowChoice>('choice');
  const [routedSpecialty, setRoutedSpecialty] = useState<MedicalSpecialty | null>(null);
  const [routedDoctor, setRoutedDoctor] = useState<Doctor | null>(null);

  // Master Data
  const [specialties] = useState<MedicalSpecialty[]>(MEDICAL_SPECIALTIES);
  const [hospitals] = useState<Hospital[]>(HOSPITALS);
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS);
  const [testCategories] = useState<DiagnosticTestCategory[]>(DIAGNOSTIC_TEST_CATEGORIES);
  const [labs, setLabs] = useState<LabFacility[]>(LAB_FACILITIES);

  // Active Tokens List
  const [userTokens, setUserTokens] = useState<AnyToken[]>([]);
  const [selectedViewingToken, setSelectedViewingToken] = useState<AnyToken | null>(null);

  // Real-time Toast Notifications
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    message: string;
    type: 'success' | 'alert';
  } | null>(null);

  // Advance queue simulation
  const handleAdvanceQueue = async (tokenId: string) => {
    try {
      const res = await fetch('/api/queue/advance-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setUserTokens((prev) =>
          prev.map((t) => (t.id === data.token.id ? data.token : t))
        );
        if (selectedViewingToken && selectedViewingToken.id === data.token.id) {
          setSelectedViewingToken(data.token);
        }
        if (data.alertMessage) {
          setToastNotification({
            title: 'Live Queue Alert',
            message: data.alertMessage,
            type: 'alert',
          });
        } else {
          setToastNotification({
            title: 'Queue Updated',
            message: `Queue advanced by 1 patient. You are now behind ${data.token.patientsBeforeThem} patient(s).`,
            type: 'success',
          });
        }
      }
    } catch (err) {
      console.error('Advance error:', err);
    }
  };

  const handleTokenCreated = (token: AnyToken) => {
    setUserTokens((prev) => [token, ...prev]);
    setSelectedViewingToken(token);
    setToastNotification({
      title: 'Digital Token Issued!',
      message: `Token #${token.tokenNumber} confirmed. Real-time dynamic queue is tracking your position.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo & Switcher */}
          <div 
            onClick={() => setCurrentChoice('choice')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
                  MediFlow
                </span>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Queue
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none">
                Doctor Appointments & Diagnostic Lab Gateway
              </p>
            </div>
          </div>

          {/* Nav Mode Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentChoice('choice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentChoice === 'choice'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              onClick={() => setCurrentChoice('doctor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentChoice === 'doctor'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 hover:bg-cyan-50 text-slate-700'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-cyan-500" />
              <span>Doctor Appointment</span>
            </button>

            <button
              onClick={() => setCurrentChoice('lab')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentChoice === 'lab'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
              <span>Lab Test</span>
            </button>

            {/* Token Badge */}
            {userTokens.length > 0 && (
              <button
                onClick={() => setSelectedViewingToken(userTokens[0])}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tokens ({userTokens.length})</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Floating Alert Notification */}
      {toastNotification && (
        <div className={`fixed bottom-6 right-6 z-50 max-w-md text-white px-5 py-4 rounded-2xl shadow-2xl border flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300 ${
          toastNotification.type === 'alert'
            ? 'bg-amber-950 border-amber-500 text-amber-100 ring-2 ring-amber-400'
            : 'bg-slate-900 border-cyan-500 text-slate-100'
        }`}>
          {toastNotification.type === 'alert' ? (
            <BellRing className="w-5 h-5 text-amber-400 shrink-0 animate-bounce mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <span className="font-black text-sm block tracking-tight text-white">
              {toastNotification.title}
            </span>
            <p className="leading-relaxed text-slate-200">
              {toastNotification.message}
            </p>
            <button
              onClick={() => setToastNotification(null)}
              className="text-[11px] underline text-cyan-300 hover:text-white pt-1 block"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Flow Rendering */}
      <main className="flex-1">
        {/* 1. Opening Screen / Choice */}
        {currentChoice === 'choice' && (
          <ChoiceScreen
            onSelectChoice={(choice) => {
              setRoutedSpecialty(null);
              setRoutedDoctor(null);
              setCurrentChoice(choice);
            }}
            onRouteToSpecialty={(spec) => {
              setRoutedSpecialty(spec);
              setRoutedDoctor(null);
              setCurrentChoice('doctor');
            }}
            onSelectDoctor={(doc) => {
              setRoutedDoctor(doc);
              const spec = specialties.find((s) => s.id === doc.specialtyId) || null;
              setRoutedSpecialty(spec);
              setCurrentChoice('doctor');
            }}
            onLaunchLabScan={() => {
              setCurrentChoice('lab');
            }}
            activeTokenCount={userTokens.length}
            onViewTokens={() => {
              if (userTokens.length > 0) setSelectedViewingToken(userTokens[0]);
            }}
          />
        )}

        {/* 2. Module A: Doctor Appointment Flow */}
        {currentChoice === 'doctor' && (
          <DoctorModule
            specialties={specialties}
            hospitals={hospitals}
            doctors={doctors}
            initialSpecialty={routedSpecialty}
            initialDoctor={routedDoctor}
            onBackToChoice={() => {
              setRoutedSpecialty(null);
              setRoutedDoctor(null);
              setCurrentChoice('choice');
            }}
            onTokenCreated={handleTokenCreated}
          />
        )}

        {/* 3. Module B: Lab Test Flow */}
        {currentChoice === 'lab' && (
          <LabModule
            testCategories={testCategories}
            labs={labs}
            onBackToChoice={() => setCurrentChoice('choice')}
            onTokenCreated={handleTokenCreated}
          />
        )}
      </main>

      {/* Modal View for Token Pass (Triggered when user clicks Tokens button or after booking) */}
      {selectedViewingToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <TokenPassModal
              token={selectedViewingToken}
              onClose={() => setSelectedViewingToken(null)}
              onSimulateAdvance={handleAdvanceQueue}
            />
          </div>
        </div>
      )}

      {/* App Footer */}
      <footer className="mt-12 bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">MediFlow</span>
            <span>•</span>
            <span>Real-time OPD & Diagnostic Queue Management</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>21 Medical Specialties</span>
            <span>•</span>
            <span>Live Machine Status Safeguard</span>
            <span>•</span>
            <span>Zero Blind Waiting Guarantee</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
