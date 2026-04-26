import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useDisease } from '../hooks/useDisease';
import DiseaseCard from '../components/DiseaseCard';
import Loading from '../components/Loading';
import DiseaseForm from '../../../components/Disease';
import { gsap } from 'gsap';
import { AlertCircle, Search, Plus } from 'lucide-react';

const DiseasePage = () => {
  const { diseases, loading } = useSelector((state) => state.disease);
  const { getAllDiseases, removeDisease } = useDisease();
  const [showAddModal, setShowAddModal] = useState(false);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const navigate = useNavigate();

  const gridRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    getAllDiseases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredDiseases = useMemo(() => {
    return (diseases?.data || []).filter(disease => {
      const matchSearch = disease.name?.toLowerCase().includes(search.toLowerCase()) ||
        disease.description?.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [diseases, search]);

  // Extract unique categories from disease names for filtering
  const categories = useMemo(() => {
    return ['All', ...new Set((diseases?.data || [])
      .map(d => d.name?.charAt(0).toUpperCase())
      .filter(Boolean))];
  }, [diseases]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' })
      .fromTo(titleRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, '-=0.5');
  }, []);

  useEffect(() => {
    if (!loading && filteredDiseases.length > 0) {
      gsap.fromTo('.disease-card-anim',
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [loading, filteredDiseases]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-orange-50 font-sans overflow-x-hidden pb-20">
      {/* ── Floating Glass Header ───────────────────────────────────── */}
      <header
        ref={headerRef}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-7xl px-8 py-5
                   bg-white/60 backdrop-blur-2xl rounded-[32px] border border-white/40
                   shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black text-[#171c1f] tracking-tighter uppercase italic leading-none">Health Axis AI</h1>
            <p className="text-[10px] text-[#6c7a71] font-bold uppercase tracking-widest mt-0.5">Medical Database</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-orange-600 to-orange-500 text-white font-black tracking-widest uppercase text-[10px]
                       rounded-full shadow-xl shadow-orange-100 hover:shadow-2xl hover:scale-[1.05] active:scale-[0.98] transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Disease
          </button>
        </div>
      </header>

      {/* ── Hero Greeting ───────────────────────────────────────────── */}
      <section className="pt-40 pb-12 px-8 max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-12">
          <span className="text-xs font-black text-orange-600 uppercase tracking-[0.3em] mb-4 block">Health Alert Management</span>
          <h2 className="text-4xl md:text-6xl font-black flex flex-col text-[#171c1f] leading-[0.9] tracking-tighter max-w-4xl">
            Welcome to the <span className="text-4xl md:text-5xl bg-linear-0 from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">Disease Registry</span>
          </h2>
          <p className="mt-6 text-[#6c7a71] text-lg font-medium max-w-2xl leading-relaxed">
            Explore comprehensive medical conditions database. Review symptoms, causes, diagnosis methods, and recommended treatments for various health conditions.
          </p>
        </div>

        {/* ── Stats Summary ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Total Conditions', value: diseases?.data?.length || 0, accent: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Active Entries', value: filteredDiseases.length, accent: 'text-[#2563eb]', bg: 'bg-[#f0f4ff]' },
            { label: 'Health Alerts', value: diseases?.data?.length || 0, accent: 'text-red-600', bg: 'bg-red-50' },
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

        {/* ── Filter Navigation & Search ───────────────────────────────────────── */}
        <div className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-[32px] shadow-sm border border-gray-50">
          
          {/* Responsive Search Bar */}
          <div className="w-full xl:w-[450px] relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#a0a3a5] group-focus-within:text-orange-600 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by disease name or symptoms..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full bg-orange-50 border-2 border-transparent text-sm font-semibold outline-none transition-all
                         focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 shadow-inner hover:shadow-md text-[#171c1f]"
            />
          </div>

          <div className="flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-50 rounded-full border border-orange-100 shadow-sm whitespace-nowrap shrink-0 w-max">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
              Live: {filteredDiseases.length}
            </p>
          </div>
        </div>

        {/* ── Grid of Diseases ───────────────────────────── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[32px] h-[450px] animate-pulse shadow-sm" />
            ))
          ) : filteredDiseases.length > 0 ? (
            filteredDiseases.map((disease, i) => (
              <div key={disease._id || i} className="disease-card-anim">
                <DiseaseCard
                  disease={disease}
                  onDelete={removeDisease}
                  onClick={(d) => navigate(`/health/disease/${d._id}`)}
                  onEdit={(d) => navigate(`/health/disease/${d._id}`)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center bg-white rounded-[40px] shadow-sm border border-dashed border-gray-200">
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center text-4xl mb-8">
                🔍
              </div>
              <h3 className="text-3xl font-black text-[#171c1f] tracking-tighter mb-4">No Conditions Found</h3>
              <p className="text-[#6c7a71] font-medium max-w-sm mb-10 leading-relaxed text-lg">
                Your search returned no results. Try adjusting your search criteria or add new health conditions to the database.
              </p>
              <button
                onClick={() => setSearch('')}
                className="px-10 py-4 bg-[#171c1f] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </section>

      <DiseaseForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => getAllDiseases()}
      />
    </div>
  );
};

export default DiseasePage;
