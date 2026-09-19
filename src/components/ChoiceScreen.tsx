import React from 'react';
import { 
  Stethoscope, 
  FlaskConical, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  CreditCard, 
  Building2,
  CalendarCheck,
  CheckCircle2,
  Activity,
  HeartPulse
} from 'lucide-react';
import { FlowChoice } from '../types';

interface ChoiceScreenProps {
  onSelectChoice: (choice: 'doctor' | 'lab') => void;
  activeTokenCount: number;
  onViewTokens: () => void;
}

export const ChoiceScreen: React.FC<ChoiceScreenProps> = ({
  onSelectChoice,
  activeTokenCount,
  onViewTokens,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      
      {/* Hero Welcome Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>Unified Smart Healthcare & Diagnostic Gateway</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Skip Blind Waiting with <span className="text-cyan-600">MediFlow</span>
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Book verified specialist doctor consultations or diagnostic lab scans with real-time queue tokens, live equipment availability safeguards, and frictionless integrated payments.
        </p>

        {activeTokenCount > 0 && (
          <div className="pt-2">
            <button
              onClick={onViewTokens}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition"
            >
              <Users className="w-4 h-4" />
              <span>You have {activeTokenCount} Active Queue Pass(es) — View Live Progress</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Choice Cards: Doctor Appointment vs Lab Test */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
        
        {/* Card 1: Doctor Appointment */}
        <div 
          onClick={() => onSelectChoice('doctor')}
          className="group relative bg-white rounded-3xl border-2 border-slate-200/90 hover:border-cyan-500 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-300" />
          
          <div className="relative z-10 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Stethoscope className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] bg-cyan-100 text-cyan-800 font-bold px-2.5 py-0.5 rounded-full">
                  21 Specialties
                </span>
                <span className="text-xs font-semibold text-slate-400">• Verified Specialists</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 group-hover:text-cyan-600 transition-colors">
                Doctor Appointment
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Consult with verified specialists across top hospitals in your city. View doctor experience, real-time patients ahead, precise room numbers, and track your turn live.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>21 Medical Specialties (Cardio, Neuro, Ortho, Gynec & more)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>City & Hospital-wise Doctor discovery with room numbers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Live OPD Queue Token & Dynamic wait estimation</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 group-hover:text-cyan-700 transition-colors">
              5-Step Booking Flow
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-cyan-600 group-hover:translate-x-1 transition-transform">
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Card 2: Lab Test */}
        <div 
          onClick={() => onSelectChoice('lab')}
          className="group relative bg-white rounded-3xl border-2 border-slate-200/90 hover:border-emerald-500 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-300" />
          
          <div className="relative z-10 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <FlaskConical className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  Live Diagnostics
                </span>
                <span className="text-xs font-semibold text-slate-400">• Equipment Safeguard</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                Diagnostic Lab Test
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Book MRI, CT, X-Ray, Ultrasound, or Pathology panels with live operational checks. See machine status, sample acceptance cutoffs, and fail-safe safeguards.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>MRI 3.0T, 128-Slice CT, X-Ray, Blood panels & Ultrasound</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Live checklist: Equipment operational status, calibration & cutoffs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Status Safeguard: Instant refund & backup re-routing if machine fails</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-700 transition-colors">
              6-Step Booking Flow
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Book Lab Test</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

      </div>

      {/* Trust & Safeguard Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Real-time Queue Estimation</span>
            <span className="text-slate-400">Dynamically tracks patients ahead to prevent crowded waiting halls.</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Machine Safeguard Guarantee</span>
            <span className="text-slate-400">If equipment fails, auto-divert to backup facility or receive instant refund.</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Seamless Integrated Payments</span>
            <span className="text-slate-400">Secure UPI, Cards, and Netbanking with immediate token dispatch.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
