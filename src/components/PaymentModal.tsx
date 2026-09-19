import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  Building, 
  Lock, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface PaymentModalProps {
  title: string;
  subTitle: string;
  facilityName: string;
  amount: number;
  onClose: () => void;
  onConfirmPayment: (patientDetails: {
    name: string;
    phone: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    paymentMethod: 'upi' | 'card' | 'netbanking';
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  title,
  subTitle,
  facilityName,
  amount,
  onClose,
  onConfirmPayment,
}) => {
  const [patientName, setPatientName] = useState('Rahul Sharma');
  const [patientPhone, setPatientPhone] = useState('+91 98490 12345');
  const [patientAge, setPatientAge] = useState(32);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('rahul.sharma@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const tax = Math.round(amount * 0.05);
  const total = amount + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPayment({
        name: patientName,
        phone: patientPhone,
        age: patientAge,
        gender: patientGender,
        paymentMethod,
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Step 4: Secure Integrated Payment</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-slate-800">
          
          {/* Order Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-900 text-sm block">{subTitle}</span>
                <span className="text-slate-500">{facilityName}</span>
              </div>
              <span className="font-black text-slate-900 text-base">₹{amount}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-500">
              <span>Healthcare Platform Fee & GST (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="pt-1 flex justify-between font-black text-slate-900 text-sm border-t border-slate-200">
              <span>Total Payable Amount</span>
              <span className="text-cyan-700">₹{total}</span>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Patient Registration Information
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile (for SMS Turn Alerts)</label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Payment Method
            </h4>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'upi'
                    ? 'border-cyan-600 bg-cyan-50/70 text-cyan-900 font-bold shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-cyan-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'card'
                    ? 'border-cyan-600 bg-cyan-50/70 text-cyan-900 font-bold shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-cyan-600" />
                <span>Debit / Credit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'netbanking'
                    ? 'border-cyan-600 bg-cyan-50/70 text-cyan-900 font-bold shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Building className="w-4 h-4 text-cyan-600" />
                <span>Net Banking</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <label className="block font-semibold text-slate-700">Enter Virtual Payment Address (UPI ID)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@bank"
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block">Google Pay, PhonePe, Paytm, or BHIM supported</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-Bit Encrypted Payment. Instant Digital Token is issued immediately upon completion.</span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment & Issuing Queue Token...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{total} & Generate Digital Token</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
