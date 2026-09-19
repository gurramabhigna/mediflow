import React, { useState } from 'react';
import { 
  Scan, 
  Cpu, 
  Bone, 
  Droplet, 
  Activity, 
  HeartPulse, 
  Eye, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  ArrowLeft,
  CalendarCheck,
  Building2,
  RefreshCw,
  ShieldAlert,
  FileText,
  BadgeCheck,
  Check,
  HelpCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { 
  DiagnosticTestCategory, 
  LabFacility, 
  LabFlowStep, 
  LabBookingToken 
} from '../types';
import { PaymentModal } from './PaymentModal';
import { TokenPassModal } from './TokenPassModal';
import { getHospitalLabPackage } from '../data/hospitalLabPackages';

export const renderTestCategoryIcon = (iconName: string, className: string = 'w-6 h-6') => {
  switch (iconName) {
    case 'Scan': return <Scan className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Bone': return <Bone className={className} />;
    case 'Droplet': return <Droplet className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'HeartPulse': return <HeartPulse className={className} />;
    case 'Eye': return <Eye className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    default: return <Activity className={className} />;
  }
};

interface LabModuleProps {
  testCategories: DiagnosticTestCategory[];
  labs: LabFacility[];
  onBackToChoice: () => void;
  onTokenCreated: (token: LabBookingToken) => void;
}

export const LabModule: React.FC<LabModuleProps> = ({
  testCategories,
  labs,
  onBackToChoice,
  onTokenCreated,
}) => {
  // Steps in Lab Flow
  const [currentStep, setCurrentStep] = useState<LabFlowStep>('test_type');

  // Selected State
  const [selectedCategory, setSelectedCategory] = useState<DiagnosticTestCategory | null>(null);
  const [selectedLab, setSelectedLab] = useState<LabFacility | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Payment & Token Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<LabBookingToken | null>(null);

  // Filtered categories
  const filteredCategories = testCategories.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.includedTests && t.includedTests.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    t.subTests.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filtered labs offering this test category
  const filteredLabs = labs.filter((l) => {
    if (!selectedCategory) return true;
    return l.supportedCategories.includes(selectedCategory.id);
  });

  const handleSelectCategory = (cat: DiagnosticTestCategory) => {
    setSelectedCategory(cat);
    setCurrentStep('labs');
  };

  const handleSelectLabForChecklist = (lab: LabFacility) => {
    setSelectedLab(lab);
    setCurrentStep('checklist');
  };

  const handleInitiatePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (patientDetails: {
    name: string;
    phone: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    paymentMethod: 'upi' | 'card' | 'netbanking';
  }) => {
    if (!selectedLab || !selectedCategory) return;

    try {
      const res = await fetch('/api/book-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labId: selectedLab.id,
          testId: selectedCategory.id,
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
      console.error('Lab booking error:', err);
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
                if (currentStep === 'test_type') onBackToChoice();
                else if (currentStep === 'labs') setCurrentStep('test_type');
                else if (currentStep === 'checklist') setCurrentStep('labs');
                else if (currentStep === 'token') setCurrentStep('checklist');
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="Back to previous step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Diagnostic Lab
                </span>
                <span className="text-xs text-slate-500">Diagnostic Lab Test Flow</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">
                {currentStep === 'test_type' && 'Step 1: Select Diagnostic Test Type'}
                {currentStep === 'labs' && 'Step 2: Choose Accredited Lab / Hospital Facility'}
                {currentStep === 'checklist' && 'Step 3: Hospital-Specific Package Breakdown & Live Checklist'}
                {currentStep === 'token' && 'Step 5: Verified Digital Token Pass & Queue Status'}
              </h2>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 overflow-x-auto py-1">
            <span className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${currentStep === 'test_type' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600'}`}>
              1. Test Type
            </span>
            <span>→</span>
            <span className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${currentStep === 'labs' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600'}`}>
              2. Choose Lab
            </span>
            <span>→</span>
            <span className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${currentStep === 'checklist' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600'}`}>
              3. Hospital Package & Checklist
            </span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-lg whitespace-nowrap bg-slate-100 text-slate-500">
              4. Payment
            </span>
            <span>→</span>
            <span className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${currentStep === 'token' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600'}`}>
              5. Digital Token
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: Categorized Diagnostic Test Types & Packages */}
      {currentStep === 'test_type' && (
        <div className="space-y-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages or tests (e.g. Full Body, Lipid, HbA1c, MRI, Dengue, CBC)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-500 self-end sm:self-center font-medium">
              Showing <strong className="text-slate-900">{filteredCategories.length}</strong> standardized diagnostic packages
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-emerald-500 p-5 shadow-2xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Top Badge & Icon */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                      {renderTestCategoryIcon(cat.iconName, 'w-6 h-6')}
                    </div>
                    <span className="text-[10px] bg-emerald-100/70 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {cat.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Clinical Diagnostic Focus */}
                  <div className="bg-slate-50 group-hover:bg-emerald-50/50 p-3 rounded-2xl border border-slate-200/80 group-hover:border-emerald-200 transition-colors space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Clinical Focus:</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-snug">
                      {cat.clinicalResults[0]}
                    </p>
                    <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Specimen Type:</span>
                      <strong className="text-slate-800 truncate max-w-[170px]">{cat.sampleRequired.split('(')[0]}</strong>
                    </div>
                  </div>

                  {/* Notice: Hospital Packages vary */}
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 text-[11px] text-emerald-950 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Hospital Packages Vary:</strong> Exact inclusions, test parameters, and equipment differ per facility. Select this category to choose your lab and view its customized package.
                    </span>
                  </div>

                  {/* Preparation Notes */}
                  <div className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-0.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{cat.preparationAdvice}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Turnaround: <strong className="text-slate-800">{cat.turnaroundTime.split('(')[0]}</strong>
                  </span>
                  <span className="bg-emerald-600 group-hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl shadow-2xs transition-transform group-hover:translate-x-0.5 flex items-center gap-1">
                    <span>Choose Lab & View Packages</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* STEP 2: Nearby Labs / Hospitals Offering Selected Test */}
      {currentStep === 'labs' && selectedCategory && (
        <div className="space-y-4">
          
          {/* Selected Package Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                {renderTestCategoryIcon(selectedCategory.iconName, 'w-6 h-6')}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-black px-2 py-0.5 rounded uppercase">
                    Step 1 Selected Package
                  </span>
                  <span className="text-slate-500">• {selectedCategory.sampleRequired}</span>
                </div>
                <h3 className="text-base font-black text-slate-900">{selectedCategory.name}</h3>
                <p className="text-slate-600 max-w-2xl text-xs">{selectedCategory.description}</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('test_type')}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline self-start md:self-center bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs cursor-pointer"
            >
              Change Test Package
            </button>
          </div>

          {/* List of Nearby Labs / Hospitals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Accredited Diagnostic Labs & Hospital Wings ({filteredLabs.length} Available Nearby)
              </h3>
            </div>

            {filteredLabs.map((lab) => {
              const testPrice = lab.pricing[selectedCategory.id] ?? 1200;
              const facilityPackage = getHospitalLabPackage(lab.id, selectedCategory.id, lab.name);
              return (
                <div
                  key={lab.id}
                  onClick={() => handleSelectLabForChecklist(lab)}
                  className="group bg-white rounded-3xl border border-slate-200 hover:border-emerald-500 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-md">
                        {lab.accreditation}
                      </span>
                      <span className="text-xs text-slate-400">• {lab.locality}, {lab.city}</span>
                      <span className="text-xs text-emerald-600 font-bold">~{lab.distanceKm} km away</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {lab.name}
                    </h3>

                    {/* Hospital-Specific Package Badge */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="text-xs bg-emerald-50 text-emerald-950 font-bold px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-sm">Package: {facilityPackage.packageName}</span>
                        <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-black">
                          {facilityPackage.parametersCount} Parameters
                        </span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 max-w-xl line-clamp-1">
                      {facilityPackage.tagline}
                    </p>

                    {/* Quick Metric Preview */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Operational Now</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-amber-700">
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        <span>{lab.checklist.patientsAhead} in queue ahead</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-cyan-700">
                        <Clock className="w-3.5 h-3.5 text-cyan-600" />
                        <span>~{lab.checklist.realWaitingTimeMinutes} mins wait</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Package Rate at this Lab</span>
                      <span className="text-xl font-black text-slate-900">
                        {testPrice === 0 ? 'Free (Govt. Arogyasri)' : `₹${testPrice}`}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectLabForChecklist(lab)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Hospital Package & Checklist</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* STEP 3: Hospital-Specific Package Breakdown & Live Checklist */}
      {currentStep === 'checklist' && selectedLab && selectedCategory && (() => {
        const hospitalPackage = getHospitalLabPackage(selectedLab.id, selectedCategory.id, selectedLab.name);
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Lab & Hospital Package Header */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2.5 py-0.5 rounded">
                    {hospitalPackage.highlightBadge}
                  </span>
                  <span className="text-xs text-slate-400">• {selectedLab.branch}</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedLab.name}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Category: <strong className="text-emerald-400">{selectedCategory.name}</strong> • Facility Package Formulation
                </p>
              </div>

              <div className="text-right shrink-0 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-400 block">Hospital Package Payable</span>
                <span className="text-2xl font-black text-white">
                  {selectedLab.pricing[selectedCategory.id] === 0 ? 'FREE (Govt. Arogyasri)' : `₹${selectedLab.pricing[selectedCategory.id]}`}
                </span>
                <span className="text-[10px] text-emerald-400 block font-medium mt-0.5">
                  Includes All {hospitalPackage.parametersCount} Parameters
                </span>
              </div>
            </div>

            {/* HOSPITAL SPECIFIC PACKAGE INCLUSIONS & BREAKDOWN */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
              
              {/* Package Title & Overview */}
              <div className="space-y-2 border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Hospital-Specific Package Formulation</span>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full border border-emerald-200">
                    {hospitalPackage.parametersCount} Total Parameters Included
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900">
                  {hospitalPackage.packageName}
                </h3>
                <p className="text-xs text-emerald-900 font-medium italic">
                  "{hospitalPackage.tagline}"
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {hospitalPackage.packageDescription}
                </p>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2 mt-2">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Why this varies:</strong> Diagnostic test packages vary across hospitals due to differing equipment generations, proprietary reagent panels, and clinical pathology sub-specializations. The parameters below reflect {selectedLab.name}’s exact accredited formulation.
                  </span>
                </div>
              </div>

              {/* Exact Parameter Breakdown by Group */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Exact Tests & Parameters Included at this Facility ({hospitalPackage.parametersCount} Items)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hospitalPackage.includedParameters.map((group, gIdx) => (
                    <div key={gIdx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                      <span className="text-xs font-bold text-slate-900 block border-b border-slate-200 pb-1.5">
                        {group.groupName}
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {group.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2">
                            <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="font-medium leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialized Imaging Hardware Details (if applicable) */}
              {hospitalPackage.imagingSpecifications && (
                <div className="bg-cyan-50/70 border border-cyan-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-900 font-bold text-xs uppercase tracking-wider">
                    <Cpu className="w-4 h-4 text-cyan-700" />
                    <span>Hardware & Contrast Protocol at {selectedLab.name}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-cyan-200/80">
                      <span className="text-slate-400 block text-[10px]">Scanner Technology</span>
                      <strong className="text-slate-900 font-bold block">{hospitalPackage.imagingSpecifications.scannerTechnology}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-cyan-200/80">
                      <span className="text-slate-400 block text-[10px]">Slice / Field Strength</span>
                      <strong className="text-slate-900 font-bold block">{hospitalPackage.imagingSpecifications.sliceOrFieldStrength}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-cyan-200/80">
                      <span className="text-slate-400 block text-[10px]">Contrast Media Protocol</span>
                      <strong className="text-slate-900 font-bold block">{hospitalPackage.imagingSpecifications.contrastIncluded}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-cyan-200/80">
                      <span className="text-slate-400 block text-[10px]">Radiology Sign-Off</span>
                      <strong className="text-slate-900 font-bold block">{hospitalPackage.imagingSpecifications.reportingRadiologist}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Consultation Inclusion & Special Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {hospitalPackage.clinicalConsultationIncluded && (
                  <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Doctor Review Included</span>
                    </span>
                    <p className="text-xs text-emerald-950 font-medium leading-snug">
                      {hospitalPackage.clinicalConsultationIncluded}
                    </p>
                  </div>
                )}

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Facility Safeguards & Perks</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hospitalPackage.specialLabPerks.map((perk, pIdx) => (
                      <span key={pIdx} className="text-[10px] bg-white text-slate-800 font-bold px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                        ✓ {perk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample, Turnaround & Preparation Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 space-y-0.5">
                  <span className="text-slate-500 block text-[10px]">Sample Specimen</span>
                  <strong className="text-emerald-950 font-bold block">{hospitalPackage.sampleRequirements}</strong>
                </div>
                <div className="bg-cyan-50/70 p-3.5 rounded-xl border border-cyan-100 space-y-0.5">
                  <span className="text-slate-500 block text-[10px]">Turnaround Time</span>
                  <strong className="text-cyan-950 font-bold block">{hospitalPackage.reportDeliveryHours}</strong>
                </div>
                <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-slate-500 block text-[10px]">Preparation Advice</span>
                  <strong className="text-slate-900 font-bold block">{hospitalPackage.fastingAndPrepInstructions}</strong>
                </div>
              </div>
            </div>

          {/* CLEAN, QUESTION-FREE LIVE CHECKLIST STATUS LAYOUT */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pre-Arrival Hardware & Operational Telemetry</span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Live Diagnostic Checklist Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time equipment telemetry and queue metrics confirmed directly from the diagnostic wing.
              </p>
            </div>

            {/* Clean Metric Cards - Question-Free Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Card 1: Diagnostic Operational Status */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase text-[10px] tracking-wider text-emerald-900">
                      Operational Status
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-lg font-black text-emerald-950 mt-1">
                    Operational Now
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Active verification: Power, helium levels, reagents, and test protocols ready.
                </p>
              </div>

              {/* Card 2: Machine & Service Availability */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase text-[10px] tracking-wider text-slate-700">
                      Equipment Calibration
                    </span>
                    <Cpu className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    Available & Calibrated
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 leading-snug space-y-0.5">
                  <span className="font-bold text-slate-800 block truncate">{selectedLab.checklist.machineModel}</span>
                  <span className="text-[10px] text-slate-500 block">QA: {selectedLab.checklist.machineLastCalibrated}</span>
                </div>
              </div>

              {/* Card 3: Queue Count */}
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase text-[10px] tracking-wider text-amber-900">
                      Live Holding Queue
                    </span>
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-lg font-black text-amber-950 mt-1 flex items-baseline gap-1.5">
                    <span>{selectedLab.checklist.patientsAhead}</span>
                    <span className="text-xs font-bold text-amber-800">Patients Ahead</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Patients currently waiting in lounge or prep bays for this department.
                </p>
              </div>

              {/* Card 4: Real-time Wait Time */}
              <div className="bg-cyan-50/70 border border-cyan-200 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase text-[10px] tracking-wider text-cyan-900">
                      Dynamic Waiting Time
                    </span>
                    <Clock className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-lg font-black text-cyan-950 mt-1 flex items-baseline gap-1.5">
                    <span>~{selectedLab.checklist.realWaitingTimeMinutes}</span>
                    <span className="text-xs font-bold text-cyan-800">Minutes Real Wait</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Calculated dynamically from live machine sequence and sample processing logs.
                </p>
              </div>

              {/* Card 5: Sample Acceptance Confirmation */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase text-[10px] tracking-wider text-emerald-900">
                      Sample Intake Confirmation
                    </span>
                    <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-lg font-black text-emerald-950 mt-1">
                    Confirmed Accepted
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Cutoff window: <strong className="text-slate-900">{selectedLab.checklist.sampleCutoffTime}</strong>.
                </p>
              </div>

              {/* Card 6: Zero-Risk Machine Safeguard */}
              <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase text-[10px] tracking-wider text-indigo-900">
                      Equipment Safeguard Policy
                    </span>
                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-lg font-black text-indigo-950 mt-1">
                    100% Protection Guaranteed
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Parallel backup scanner on-site or instant auto-divert with 100% money back guarantee.
                </p>
              </div>

            </div>

            {/* Safeguard Detail Banner */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Post-Travel Protection Commitment:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {selectedLab.checklist.safeguardPolicy.actionIfMachineFails} In the unlikely event of sudden hardware maintenance after you travel, priority access is reserved at <strong>{selectedLab.checklist.safeguardPolicy.autoDivertFacilityName}</strong>.
              </p>
            </div>

            {/* CTA Step 4: Proceed to Payment */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep('labs')}
                className="text-xs text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
              >
                ← Back to Nearby Facilities
              </button>

              <button
                onClick={handleInitiatePayment}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-8 py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Confirm & Proceed to Integrated Payment</span>
              </button>
            </div>

          </div>

        </div>
        );
      })()}

      {/* STEP 5: Digital Lab Token Pass */}
      {currentStep === 'token' && generatedToken && (
        <div className="max-w-2xl mx-auto">
          <TokenPassModal
            token={generatedToken}
            onClose={() => setCurrentStep('checklist')}
            onSimulateAdvance={() => {}}
          />
        </div>
      )}

      {/* STEP 4: Integrated Payment Modal */}
      {showPaymentModal && selectedLab && selectedCategory && (
        <PaymentModal
          title={`Diagnostic Test Package Booking`}
          subTitle={`${selectedCategory.name} package at ${selectedLab.name}`}
          facilityName={selectedLab.name}
          amount={selectedLab.pricing[selectedCategory.id] ?? 1200}
          onClose={() => setShowPaymentModal(false)}
          onConfirmPayment={handlePaymentSuccess}
        />
      )}

    </div>
  );
};
