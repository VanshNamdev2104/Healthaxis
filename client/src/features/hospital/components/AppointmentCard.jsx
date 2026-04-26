import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { Check, X, Clock, Calendar, User, Trash2 } from 'lucide-react';

const AppointmentCard = ({ appointment, approve , reject , deleteAppointment, onReschedule }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -8,
      scale: 1.01,
      boxShadow: '0 30px 60px rgba(0, 108, 73, 0.06)',
      duration: 0.4,
      ease: 'power2.out'
    });
    gsap.to(glowRef.current, { opacity: 0.1, duration: 0.4 });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.01)',
      duration: 0.4,
      ease: 'power2.inOut'
    });
    gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'confirmed':
        return { bg: 'bg-[#f0fdf4]', text: 'text-[#10b981]', icon: <Check size={14} />, label: 'Confirmed' };
      case 'rejected':
      case 'cancelled':
        return { bg: 'bg-[#fff1f2]', text: 'text-[#f43f5e]', icon: <X size={14} />, label: 'Cancelled' };
      case 'completed':
        return { bg: 'bg-[#f0f9ff]', text: 'text-[#0ea5e9]', icon: <Check size={14} />, label: 'Completed' };
      default:
        return { bg: 'bg-[#fffbeb]', text: 'text-[#f59e0b]', icon: <Clock size={14} />, label: 'Pending' };
    }
  };

  const status = getStatusStyles(appointment?.status);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]
                 transition-all duration-500 flex flex-col h-full border border-white/40"
    >
      {/* Background Glow */}
      <div
        ref={glowRef}
        className="absolute -top-20 -right-20 w-48 h-48 bg-[#22c55e] blur-[80px] rounded-full opacity-0 pointer-events-none"
      />

      <div className="p-5 flex flex-col h-full">
        {/* Header: Status & Actions */}
        <div className="flex justify-between items-center mb-5">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg} ${status.text}`}>
            {status.icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{status.label}</span>
          </div>

          <div className="flex gap-1.5">
            {appointment?.status === 'pending' && (
              <button
                onClick={() => approve(appointment._id)}
                className="w-7 h-7 rounded-lg bg-[#f0fdf4] text-[#10b981] flex items-center justify-center hover:bg-[#10b981] hover:text-white transition-all duration-300 shadow-xs"
                title="Approve"
              >
                <Check size={14} strokeWidth={3} />
              </button>
            )}
            <button
              onClick={() => reject(appointment._id)}
              className="w-7 h-7 rounded-lg bg-[#fff1f2] text-[#f43f5e] flex items-center justify-center hover:bg-[#f43f5e] hover:text-white transition-all duration-300 shadow-xs"
              title="Cancel"
            >
              <X size={14} strokeWidth={3} />
            </button>
            <button
              onClick={() => deleteAppointment(appointment._id)}
              className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-xs"
              title="Delete Record"
            >
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Patient Details */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#171c1f]">
              <User size={18} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[#171c1f] font-bold text-base leading-tight group-hover:text-emerald-600 transition-colors">
                {appointment?.patientName}
              </h3>
              <p className="text-[#6c7a71] text-[9px] font-bold uppercase tracking-widest">
                {appointment?.age}y • {appointment?.gender}
              </p>
            </div>
          </div>
        </div>

        {/* Doctor & Dept Info */}
        <div className="bg-[#f8fafc] rounded-xl p-3.5 mb-4 border border-slate-50">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1 h-1 rounded-full bg-[#22c55e]" />
            <p className="text-[#171c1f] text-xs font-bold truncate">Dr. {appointment?.doctor?.name || "Assigned Doctor"}</p>
          </div>
          <p className="text-[#6c7a71] text-[9px] font-bold uppercase tracking-widest pl-3">
            {appointment?.doctor?.specialization || "General Medicine"}
          </p>
        </div>

        {/* Date & Time Slot */}
        <div className="mt-auto pt-4 border-t border-dashed border-slate-100 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-[#374151]">
            <Calendar size={13} className="text-[#6c7a71]" />
            <span className="text-[11px] font-bold tracking-tight">{appointment?.date}</span>
          </div>
          <div className="flex items-center gap-2 text-[#374151] justify-end">
            <Clock size={13} className="text-[#6c7a71]" />
            <span className="text-[11px] font-bold tracking-tight">{appointment?.time}</span>
          </div>
        </div>
      </div>

      {/* Reschedule Button Tier */}
      <button
        onClick={() => onReschedule?.(appointment)}
        className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-[#6c7a71] font-black text-[9px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 border-t border-slate-100"
      >
        <Clock size={11} />
        Review Schedule
      </button>
    </div>
  );
};

export default AppointmentCard;
