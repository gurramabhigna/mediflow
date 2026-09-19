import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Users, 
  DoorOpen, 
  Building2, 
  ShieldCheck, 
  FastForward, 
  Calendar, 
  Download, 
  Share2, 
  BellRing,
  Ticket
} from 'lucide-react';
import { AnyToken, DoctorAppointmentToken, LabBookingToken } from '../types';

interface TokenPassModalProps {
  token: AnyToken;
  onClose: () => void;
  onSimulateAdvance?: (tokenId: string) => void;
}

export const TokenPassModal: React.FC<TokenPassModalProps> = ({
  token,
  onClose,
  onSimulateAdvance,
}) => {
  const isDoctor = token.type === 'doctor';
  const docToken = isDoctor ? (token as DoctorAppointmentToken) : null;
  const labToken = !isDoctor ? (token as LabBookingToken) : null;

  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden space-y-0 text-slate-800 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className={`p-6 text-white ${isDoctor ? 'bg-gradient-to-r from-cyan-900 to-blue-950' : 'bg-gradient-to-r from-emerald-900 to-teal-950'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/20 text-white">
              {isDoctor ? 'Step 5: Verified Doctor OPD Token' : 'Step 6: Verified Diagnostic Lab Token'}
            </span>
            <span className="text-xs bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
              Live Active Pass
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Token Huge Display */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-white/70 block">Digital Token Identifier:</span>
            <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-0.5">
              #{token.tokenNumber}
            </h2>
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-medium text-white/70 block">Status:</span>
            <span className="text-sm font-black text-amber-300 bg-black/30 px-3 py-1 rounded-lg inline-block mt-0.5">
              {token.status}
            </span>
          </div>
        </div>
      </div>

      {/* Token Details Grid */}
      <div className="p-6 space-y-6">
        
        {/* Core Token Information Required */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Patients Before Them */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold uppercase tracking-wider">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Number of Patients Before You</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-900">
                {token.patientsBeforeThem}
              </span>
              <span className="text-xs font-semibold text-amber-700">
                {token.patientsBeforeThem === 0 ? 'You are being called now!' : 'Patients in OPD queue'}
              </span>
            </div>
          </div>

          {/* Approximate Appointment / Turn Time */}
          <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-cyan-800 font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 text-cyan-600" />
              <span>{isDoctor ? 'Approximate Appointment Time' : 'Approximate Time Until Turn'}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-900">
                {isDoctor ? docToken?.approxAppointmentTime : labToken?.approxTimeUntilTurn}
              </span>
              <span className="text-xs font-semibold text-cyan-700">
                (~{token.approxWaitMinutes} mins dynamic wait)
              </span>
            </div>
          </div>

          {/* Doctor's Specific Room Number (Module A Step 5) OR Lab Counter */}
          {isDoctor && docToken && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase tracking-wider">
                <DoorOpen className="w-4 h-4 text-emerald-600" />
                <span>Doctor's Specific Room Number & Consultation Suite</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-emerald-950">
                  {docToken.roomNumber}
                </span>
                <span className="text-xs text-emerald-700 font-semibold">
                  Consulting: {docToken.doctorName}
                </span>
              </div>
            </div>
          )}

          {!isDoctor && labToken && (
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl space-y-1 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-teal-800 font-bold uppercase tracking-wider">
                <DoorOpen className="w-4 h-4 text-teal-600" />
                <span>Designated Scanner Bay / Counter</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-teal-950">
                  {labToken.tokenCounter}
                </span>
                <span className="text-xs text-teal-700 font-semibold">
                  Test: {labToken.testName}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Patient & Facility Summary */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 block text-[10px]">Patient Name</span>
              <span className="font-bold text-slate-900">{token.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Age / Gender</span>
              <span className="font-bold text-slate-900">{token.patientAge} Yrs, {token.patientGender}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Facility</span>
              <span className="font-bold text-slate-900 truncate block">
                {isDoctor ? docToken?.hospitalName : labToken?.labName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Payment Status</span>
              <span className="font-bold text-emerald-700">₹{token.payment.total} Paid (Txn #{token.payment.transactionId.slice(-6)})</span>
            </div>
          </div>
        </div>

        {/* Real-time Queue Advance Simulation Feature */}
        {onSimulateAdvance && (
          <div className="bg-slate-950 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5" />
                <span>Simulate Live Queue Movement & Turn Call</span>
              </span>
              <p className="text-slate-400 text-[11px]">
                Click to simulate doctor completing a consultation (-1 patient ahead) to test real-time alerts.
              </p>
            </div>
            <button
              onClick={() => onSimulateAdvance(token.id)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Advance Queue</span>
            </button>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Valid token pass backed by MediFlow real-time clinic server</span>
        </div>
        <button
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl transition"
        >
          Done
        </button>
      </div>

    </div>
  );
};
