import React, { useEffect, useRef } from 'react';
import { useDisease } from '../../health/hooks/useDisease';
import DiseaseUserCard from '../components/DiseaseUserCard';
import { gsap } from 'gsap';
import { Search, Sparkles, Activity } from 'lucide-react';

const Disease_user = () => {
  const { diseases, loading, getAllDiseases } = useDisease();
//   console.log("check Disease_user 9", diseases);
  
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const bgElementsRef = useRef([]);

  useEffect(() => {
    getAllDiseases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Entrance animations
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out' })
      .fromTo(titleRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power4.out' }, '-=0.6');

    // Floating background elements animation
    bgElementsRef.current.forEach((el, i) => {
      gsap.to(el, {
        y: 'random(-40, 40)',
        x: 'random(-20, 20)',
        rotation: 'random(-15, 15)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2
      });
    });
  }, []);

  useEffect(() => {
    if (!loading && diseases?.diseases?.length > 0) {
      gsap.fromTo('.user-disease-card', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, diseases]);

  return (
    <div className="min-h-screen bg-[#fafaf5] text-[#1a1c19] font-sans selection:bg-[#553722] selection:text-white overflow-x-hidden relative pb-24">
      {/* ── Floating 3D Background Elements ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            ref={el => bgElementsRef.current[i] = el}
            className="absolute opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            {i % 2 === 0 ? (
               <Sparkles className="text-[#553722]" size={Math.random() * 100 + 50} />
            ) : (
               <Activity className="text-[#d2b48c]" size={Math.random() * 80 + 40} />
            )}
          </div>
        ))}
      </div>

      {/* ── Header Section ── */}
      <header 
        ref={headerRef}
        className="relative z-10 pt-20 pb-12 px-8 max-w-7xl mx-auto flex flex-col items-center text-center"
      >
        <div ref={titleRef} className="space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#553722]/5 border border-[#553722]/10">
            <Sparkles size={16} className="text-[#553722]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#553722]">Therapeutic Library</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter leading-none text-[#1a1c19]">
            Healing Through <br />
            <span className="text-transparent bg-linear-to-r from-[#553722] via-[#a68966] to-[#553722] bg-clip-text">Knowledge.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#50453e] font-medium max-w-2xl mx-auto leading-relaxed">
            Explore our curated database of health conditions, symptoms, and natural remedies. 
            Designed for clarity, comfort, and care.
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="mt-16 w-full max-w-2xl relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#553722]/40 group-focus-within:text-[#553722] transition-colors">
            <Search size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Search for conditions, symptoms..."
            className="w-full pl-16 pr-8 py-6 rounded-[32px] bg-white border border-[#553722]/5 shadow-[0_20px_40px_rgba(85,55,34,0.03)] focus:shadow-[0_20px_40px_rgba(85,55,34,0.08)] outline-none transition-all text-lg font-medium text-[#1a1c19] placeholder-[#553722]/30"
          />
        </div>
      </header>

      {/* ── Content Grid ── */}
      <main className="relative z-10 px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-[#553722] border-t-transparent rounded-full animate-spin" />
            <p className="mt-6 text-[#553722] font-black uppercase tracking-widest text-[10px]">Loading Sanctuary...</p>
          </div>
        ) : (
          <div 
            ref={gridRef}
            className="grid grid-cols-1 gap-12"
          >
            {diseases?.diseases?.length > 0 ? (
              diseases.diseases.map((disease, i) => (
                <div key={disease._id || i} className="user-disease-card">
                  <DiseaseUserCard disease={disease} />
                </div>
              ))
            ) : (
              <div className="py-40 text-center space-y-6 bg-white/40 backdrop-blur-xl rounded-[48px] border border-[#553722]/5 shadow-xl shadow-[#553722]/5">
                <div className="w-24 h-24 rounded-full bg-[#f4f4ef] flex items-center justify-center mx-auto text-4xl">
                  🌿
                </div>
                <h3 className="text-3xl font-serif font-bold text-[#1a1c19]">No conditions found in this sanctuary</h3>
                <p className="text-[#50453e] max-w-md mx-auto">
                  Perhaps try a different search term or check back later as we expand our library.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Decorative Footer Element ── */}
      <footer className="mt-32 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#553722]/40">
          <Activity size={12} />
          <span>Healthaxis AI • Empowering Wellness</span>
        </div>
      </footer>
    </div>
  );
};

export default Disease_user;