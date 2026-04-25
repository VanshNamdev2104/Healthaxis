import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useMedicine } from '../hooks/useMedicine';
import MedicineCard from '../components/MedicineCard';
import Loading from '../components/Loading';
import MedicineForm from '../../../components/Medicine';
import { gsap } from 'gsap';
import { Pill, Search, Download, Plus, Filter, Clock, Check, X, AlertCircle } from 'lucide-react';

const MedicinePage = () => {
  const { medicines, loading } = useSelector((state) => state.medicine);
  const { getAllMedicines, removeMedicine } = useMedicine();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    getAllMedicines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayMedicines = useMemo(() => {
    return (medicines?.data || []).filter(med => {
      const matchSearch = med.name?.toLowerCase().includes(search.toLowerCase()) ||
        med.genericName?.toLowerCase().includes(search.toLowerCase()) ||
        med.description?.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [medicines, search]);

  const stats = useMemo(() => {
    const total = medicines?.data?.length || 0;
    const withDosage = medicines?.data?.filter(m => m.dosage).length || 0;
    const withSideEffects = medicines?.data?.filter(m => m.sideEffects?.length > 0).length || 0;
    const activePharmaceuticals = total;
    return { total, withDosage, withSideEffects, activePharmaceuticals };
  }, [medicines]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const tl = gsap.timeline();

    tl.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out' })
      .fromTo(titleRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .fromTo(statsRef.current?.children,
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '-=0.4')
      .fromTo('.medicine-card-anim',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, '-=0.3');
  }, [loading, displayMedicines.length]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-blue-50 font-sans selection:bg-blue-50/10 pb-24 px-4 sm:px-8 lg:px-12">

      {/* ── Main Content Area ────────────────────────────────── */}
      <main className="max-w-7xl mx-auto pt-12">

        {/* Header Ribbon */}
        <header
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-20"
        >
          <div ref={titleRef} className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-100/50">
              <Pill size={32} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2 block">Pharmaceutical Hub</span>
              <h1 className="text-4xl md:text-6xl font-black text-[#171c1f] tracking-tighter leading-none">
                Medicine <span className="text-blue-600">Repository.</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group flex-1 min-w-[300px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6c7a71] group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search medicines, generic names..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)]
                           focus:border-blue-600/20 focus:ring-12 focus:ring-blue-50 outline-none text-sm font-semibold transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-5 bg-white rounded-[20px] border border-white/60 shadow-sm hover:bg-gray-50 transition-all text-[#171c1f]">
                <Download size={20} />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-3 px-10 py-5 bg-[#171c1f] text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-gray-300"
              >
                <Plus size={18} strokeWidth={3} />
                Add Medicine
              </button>
            </div>
          </div>
        </header>

        {/* Bento-Grid Stats Row */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {[
            { label: 'Total Medicines', value: stats.total, color: 'text-[#171c1f]', bg: 'bg-white', icon: <Pill size={20} /> },
            { label: 'With Dosage Info', value: stats.withDosage, color: 'text-blue-600', bg: 'bg-blue-50', icon: <Check size={20} /> },
            { label: 'With Side Effects', value: stats.withSideEffects, color: 'text-orange-600', bg: 'bg-orange-50', icon: <AlertCircle size={20} /> },
            { label: 'Pharmaceuticals Active', value: stats.activePharmaceuticals, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <Pill size={20} /> },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} p-10 rounded-[48px] flex flex-col justify-between h-52 shadow-[0_1px_2px_rgba(1,1,1,0.2)] group hover:scale-[1.02] transition-all duration-500 border border-white backdrop-blur-2xl`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6c7a71]">{stat.label}</span>
                <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>{stat.icon}</div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-6xl font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Global</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Navigation Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
            {['All', 'Tablet', 'Capsule', 'Syrup', 'Injection'].map(category => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap
                             ${categoryFilter === category
                    ? 'bg-[#171c1f] text-white shadow-2xl shadow-gray-300 scale-105'
                    : 'bg-white/60 text-[#6c7a71] hover:bg-white hover:text-[#171c1f] border border-white/40 shadow-sm'}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-8 py-4 bg-white/60 rounded-full border border-white/40 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
              <p className="text-[10px] font-black text-[#171c1f] uppercase tracking-widest">
                Pharma Active: {displayMedicines.length} Managed
              </p>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-white/60 rounded-full border border-white/40 text-[#6c7a71] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">
              <Filter size={16} /> Advanced Filters
            </button>
          </div>
        </div>

        {/* Dynamic Medicine Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/40 rounded-[32px] h-96 animate-pulse border border-white" />
            ))
          ) : displayMedicines.length > 0 ? (
            displayMedicines.map((med, i) => (
              <div key={med._id || i} className="medicine-card-anim opacity-0">
                <MedicineCard
                  medicine={med}
                  onDelete={removeMedicine}
                  onClick={(m) => navigate(`/health/medicine/${m._id}`)}
                  onEdit={(m) => navigate(`/health/medicine/${m._id}`)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md rounded-[60px] shadow-[0_10px_60px_rgba(0,0,0,0.01)] border border-dashed border-gray-200 mt-8">
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-5xl mb-10 shadow-xl shadow-gray-50">
                💊
              </div>
              <h3 className="text-4xl font-black text-[#171c1f] tracking-tighter mb-6">No Medicines Found</h3>
              <p className="text-[#6c7a71] font-medium max-w-lg mb-12 leading-relaxed text-xl">
                No pharmaceutical products match your search criteria. Try adjusting your search terms or add new medicines to the database.
              </p>
              <button
                onClick={() => setSearch('')}
                className="px-12 py-5 bg-[#171c1f] text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-2xl shadow-gray-300"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </main>

      <MedicineForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => getAllMedicines()}
      />
    </div>
  );
};

export default MedicinePage;
