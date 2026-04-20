import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const DoctorCard = ({ doctor, onDelete, onClick, getAllDoc, hosId }) => {
   const cardRef = useRef(null);
   const glowRef = useRef(null);

   useEffect(() => {
      // Initial entrance if needed, or handled by parent
   }, []);

   const handleDelete = async() => {
      await onDelete(doctor?._id);
      await getAllDoc(hosId);
   }

   const handleMouseEnter = () => {
      gsap.to(cardRef.current, {
         y: -12,
         scale: 1.01,
         boxShadow: '0 40px 80px rgba(0, 108, 73, 0.08)',
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

   const initials = doctor?.name
      ?.split(' ')
      ?.map(n => n[0])
      ?.join('')
      ?.toUpperCase()
      ?.slice(0, 2) || 'DR';

   return (
      <div
         ref={cardRef}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
         onClick={() => onClick?.(doctor)}
         className="group relative bg-white border border-amber-700 backdrop-blur-2xl rounded-[32px] overflow-hidden cursor-pointer
                 transition-shadow duration-500 shadow-amber-700 shadow-2xl
                 flex flex-col h-full"
      >
         {/* Background Glow Accent - GSAP target */}
         <div
            ref={glowRef}
            className="absolute -top-20 -right-20 w-40 h-40 bg-[#10b981] blur-[80px] rounded-full opacity-0 pointer-events-none"
         />

         {/* Tonal Layering Header / Avatar Section */}
         <div className="p-8 pb-4">
            <div className="flex justify-between items-start mb-6">
               <div className="relative">
                  {/* The "Vibrant Ring" Avatar */}
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#006c49] to-[#10b981] p-[3px] shadow-2xl shadow-green-100 transition-transform duration-500 group-hover:rotate-12">
                     <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-1">
                        <div className="w-full h-full rounded-full bg-[#f6fafe] flex items-center justify-center text-[#006c49] font-black text-2xl tracking-tighter">
                           {initials}
                        </div>
                     </div>
                  </div>
                  {/* Pulsing Status Orb */}
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                     <div className={`w-4 h-4 rounded-full border-2 border-white ${doctor?.availability !== false ? 'bg-[#10b981] animate-pulse shadow-[0_0_12px_#10b981]' : 'bg-gray-300'}`} />
                  </div>
               </div>

               <div className="flex flex-col gap-1 items-end">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                             ${doctor?.availability !== false ? 'bg-[#f0fdf4] text-[#006c49]' : 'bg-gray-100 text-gray-400'}`}>
                     {doctor?.availability !== false ? 'Active Now' : 'Off Duty'}
                  </span>
               </div>
            </div>

            {/* Identity Section */}
            <div className="mb-6">
               <h3 className="text-[#171c1f] font-bold text-2xl leading-tight mb-2 tracking-tight group-hover:text-[#006c49] transition-colors duration-300">
                  Dr. {doctor?.name}
               </h3>
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span className="text-[#3c4a42] text-sm font-semibold tracking-wide uppercase">{doctor?.specialization || 'Clinical Specialist'}</span>
               </div>
            </div>

            {/* Info Grid - Bento inspired internal layout */}
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div className="bg-[#f0f4f8] rounded-[24px] p-4 group/item hover:bg-white hover:shadow-inner transition-all duration-300">
                  <p className="text-[#171c1f] font-black text-xl mb-0.5">{doctor?.experience || '5'}+</p>
                  <p className="text-[#6c7a71] text-[10px] font-bold uppercase tracking-widest">Years Exp.</p>
               </div>
               <div className="bg-[#f0f4f8] rounded-[24px] p-4 group/item hover:bg-white hover:shadow-inner transition-all duration-300">
                  <p className="text-[#171c1f] font-black text-xl mb-0.5">₹{doctor?.fee || '500'}</p>
                  <p className="text-[#6c7a71] text-[10px] font-bold uppercase tracking-widest">Consult Fee</p>
               </div>
            </div>
         </div>

         {/* Footer / Detailed Info Section (Secondary Surface Tier) */}
         <div className="mt-auto px-8 py-6 bg-[#f6fafe]/50 border-t border-white/40 flex items-center justify-between">
            <div className="flex flex-col">
               <p className="text-[10px] text-[#6c7a71] font-bold uppercase tracking-widest mb-1 leading-none">Primary Contact</p>
               <p className="text-sm text-[#3c4a42] font-semibold truncate max-w-[140px]">{doctor?.email || 'N/A'}</p>
            </div>

            <div className="flex z-10 gap-2 relative">
               <button
                  onClick={(e) => { 
                     e.stopPropagation(); 
                     if(window.confirm(`Are you sure you want to remove Dr. ${doctor?.name || 'this professional'} from the registry?`)){
                        handleDelete()
                        
                     }
                  }}
                  className="relative z-10 w-10 h-10 rounded-2xl bg-white text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-red-50"
                  title="Remove Professional"
               >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
               </button>
               <button
                  onClick={(e) => { e.stopPropagation(); onClick?.(doctor); }}
                  className="relative z-10 h-10 px-5 rounded-2xl bg-white text-[#2563eb] font-bold text-[10px] uppercase tracking-widest border border-blue-50 shadow-sm
                       hover:bg-[#2563eb] hover:text-white transition-all duration-300"
               >
                  Manage
               </button>
            </div>
         </div>
      </div>
   );
};

export default DoctorCard;
