import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
  'Dermatology', 'Ophthalmology', 'Gynecology', 'General Practice',
];

const PremiumInput = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2 group/input">
    <label className="text-[10px] font-black text-[#6c7a71] uppercase tracking-[0.15em] px-2">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a0a3a5] group-focus-within/input:text-[#006c49] transition-colors duration-300">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-14 pr-6 py-4 rounded-[20px] bg-[#f0f4f8] border-2 border-transparent 
                   text-[#171c1f] text-sm font-semibold outline-none transition-all duration-300
                   focus:bg-white focus:border-[#dbe1ff] focus:ring-8 focus:ring-[#f0fdf4]"
      />
    </div>
  </div>
);

const AddDoctorModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [form, setForm] = useState({
    name: "", email: "", contact: "", specialization: "", experience: "", fee: 0, availability: true
  });

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(modalRef.current, { y: 40, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.3, onComplete: onClose });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[#0f171f]/60 backdrop-blur-xl"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden"
      >
        <div className="bg-[#f6fafe] px-10 py-8 border-b border-white/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-[#171c1f] tracking-tight">Register Professional</h2>
            <p className="text-[#6c7a71] text-xs font-bold uppercase tracking-widest mt-1">Lumina Clinical Onboarding</p>
          </div>
          <button onClick={handleClose} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#a0a3a5] hover:text-[#ba1a1a] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          <div className="grid grid-cols-2 gap-6 mb-10">
            <PremiumInput
              label="Full Name"
              placeholder="Dr. Julian Vane"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
            <PremiumInput
              label="Email Address"
              type="email"
              placeholder="vane@lumina.health"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />

            <div className="flex flex-col gap-2 group/input">
              <label className="text-[10px] font-black text-[#6c7a71] uppercase tracking-[0.15em] px-2">Clinical Specialization</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a0a3a5] group-focus-within/input:text-[#006c49]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.183.244l-.28.19a2 2 0 00-.597 2.383l1.5 3A2 2 0 007.28 22h9.44a2 2 0 001.79-1.112l1.5-3a2 2 0 00-.597-2.383l-.28-.19z" /></svg>
                </div>
                <select
                  value={form.specialization}
                  onChange={e => setForm({ ...form, specialization: e.target.value })}
                  className="w-full pl-14 pr-10 py-4 rounded-[20px] bg-[#f0f4f8] border-2 border-transparent 
                             text-[#171c1f] text-sm font-semibold outline-none appearance-none cursor-pointer
                             focus:bg-white focus:border-[#dbe1ff] transition-all duration-300"
                >
                  <option value="">Select Department</option>
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a0a3a5] pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <PremiumInput
              label="Contact Number"
              placeholder="+91 98765 43210"
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
            />

            <PremiumInput
              label="Experience"
              placeholder="e.g. 12 Years"
              value={form.experience}
              onChange={e => setForm({ ...form, experience: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <PremiumInput
              label="Consultation Fee"
              placeholder="₹ 800"
              type="number"
              value={form.fee}
              onChange={e => setForm({ ...form, fee: e.target.value })}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 1 0 4 0z" /></svg>}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-5 rounded-[24px] bg-[#f0f4f8] text-[#6c7a71] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all duration-300"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-2 py-5 rounded-[24px] bg-linear-to-r from-[#006c49] to-[#10b981] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100/50 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Synchronizing...' : 'Finalize Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
