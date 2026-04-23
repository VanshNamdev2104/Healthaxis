import React from 'react';
import { AlertCircle } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-orange-50/80 backdrop-blur-md">
      
      {/* Outer Pulse Ring */}
      <div className="relative flex items-center justify-center w-32 h-32">
        <div className="absolute inset-0 border-4 border-orange-300 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
        
        {/* Inner Spinning Ring */}
        <div className="absolute inset-2 border-4 border-t-orange-600 border-r-transparent border-b-orange-600 border-l-transparent rounded-full animate-spin"></div>
        
        {/* Center Icon Background */}
        <div className="absolute inset-4 bg-linear-to-tr from-orange-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-600/40">
           <AlertCircle size={36} className="text-orange-100 animate-pulse" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center space-y-2">
        <h2 className="text-2xl font-['Manrope'] font-bold text-[#171c1f] tracking-tight">HealthAxis</h2>
        <div className="flex items-center space-x-1">
          <p className="text-[#6c7a71] font-medium tracking-widest text-sm uppercase">Loading Health Data</p>
          <div className="flex space-x-1 mt-1">
            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
