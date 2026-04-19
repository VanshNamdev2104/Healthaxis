import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { Check, X, Clock, Calendar, User } from 'lucide-react';

const AppointmentCard = ({ appointment, onStatusUpdate, onReschedule }) => {
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

      <div className="p-7 flex flex-col h-full">
        {/* Header: Status & Actions */}
        <div className="flex justify-between items-start mb-6">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${status.bg} ${status.text}`}>
            {status.icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
          </div>

          <div className="flex gap-2">
            {appointment?.status === 'pending' && (
              <button
                onClick={() => onStatusUpdate?.(appointment._id, 'approved')}
                className="w-8 h-8 rounded-xl bg-[#f0fdf4] text-[#10b981] flex items-center justify-center hover:bg-[#10b981] hover:text-white transition-all duration-300"
                title="Approve"
              >
                <Check size={16} strokeWidth={3} />
              </button>
            )}
            <button
              onClick={() => onStatusUpdate?.(appointment._id, 'rejected')}
              className="w-8 h-8 rounded-xl bg-[#fff1f2] text-[#f43f5e] flex items-center justify-center hover:bg-[#f43f5e] hover:text-white transition-all duration-300"
              title="Cancel"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Patient Details */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#171c1f]">
              <User size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[#171c1f] font-bold text-xl leading-none mb-1 group-hover:text-emerald-600 transition-colors">
                {appointment?.patientName}
              </h3>
              <p className="text-[#6c7a71] text-[10px] font-bold uppercase tracking-widest">
                Patient ({appointment?.age}y, {appointment?.gender})
              </p>
            </div>
          </div>
        </div>

        {/* Doctor & Dept Info */}
        <div className="bg-[#f8fafc] rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <p className="text-[#171c1f] text-sm font-bold truncate">Dr. {appointment?.doctor?.name || "Assigned Doctor"}</p>
          </div>
          <p className="text-[#6c7a71] text-[10px] font-bold uppercase tracking-widest ml-4">
            {appointment?.doctor?.specialization || "General Medicine"}
          </p>
        </div>

        {/* Date & Time Slot */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#374151]">
            <Calendar size={16} className="text-[#6c7a71]" />
            <span className="text-sm font-bold tracking-tight">{appointment?.date}</span>
          </div>
          <div className="flex items-center gap-3 text-[#374151]">
            <Clock size={16} className="text-[#6c7a71]" />
            <span className="text-sm font-bold tracking-tight">{appointment?.time}</span>
          </div>
        </div>
      </div>

      {/* Reschedule Button Tier */}
      <button
        onClick={() => onReschedule?.(appointment)}
        className="w-full py-4 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#171c1f] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn"
      >
        <Clock size={12} className="group-hover/btn:rotate-12 transition-transform" />
        Reschedule Appointment
      </button>
    </div>
  );
};

export default AppointmentCard;
