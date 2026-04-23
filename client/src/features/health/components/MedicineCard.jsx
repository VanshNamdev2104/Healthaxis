import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { Pill, Trash2, Info } from 'lucide-react';

const MedicineCard = ({ medicine, onDelete, onClick, onEdit }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove "${medicine?.name}" from the registry?`)) {
      await onDelete(medicine?._id);
    }
  };

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -12,
      scale: 1.01,
      boxShadow: '0 40px 80px rgba(59, 130, 246, 0.08)',
      duration: 0.4,
      ease: 'power2.out'
    });
    gsap.to(glowRef.current, { opacity: 0.15, duration: 0.4 });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
      duration: 0.4,
      ease: 'power2.inOut'
    });
    gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
  };

  const initials = medicine?.name
    ?.split(' ')
    ?.map(n => n[0])
    ?.join('')
    ?.toUpperCase()
    ?.slice(0, 2) || 'MD';

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick?.(medicine)}
      className="group relative bg-white border border-blue-700 backdrop-blur-2xl rounded-[32px] overflow-hidden cursor-pointer
                 transition-shadow duration-500 shadow-blue-700 shadow-2xl
                 flex flex-col h-full"
    >
      {/* Background Glow Accent - GSAP target */}
      <div
        ref={glowRef}
        className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 blur-[80px] rounded-full opacity-0 pointer-events-none"
      />

      {/* Header / Avatar Section */}
      <div className="p-8 pb-4">
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            {/* The "Vibrant Ring" Avatar */}
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-600 to-blue-500 p-[3px] shadow-2xl shadow-blue-100 transition-transform duration-500 group-hover:rotate-12">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-2xl tracking-tighter">
                  {initials}
                </div>
              </div>
            </div>
            {/* Status Indicator */}
            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
            </div>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600">
              Pharmaceutical
            </span>
          </div>
        </div>

        {/* Identity Section */}
        <div className="mb-6">
          <h3 className="text-[#171c1f] font-bold text-2xl leading-tight mb-2 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
            {medicine?.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[#3c4a42] text-sm font-semibold tracking-wide uppercase">{medicine?.genericName || 'Generic Medicine'}</span>
          </div>
        </div>

        {/* Description Preview */}
        <div className="bg-blue-50 rounded-[24px] p-4 mb-4">
          <p className="text-[#171c1f] text-sm font-semibold line-clamp-3 leading-relaxed">
            {medicine?.description || 'No description available'}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#f0f4f8] rounded-[24px] p-4 group/item hover:bg-white hover:shadow-inner transition-all duration-300">
            <p className="text-[#171c1f] font-black text-lg mb-0.5 truncate">{medicine?.dosage || 'N/A'}</p>
            <p className="text-[#6c7a71] text-[10px] font-bold uppercase tracking-widest">Dosage</p>
          </div>
          <div className="bg-[#f0f4f8] rounded-[24px] p-4 group/item hover:bg-white hover:shadow-inner transition-all duration-300">
            <p className="text-[#171c1f] font-black text-xl mb-0.5">{medicine?.sideEffects?.length || 0}</p>
            <p className="text-[#6c7a71] text-[10px] font-bold uppercase tracking-widest">Side Effects</p>
          </div>
        </div>
      </div>

      {/* Footer / Action Section */}
      <div className="mt-auto px-8 py-6 bg-blue-50/50 border-t border-white/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill size={16} className="text-blue-600" />
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Pharmaceutical</p>
        </div>

        <div className="flex z-10 gap-2 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="relative z-10 w-10 h-10 rounded-2xl bg-white text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-red-50"
            title="Remove Medicine"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(medicine);
            }}
            className="relative z-10 h-10 px-5 rounded-2xl bg-white text-blue-600 font-bold text-[10px] uppercase tracking-widest border border-blue-50 shadow-sm
                 hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
