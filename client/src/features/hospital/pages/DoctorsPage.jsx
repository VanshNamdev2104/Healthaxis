import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHospital } from '../hooks/useHospital';
import DoctorCard from '../components/DoctorCard';
import AddDoctorModal from '../components/AddDoctorModal';
import { gsap } from 'gsap';


const DoctorsPage = () => {
  
  const { doctors, loading } = useSelector((state) => state.doctor);
  const { handleCreateDoctor, handleGetAllDoctors, handleDeleteDoctor } = useHospital();

  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const gridRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);

  const filteredDoctors = useMemo(() => {
    return (doctors || []).filter(doc => {
      const matchSearch = doc.name?.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(search.toLowerCase());
      const matchSpec = specFilter === 'All' || doc.specialization === specFilter;
      return matchSearch && matchSpec;
    });
  }, [doctors, search, specFilter]);

  // Extract unique specializations for the filter dropdown ex- [Cardiologist, Neurologist, etc.]
  const specs = useMemo(() => ['All', ...new Set((doctors || []).map(d => d.specialization).filter(Boolean))], [doctors]);

  useEffect(() => {
    // Page Entrance Animations
    window.scrollTo(0 , 0)
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' })
      .fromTo(titleRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, '-=0.5');

    if (!loading && filteredDoctors.length > 0) {
      gsap.fromTo('.doctor-card-anim',
        { y: 60, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [loading, filteredDoctors.length]);

  return (
    <div className="min-h-screen bg-[#f6fafe] font-sans overflow-x-hidden pb-20">
      {/* ── Floating Glass Header ───────────────────────────────────── */}
      <header
        ref={headerRef}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-7xl px-8 py-5
                   bg-white/60 backdrop-blur-2xl rounded-[32px] border border-white/40
                   shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#006c49] to-[#10b981] flex items-center justify-center text-white shadow-lg shadow-green-100">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" /></svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black text-[#171c1f] tracking-tighter uppercase italic leading-none">Health Axis AI</h1>
            <p className="text-[10px] text-[#6c7a71] font-bold uppercase tracking-widest mt-0.5">Clinical Admin</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group hidden lg:block">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a0a3a5] group-focus-within:text-[#006c49] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search clinical staff..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3.5 rounded-full bg-[#f0f4f8] border-2 border-transparent text-sm font-semibold outline-none transition-all
                         focus:bg-white focus:border-[#dbe1ff] focus:ring-12 focus:ring-green-50 w-96 shadow-inner"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-[#006c49] to-[#10b981] text-white font-black tracking-widest uppercase text-[10px]
                       rounded-full shadow-xl shadow-green-100 hover:shadow-2xl hover:scale-[1.05] active:scale-[0.98] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            Add Doctor
          </button>
        </div>
      </header>

      {/* ── Hero Greeting ───────────────────────────────────────────── */}
      <section className="pt-40 pb-12 px-8 max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-12">
          <span className="text-xs font-black text-[#006c49] uppercase tracking-[0.3em] mb-4 block">Medical Practitioner Management</span>
          <h2 className="text-5xl md:text-7xl font-black text-[#171c1f] leading-[0.9] tracking-tighter max-w-4xl">
            Welcome back to the <span className="text-[#10b981]">Clinical Sanctuary.</span>
          </h2>
          <p className="mt-6 text-[#6c7a71] text-lg font-medium max-w-2xl leading-relaxed">
            Oversee your healthcare professionals with precision. Manage availability, review clinical specialties, and maintain the highest standards of care.
          </p>
        </div>

        {/* ── Stats Summary Tonal Layer ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Staff Directory', value: doctors?.length || 0, accent: 'text-[#006c49]', bg: 'bg-[#f0fdf4]' },
            { label: 'Active Specialists', value: doctors?.filter(d => d.availability !== false).length || 0, accent: 'text-[#2563eb]', bg: 'bg-[#f0f4ff]' },
            { label: 'Clinical Groups', value: specs.length - 1, accent: 'text-[#5c5f61]', bg: 'bg-[#f8fafc]' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} p-8 rounded-[40px] flex flex-col justify-between h-48 group hover:scale-[1.02] transition-transform duration-500`}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6c7a71]">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-6xl font-black tracking-tighter ${stat.accent}`}>{stat.value}</span>
                <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Global</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter Navigation ───────────────────────────────────────── */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
            {specs.map(spec => (
              <button
                key={spec}
                onClick={() => setSpecFilter(spec)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                           ${specFilter === spec
                    ? 'bg-[#171c1f] text-white shadow-2xl shadow-gray-200'
                    : 'bg-white text-[#6c7a71] hover:bg-gray-100 border border-gray-100'}`}
              >
                {spec}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-50 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <p className="text-[10px] font-black text-[#171c1f] uppercase tracking-widest">
              Live: {filteredDoctors.length} Practitioners
            </p>
          </div>
        </div>

        {/* ── Bento-Grid of Professionals ───────────────────────────── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[32px] h-[450px] animate-pulse shadow-sm" />
            ))
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc, i) => (
              <div key={doc._id || i} className="doctor-card-anim opacity-0">
                <DoctorCard
                  doctor={doc}
                  onDelete={handleDeleteDoctor}
                  onClick={(d) => console.log('Clinical Review:', d)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center bg-white rounded-[40px] shadow-sm border border-dashed border-gray-200">
              <div className="w-24 h-24 rounded-full bg-[#f6fafe] flex items-center justify-center text-4xl mb-8">
                🔭
              </div>
              <h3 className="text-3xl font-black text-[#171c1f] tracking-tighter mb-4">No Professionals Found</h3>
              <p className="text-[#6c7a71] font-medium max-w-sm mb-10 leading-relaxed text-lg">
                Your search criteria returned empty. Adjust filters to surface practitioners in other departments.
              </p>
              <button
                onClick={() => { setSearch(''); setSpecFilter('All'); }}
                className="px-10 py-4 bg-[#171c1f] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all"
              >
                Reset Clinical Scope
              </button>
            </div>
          )}
        </div>
      </section>

      <AddDoctorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (data) => {
          console.log(data);

          await handleCreateDoctor(data);
          setShowAddModal(false);
        }}
      />
    </div>
  );
};

export default DoctorsPage;