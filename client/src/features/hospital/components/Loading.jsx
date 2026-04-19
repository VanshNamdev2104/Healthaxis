import React from 'react';
import { HeartPulse } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f6fafe]/80 backdrop-blur-md">
      
      {/* Outer Pulse Ring */}
      <div className="relative flex items-center justify-center w-32 h-32">
        <div className="absolute inset-0 border-4 border-[#8cf6da] rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
        
        {/* Inner Spinning Ring */}
        <div className="absolute inset-2 border-4 border-t-[#00846e] border-r-transparent border-b-[#00846e] border-l-transparent rounded-full animate-spin"></div>
        
        {/* Center Icon Background */}
        <div className="absolute inset-4 bg-linear-to-tr from-[#006857] to-[#00846e] rounded-full flex items-center justify-center shadow-lg shadow-[#00846e]/40">
           <HeartPulse size={36} className="text-[#8cf6da] animate-pulse" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center space-y-2">
        <h2 className="text-2xl font-['Manrope'] font-bold text-[#171c1f] tracking-tight">HealthAxis</h2>
        <div className="flex items-center space-x-1">
          <p className="text-[#4f6a5f] font-medium tracking-widest text-sm uppercase">Loading</p>
          <div className="flex space-x-1 mt-1">
            <div className="w-1.5 h-1.5 bg-[#00846e] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-[#00846e] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-[#00846e] rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Loading;