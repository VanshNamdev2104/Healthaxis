import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHospital } from '../../hospital/hooks/useHospital';
import { Calendar, Clock, Stethoscope, Building2, Search, XCircle, AlertCircle, FileText } from 'lucide-react';
import { gsap } from 'gsap';

const Appointments_user = () => {
    const { appointments, loading, error } = useSelector((state) => state.appointment);
    const { handleGetUserAppointments, handleDeleteAppointment } = useHospital();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const headerRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        handleGetUserAppointments();
    }, []);

    useEffect(() => {
        // GSAP Animations
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current, 
                { y: -30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!loading && appointments?.length > 0) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.appointment-user-card',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
                );
            });
            return () => ctx.revert();
        }
    }, [loading, appointments]);

    const filteredAppointments = useMemo(() => {
        return (appointments || []).filter(app => {
            const docName = app.doctor?.name || '';
            const hospName = app.hospital?.name || '';
            const patientName = app.patientName || '';
            const matchSearch = docName.toLowerCase().includes(search.toLowerCase()) ||
                hospName.toLowerCase().includes(search.toLowerCase()) ||
                patientName.toLowerCase().includes(search.toLowerCase());
            
            const matchStatus = statusFilter === 'All' || app.status?.toLowerCase() === statusFilter.toLowerCase();
            return matchSearch && matchStatus;
        });
    }, [appointments, search, statusFilter]);

    const handleCancelRequest = (app) => {
        setSelectedAppointment(app);
        setShowCancelDialog(true);
    };

    const confirmCancel = async () => {
        if (!selectedAppointment) return;
        setActionLoading(true);
        try {
            await handleDeleteAppointment(selectedAppointment._id);
            setShowCancelDialog(false);
            setSelectedAppointment(null);
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'confirmed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'rejected':
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-sans">
            <div ref={headerRef} className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">My Appointments</h1>
                    <p className="text-slate-500 font-medium mt-1">Track your healthcare requests and consults</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[260px] md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search doctor, hospital or patient..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 outline-none text-sm font-semibold transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Navigation */}
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300
                                ${statusFilter === status
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105'
                                    : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm'}`}
                        >
                            {status === 'Approved' ? 'Confirmed' : status}
                        </button>
                    ))}
                </div>

                <div className="px-5 py-2.5 bg-indigo-50/50 rounded-full border border-indigo-100/50 text-xs font-bold text-indigo-600">
                    Total: {filteredAppointments.length} Appointments
                </div>
            </div>

            {/* Appointment Cards Grid */}
            <div ref={gridRef} className="max-w-6xl mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 4].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-64 border border-slate-100 animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : filteredAppointments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredAppointments.map((app) => (
                            <div key={app._id} className="appointment-user-card bg-white p-6 rounded-3xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between opacity-0">
                                <div>
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 mb-1 block">Patient Profile</span>
                                            <h3 className="text-xl font-bold text-slate-800">{app.patientName}</h3>
                                            <p className="text-slate-400 text-xs font-medium mt-0.5">Age: {app.age} • {app.gender?.toUpperCase()}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide border ${getStatusStyle(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3 border-t border-slate-50 pt-4 mb-6">
                                        <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                                            <Stethoscope size={18} className="text-indigo-400 shrink-0" />
                                            <span>{app.doctor?.name || 'Doctor'} ({app.doctor?.specialization || 'General Doctor'})</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                                            <Building2 size={18} className="text-indigo-400 shrink-0" />
                                            <span>{app.hospital?.name || 'Hospital'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                                            <Calendar size={18} className="text-indigo-400 shrink-0" />
                                            <span>{app.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                                            <Clock size={18} className="text-indigo-400 shrink-0" />
                                            <span>{app.time}</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-slate-500 text-xs font-medium bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                                            <FileText size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                            <span><strong className="text-slate-600">Reason:</strong> {app.reason}</span>
                                        </div>
                                    </div>
                                </div>

                                {app.status?.toLowerCase() === 'pending' && (
                                    <button
                                        onClick={() => handleCancelRequest(app)}
                                        className="w-full bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 border border-slate-100 hover:border-rose-100 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all"
                                    >
                                        <XCircle size={18} /> Cancel Request
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-4xl mb-6 border border-slate-100">
                            📅
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Bookings Found</h3>
                        <p className="text-slate-500 font-medium max-w-md mt-2 mb-6 leading-relaxed">
                            You have no appointments registered under this status.
                        </p>
                    </div>
                )}
            </div>

            {/* Cancel Booking Confirmation Dialog */}
            {showCancelDialog && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 border border-rose-100">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Cancel Appointment?</h3>
                        <p className="text-slate-500 font-medium mb-8 leading-relaxed">Are you sure you want to cancel your appointment with <strong className="text-slate-700">{selectedAppointment?.doctor?.name}</strong>? This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowCancelDialog(false)}
                                className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold py-4 rounded-2xl transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={confirmCancel}
                                disabled={actionLoading}
                                className="flex-1 bg-rose-600 text-white hover:bg-rose-700 font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50"
                            >
                                {actionLoading ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments_user;
