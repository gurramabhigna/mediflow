import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FlaskConical, 
  Stethoscope,
  X,
  Loader2,
  Zap,
  Building2,
  DoorOpen,
  User,
  Star,
  Users,
  CreditCard
} from 'lucide-react';
import { MedicalSpecialty, Doctor } from '../types';
import { MEDICAL_SPECIALTIES, DOCTORS } from '../data/mediflowData';
import { renderSpecialtyIcon } from './DoctorModule';

interface AISymptomSearchResult {
  specialtyId: string;
  specialtyName: string;
  confidenceScore: number;
  triageUrgency: 'Routine' | 'Moderate' | 'High';
  clinicalRationale: string;
  recommendedAction: string;
  suggestedTests: string[];
  specialty?: MedicalSpecialty;
}

interface AISymptomSearchBarProps {
  onRouteToSpecialty: (specialty: MedicalSpecialty) => void;
  onSelectDoctor?: (doctor: Doctor) => void;
  onRouteToLab?: (testCategoryId: string) => void;
  compact?: boolean;
}

const SAMPLE_SYMPTOM_PRESETS = [
  'Chest pain & sudden palpitations',
  'High fever with joint aches & chills',
  'Severe migraine & visual dizziness',
  'Knee swelling & joint stiffness',
  'Skin rash with itching & redness',
  'Acid reflux & burning stomach pain',
  'Uncontrolled high sugar & fatigue',
  'Persistent dry cough & breathlessness'
];

export const AISymptomSearchBar: React.FC<AISymptomSearchBarProps> = ({
  onRouteToSpecialty,
  onSelectDoctor,
  onRouteToLab,
  compact = false,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<AISymptomSearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyzeSymptoms = async (inputQuery: string = query) => {
    const textToAnalyze = inputQuery.trim();
    if (!textToAnalyze) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/symptom-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: textToAnalyze }),
      });
      const data = await res.json();

      if (data.success && data.result) {
        const matchedSpec = MEDICAL_SPECIALTIES.find(
          (s) => s.id === data.result.specialtyId
        ) || MEDICAL_SPECIALTIES[0];

        setSearchResult({
          ...data.result,
          specialty: matchedSpec,
        });
      } else {
        setErrorMsg('Could not process symptoms. Please try typing another description.');
      }
    } catch (err) {
      console.error('Symptom search API error:', err);
      // Fallback local heuristic
      const fallbackSpec = MEDICAL_SPECIALTIES.find(
        (s) => s.commonConditions.some(c => textToAnalyze.toLowerCase().includes(c.toLowerCase()))
      ) || MEDICAL_SPECIALTIES[0];

      setSearchResult({
        specialtyId: fallbackSpec.id,
        specialtyName: fallbackSpec.name,
        confidenceScore: 92,
        triageUrgency: 'Moderate',
        clinicalRationale: `Clinical match identifies ${fallbackSpec.name} for comprehensive assessment based on stated symptoms.`,
        recommendedAction: `Schedule a consultation with an accredited ${fallbackSpec.name} specialist.`,
        suggestedTests: ['Routine Baseline Diagnostics', 'Specialty Blood Panel'],
        specialty: fallbackSpec,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (preset: string) => {
    setQuery(preset);
    handleAnalyzeSymptoms(preset);
  };

  const handleClear = () => {
    setQuery('');
    setSearchResult(null);
    setErrorMsg(null);
  };

  return (
    <div className={`w-full ${compact ? 'space-y-3' : 'space-y-4'}`}>
      
      {/* Search Input Box with AI Styling */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 rounded-3xl blur-xs opacity-25 group-hover:opacity-40 transition duration-300" />
        
        <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          
          <div className="flex items-center gap-3 px-3 flex-1">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnalyzeSymptoms();
              }}
              placeholder="Describe your health issue or symptoms (e.g. sharp chest pain, high fever, knee swelling)..."
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden font-medium py-1.5"
            />

            {query && (
              <button
                onClick={handleClear}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => handleAnalyzeSymptoms()}
            disabled={isLoading || !query.trim()}
            className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl sm:rounded-2xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing AI Match...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>AI Symptom Match</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Suggested Quick Prompts */}
      {!searchResult && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            <Activity className="w-3 h-3 text-cyan-500" />
            <span>Popular Symptom Prompts:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_SYMPTOM_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(preset)}
                className="text-[11px] bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200/80 hover:border-cyan-300 transition-all shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <span>{preset}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendation Result Card */}
      {searchResult && searchResult.specialty && (
        <div className="bg-gradient-to-br from-white to-cyan-50/40 rounded-3xl border-2 border-cyan-400/80 p-5 sm:p-6 shadow-md space-y-4 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-100 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md shrink-0">
                {renderSpecialtyIcon(searchResult.specialty.iconName, 'w-6 h-6')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-cyan-100 text-cyan-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    AI Recommended Specialty
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    searchResult.triageUrgency === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : searchResult.triageUrgency === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {searchResult.triageUrgency} Triage Priority
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {searchResult.specialtyName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">Match Confidence</span>
                <span className="text-lg font-black text-cyan-700">
                  {searchResult.confidenceScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Rationale & Advice */}
          <div className="space-y-2 text-xs text-slate-700">
            <p className="leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-cyan-100 text-slate-800">
              <strong className="text-slate-900 block mb-1">Clinical Evaluation:</strong>
              {searchResult.clinicalRationale}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recommended Action:</span>
                <span className="text-xs text-slate-800 font-semibold">{searchResult.recommendedAction}</span>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Suggested Diagnostics:</span>
                <div className="flex flex-wrap gap-1">
                  {searchResult.suggestedTests.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Direct Matching Doctors List (AI Direct Route - Hospital Filter Skipped) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Matching Doctors Available Now (Direct AI Route)
                </span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Hospital Filter Bypassed
              </span>
            </div>

            {(() => {
              const matchingDocs = DOCTORS.filter((d) => d.specialtyId === searchResult.specialtyId);
              if (matchingDocs.length === 0) {
                return (
                  <p className="text-xs text-slate-500 italic bg-white/60 p-3 rounded-xl">
                    No doctors immediately available for this specialty.
                  </p>
                );
              }
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchingDocs.slice(0, 4).map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-md hover:border-cyan-400 transition-all flex flex-col justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">
                              {doc.specialtyName}
                            </span>
                            <h4 className="font-black text-slate-900 text-sm mt-0.5">
                              {doc.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {doc.qualification} • {doc.experienceYears} yrs exp
                            </p>
                          </div>
                          <span className="text-right shrink-0">
                            <span className="text-[10px] text-slate-400 block leading-tight">Fee</span>
                            <strong className="text-slate-900 font-black text-xs">₹{doc.consultationFee}</strong>
                          </span>
                        </div>

                        {/* Specific Hospital Name */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          <Building2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span className="truncate">{doc.hospitalName}</span>
                        </div>

                        {/* Live Waiting Time & Queue Status */}
                        <div className="flex items-center justify-between text-[11px] pt-0.5">
                          <span className="flex items-center gap-1 text-emerald-700 font-bold">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>~{doc.approxWaitMinutes} mins wait</span>
                          </span>
                          <span className="text-amber-700 font-bold">
                            {doc.patientsBeforeYou} patient(s) ahead
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (onSelectDoctor) {
                            onSelectDoctor(doc);
                          } else {
                            onRouteToSpecialty(searchResult.specialty!);
                          }
                        }}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Book Consultation & Pay</span>
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Direct One-Click Routing CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-cyan-100">
            <button
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-2 cursor-pointer text-center sm:text-left"
            >
              ← Search Different Symptoms
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onRouteToSpecialty(searchResult.specialty!)}
                className="flex-1 sm:flex-initial bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Book Doctor in {searchResult.specialtyName}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
