import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import gsap from "gsap";

const AccessDenied = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // Subtle background glow animation using GSAP
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-[70vh] w-full overflow-hidden rounded-3xl bg-black/40 backdrop-blur-sm border border-white/10"
    >
      {/* Background Decorative Elements */}
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-destructive/20 blur-[120px] rounded-full pointer-events-none opacity-30" 
      />
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "out" }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Animated Icon */}
        <motion.div 
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 0.2 
          }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-destructive/30 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-linear-to-br from-destructive to-destructive/60 border border-white/20 shadow-2xl shadow-destructive/40">
            <ShieldAlert className="w-12 h-12 text-white" strokeWidth={1.5} />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black border border-white/20"
            >
              <Lock className="w-4 h-4 text-destructive" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter"
        >
          ACCESS <span className="text-transparent bg-clip-text bg-linear-to-r from-destructive to-orange-500">DENIED</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-white text-lg max-w-md mb-10 leading-relaxed font-medium"
        >
          It seems you've wandered into a restricted sector. Your current clearance level doesn't allow access to this data.
        </motion.p>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button 
            onClick={() => navigate(-1)}
            className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all hover:border-white/20 active:scale-95"
          >
            Dashboard
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative Corner Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-destructive/20 rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-white/5 rounded-bl-3xl pointer-events-none" />
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default AccessDenied;
