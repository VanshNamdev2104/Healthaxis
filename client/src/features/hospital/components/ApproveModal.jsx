import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Calendar, Clock, X, Check } from 'lucide-react';

const ApproveModal = ({ isOpen, onClose, onSubmit, appointment }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [form, setForm] = useState({
    date: "",
    time: ""
  });

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    // If it's already in yyyy-MM-dd, return it
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    // If it's DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      // Ensure day and month are 2 digits
      const d = day.padStart(2, '0');
      const m = month.padStart(2, '0');
      return `${year}-${m}-${d}`;
    }
    
    return "";
  };

  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return "";
    // If it's already in HH:mm, return it
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    
    // Handle "4 AM", "10:30 PM" etc.
    const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (match) {
      let [_, hours, minutes = "00", modifier] = match;
      hours = parseInt(hours);
      if (modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
      if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }
    
    return "";
  };

  useEffect(() => {
    if (isOpen) {
      // Set values from appointment if available, else empty to force user selection
      setForm({
        date: appointment?.date ? formatDateForInput(appointment.date) : "",
        time: appointment?.time ? formatTimeForInput(appointment.time) : ""
      });

      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(modalRef.current, { y: 40, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
    }
  }, [isOpen, appointment]);

  if (!isOpen) return null;

  const handleClose = () => {
    gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.3, onComplete: onClose });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointment._id, form.date, form.time);
    handleClose();
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
        className="relative w-full max-w-lg bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden"
      >
        <div className="bg-[#f0fdf4] px-10 py-8 border-b border-green-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-[#171c1f] tracking-tight flex items-center gap-3">
              <Check className="text-green-600" size={28} strokeWidth={3} />
              Confirm Schedule
            </h2>
            <p className="text-[#6c7a71] text-xs font-bold uppercase tracking-widest mt-1">Finalize Appointment Logistics</p>
          </div>
          <button onClick={handleClose} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#a0a3a5] hover:text-[#ba1a1a] transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          <div className="mb-8">
             <div className="p-6 bg-[#f8fafc] rounded-3xl border border-slate-100 mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Patient Request</p>
                <h3 className="text-xl font-bold text-slate-800">{appointment?.patientName}</h3>
                <p className="text-sm text-slate-500 font-medium">{appointment?.doctor?.specialization} • Dr. {appointment?.doctor?.name}</p>
             </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2 group/input">
                <label className="text-[10px] font-black text-[#6c7a71] uppercase tracking-[0.15em] px-2">Clinical Date</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a0a3a5] group-focus-within/input:text-green-600 transition-colors">
                    <Calendar size={20} />
                  </div>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 rounded-[20px] bg-[#f0f4f8] border-2 border-transparent 
                               text-[#171c1f] text-sm font-semibold outline-none transition-all duration-300
                               focus:bg-white focus:border-green-100 focus:ring-8 focus:ring-green-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 group/input">
                <label className="text-[10px] font-black text-[#6c7a71] uppercase tracking-[0.15em] px-2">Time Slot</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a0a3a5] group-focus-within/input:text-green-600 transition-colors">
                    <Clock size={20} />
                  </div>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 rounded-[20px] bg-[#f0f4f8] border-2 border-transparent 
                               text-[#171c1f] text-sm font-semibold outline-none transition-all duration-300
                               focus:bg-white focus:border-green-100 focus:ring-8 focus:ring-green-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-5 rounded-[24px] bg-[#f0f4f8] text-[#6c7a71] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-5 rounded-[24px] bg-linear-to-r from-[#006e2f] to-[#22c55e] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100/50 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApproveModal;
