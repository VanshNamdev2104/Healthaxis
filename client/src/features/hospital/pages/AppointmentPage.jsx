import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHospital } from '../hooks/useHospital';
import AppointmentCard from '../components/AppointmentCard';
import { gsap } from 'gsap';
import { CalendarCheck, Search, Download, Plus, Filter, Clock, Check, X } from 'lucide-react';

const AppointmentPage = () => {
  const { appointments, loading } = useSelector((state) => state.appointment);
  const { handleGetAllAppointments, handleUpdateAppointmentStatus, handleDeleteAppointment } = useHospital();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef(null);
  const gridRef = useRef(null);

  const displayAppointments = useMemo(() => {
    return (appointments || []).filter(app => {
      const matchSearch = app.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        app.doctor?.name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || app.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [appointments, search, statusFilter]);

  const stats = useMemo(() => {
    const total = appointments?.length || 0;
    const pending = appointments?.filter(a => a.status === 'pending').length || 0;
    const confirmed = appointments?.filter(a => a.status === 'approved' || a.status === 'confirmed').length || 0;
    const cancelled = appointments?.filter(a => a.status === 'rejected' || a.status === 'cancelled').length || 0;
    return { total, pending, confirmed, cancelled };
  }, [appointments]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const tl = gsap.timeline();

    tl.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out' })
      .fromTo(titleRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .fromTo(statsRef.current?.children,
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '-=0.4')
      .fromTo('.appointment-card-anim',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, '-=0.3');
  }, [loading, displayAppointments.length]);

  return (
    <div className="min-h-screen bg-[#edf5fd] font-sans selection:bg-[#22c55e]/10 pb-24 px-4 sm:px-8 lg:px-12">

      {/* ── Main Content Area (Full Width) ────────────────────────────────── */}
      <main className="max-w-7xl mx-auto pt-12">

        {/* Header Ribbon (Enhanced for Sidebar-less Layout) */}
        <header
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-20"
        >
          <div ref={titleRef} className="flex items-center gap-6">
            {/* Dynamic Icon to anchor the page in absence of sidebar */}
            <div className="w-16 h-16 rounded-[24px] bg-linear-to-br from-[#006e2f] to-[#22c55e] flex items-center justify-center text-white shadow-xl shadow-green-100/50">
              <CalendarCheck size={32} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2 block">Clinical Control Hub</span>
              <h1 className="text-4xl md:text-6xl font-black text-[#171c1f] tracking-tighter leading-none">
                Appointment <span className="text-emerald-500">Console.</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group flex-1 min-w-[300px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6c7a71] group-focus-within:text-[#22c55e] transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search patients or clinical staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)]
                             focus:border-[#22c55e]/20 focus:ring-12 focus:ring-green-50 outline-none text-sm font-semibold transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-5 bg-white rounded-[20px] border border-white/60 shadow-sm hover:bg-gray-50 transition-all text-[#171c1f]">
                <Download size={20} />
              </button>
              <button className="flex items-center gap-3 px-10 py-5 bg-[#171c1f] text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-gray-300">
                <Plus size={18} strokeWidth={3} />
                New Booking
              </button>
            </div>
          </div>
        </header>

        {/* Bento-Grid Stats Row (Spacious & Polished) */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {[
            { label: 'Total Appointments', value: stats.total, color: 'text-[#171c1f]', bg: 'bg-white', icon: <CalendarCheck size={20} /> },
            { label: 'Pending Review', value: stats.pending, color: 'text-[#f59e0b]', bg: 'bg-[#fffbeb]', icon: <Clock size={20} /> },
            { label: 'Confirmed Today', value: stats.confirmed, color: 'text-emerald-600', bg: 'bg-[#f0fdf4]', icon: <Check size={20} /> },
            { label: 'Cancelled/No-Show', value: stats.cancelled, color: 'text-[#f43f5e]', bg: 'bg-[#fff1f2]', icon: <X size={20} /> },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} p-10 rounded-[48px] flex flex-col justify-between h-52 shadow-[0_1px_2px_rgba(1,1,1,0.2)] group hover:scale-[1.02] transition-all duration-500 border border-white  backdrop-blur-2xl`}>
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
            {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap
                               ${statusFilter === status
                    ? 'bg-[#171c1f] text-white shadow-2xl shadow-gray-300 scale-105'
                    : 'bg-white/60 text-[#6c7a71] hover:bg-white hover:text-[#171c1f] border border-white/40 shadow-sm'}`}
              >
                {status === 'Approved' ? 'Confirmed' : status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-8 py-4 bg-white/60 rounded-full border border-white/40 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.4)]" />
              <p className="text-[10px] font-black text-[#171c1f] uppercase tracking-widest">
                Clinical Pulse: {displayAppointments.length} Managed
              </p>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-white/60 rounded-full border border-white/40 text-[#6c7a71] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">
              <Filter size={16} /> Advanced Filters
            </button>
          </div>
        </div>

        {/* Dynamic Appointment Grid (Full Width Context) */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/40 rounded-[32px] h-96 animate-pulse border border-white" />
            ))
          ) : displayAppointments.length > 0 ? (
            displayAppointments.map((app, i) => (
              <div key={app._id || i} className="appointment-card-anim opacity-0">
                <AppointmentCard
                  appointment={app}
                  onStatusUpdate={handleUpdateAppointmentStatus}
                  onReschedule={(a) => console.log('Clinical Review:', a)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md rounded-[60px] shadow-[0_10px_60px_rgba(0,0,0,0.01)] border border-dashed border-gray-200 mt-8">
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-5xl mb-10 shadow-xl shadow-gray-50">
                🧬
              </div>
              <h3 className="text-4xl font-black text-[#171c1f] tracking-tighter mb-6">Clinical Registry Empty</h3>
              <p className="text-[#6c7a71] font-medium max-w-lg mb-12 leading-relaxed text-xl">
                No medical bookings are currently registered in this department. Adjust search filters to surface other clinical schedules.
              </p>
              <button
                onClick={() => { setSearch(''); setStatusFilter('All'); }}
                className="px-12 py-5 bg-[#171c1f] text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-2xl shadow-gray-300"
              >
                Reset Clinical Filter
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppointmentPage;