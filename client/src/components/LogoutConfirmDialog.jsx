import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { LogOut, X } from 'lucide-react';

const LogoutConfirmDialog = ({ isOpen, onClose, onConfirm }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(modalRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }, "-=0.1")
        .fromTo(iconRef.current, { rotate: -20, scale: 0.5 }, { rotate: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, "-=0.2");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current, { scale: 0.9, opacity: 0, y: 10, duration: 0.2 })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  };

  const handleConfirm = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        onConfirm();
      }
    });
    tl.to(modalRef.current, { scale: 0.9, opacity: 0, y: 10, duration: 0.2 })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-[40px] shadow-[0_40px_100px_rgba(99,102,241,0.2)] overflow-hidden border border-indigo-100"
      >
        <div className="absolute top-6 right-6">
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-10 text-center">
          <div ref={iconRef} className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-indigo-100">
            <LogOut size={48} strokeWidth={2} />
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Leaving So Soon?</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            Are you sure you want to <span className="text-slate-900 font-bold">logout</span>? You will need to sign in again to access your dashboard and health records.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <LogOut size={16} strokeWidth={3} />
              Yes, Logout
            </button>
            <button
              onClick={handleClose}
              className="w-full py-5 bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-all"
            >
              No, Stay Logged In
            </button>
          </div>
        </div>

        <div className="bg-indigo-50/50 py-4 px-6 border-t border-indigo-50 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Your session is secure</span>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmDialog;

