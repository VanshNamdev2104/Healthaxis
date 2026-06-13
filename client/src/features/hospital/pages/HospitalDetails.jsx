import React, { useState, useEffect } from 'react';
import { getAllDoctors } from '../services/doctor.api.js';
import { createAppointment } from '../services/appointment.api.js';
import { Building2, MapPin, Phone, Mail, ArrowLeft, Stethoscope, Star, IndianRupee, Calendar, Clock, AlertCircle } from 'lucide-react';
import { DASHBOARD_TABS } from '../../../pages/dashboard.constants';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 18 }
    }
};

const HospitalDetails = ({ hospital, onBack, setActiveTab }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null); // For booking modal

    useEffect(() => {
        console.log('Fetching doctors for hospital:', hospital._id);
        getAllDoctors({ hospitalId: hospital._id })
            .then(res => { 
                console.log('Doctors API response:', res.data);
                setDoctors(Array.isArray(res.data?.data) ? res.data.data : []);
                setLoading(false); 
            })
            .catch(err => { 
                console.error('Doctors fetch error:', err);
                setDoctors([]);
                setLoading(false); 
            });
    }, [hospital._id]);

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8 relative font-sans selection:bg-indigo-100 selection:text-indigo-900"
        >
            {/* Ambient Background Blur */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
            </div>

            {/* Back Button */}
            <div className="relative z-10">
                <motion.button 
                    onClick={onBack} 
                    className="group mb-4 flex items-center gap-2.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-black uppercase tracking-widest text-[10px] transition-colors cursor-pointer"
                    whileHover={{ x: -4 }}
                >
                    <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" /> 
                    Back to Directory
                </motion.button>
            </div>

            {/* Profile Header Glassmorphic Card */}
            <motion.div 
                variants={cardVariants}
                className="relative z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-6 md:p-8 rounded-[32px] border border-slate-200/50 dark:border-neutral-800/50 flex flex-col md:flex-row gap-8 items-center md:items-start overflow-hidden shadow-sm hover:shadow-md transition-all duration-350"
            >
                <div className="w-full md:w-1/3 aspect-video md:aspect-square md:max-w-[240px] bg-gradient-to-br from-indigo-50 to-blue-50/50 dark:from-neutral-850 dark:to-neutral-900/60 rounded-2xl flex items-center justify-center border border-indigo-100/50 dark:border-neutral-800/65 shadow-inner shrink-0 relative overflow-hidden">
                    <Building2 size={72} className="text-indigo-300 dark:text-neutral-700 z-10" />
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                </div>

                <div className="flex-1 space-y-4 w-full text-center md:text-left">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight italic">
                            {hospital.name}
                        </h1>
                        <div className="h-1 w-20 bg-indigo-650 rounded-full mt-3 mx-auto md:mx-0"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-sm pt-2">
                        <p className="flex items-start gap-3 justify-center md:justify-start">
                            <MapPin size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" /> 
                            <span>{hospital.address}, {hospital.city}, {hospital.state} - {hospital.zipCode}</span>
                        </p>
                        <p className="flex items-center gap-3 justify-center md:justify-start">
                            <Phone size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0" /> 
                            <span>{hospital.hospitalNumber}</span>
                        </p>
                        <p className="flex items-center gap-3 justify-center md:justify-start overflow-hidden col-span-full">
                            <Mail size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0" /> 
                            <span className="truncate">{hospital.hospitalEmail}</span>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Clinician Directory Title */}
            <div className="relative z-10 flex items-center gap-3.5 pt-4">
                <div className="w-1.5 h-8 bg-indigo-650 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
                    <Stethoscope className="text-indigo-600 dark:text-indigo-400" size={28} /> AVAILABLE CLINICIANS
                </h2>
            </div>

            {/* Loading & Grid rendering */}
            <div className="relative z-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-100/70 dark:bg-neutral-850/60 rounded-[32px] border border-slate-200/50 dark:border-neutral-800/50 animate-pulse flex flex-col p-6 space-y-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-slate-200 dark:bg-neutral-800 rounded-full"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded-md w-3/4"></div>
                                        <div className="h-3 bg-slate-200 dark:bg-neutral-800 rounded-md w-1/2"></div>
                                    </div>
                                </div>
                                <div className="space-y-2 flex-1 pt-4">
                                    <div className="h-3.5 bg-slate-200 dark:bg-neutral-800 rounded-md w-full"></div>
                                    <div className="h-3.5 bg-slate-200 dark:bg-neutral-800 rounded-md w-5/6"></div>
                                </div>
                                <div className="h-12 bg-slate-200 dark:bg-neutral-800 rounded-2xl w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        variants={pageVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {Array.isArray(doctors) && doctors.length > 0 ? doctors.map((doc) => (
                            <motion.div 
                                key={doc._id} 
                                variants={cardVariants}
                                whileHover={{
                                    y: -8,
                                    scale: 1.015,
                                    boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.12)",
                                    transition: { type: "spring", stiffness: 300, damping: 20 }
                                }}
                                className="bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md p-6.5 rounded-[32px] border border-slate-200/50 dark:border-neutral-800/80 flex flex-col group shadow-sm transition-all duration-350"
                            >
                                <div className="flex items-start gap-4.5 mb-6">
                                    <div className="w-16 h-16 bg-indigo-50 dark:bg-neutral-850 rounded-2xl flex items-center justify-center text-indigo-650 dark:text-indigo-400 font-black text-2xl border border-indigo-100/50 dark:border-neutral-800 shadow-sm shrink-0 group-hover:bg-indigo-650 group-hover:text-white dark:group-hover:bg-indigo-600 transition-colors duration-300">
                                        {doc.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-snug">{doc.name}</h3>
                                        <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mt-1">{doc.specialization}</p>
                                    </div>
                                </div>

                                <div className="space-y-3.5 text-slate-500 dark:text-slate-400 mb-8 flex-1 font-semibold text-xs sm:text-sm">
                                    <p className="flex items-center gap-3">
                                        <Star size={16} className="text-amber-500 shrink-0" fill="currentColor" /> 
                                        <span>{doc.experience} Years Experience</span>
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <IndianRupee size={16} className="text-emerald-500 dark:text-emerald-450 shrink-0" strokeWidth={2.5} /> 
                                        <span>₹{doc.fee} Consultation Fee</span>
                                    </p>
                                </div>

                                <button 
                                    onClick={() => setSelectedDoctor(doc)}
                                    className="w-full bg-indigo-650 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 font-black uppercase tracking-wider text-[9px] py-4.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-indigo-650/10 dark:shadow-indigo-600/10 cursor-pointer"
                                >
                                    <Calendar size={14} /> Book Appointment
                                </button>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center text-slate-400 dark:text-slate-500 font-bold text-lg bg-white/80 dark:bg-neutral-900/80 rounded-[32px] border border-slate-200/50 dark:border-neutral-800/80">
                                No clinicians currently assigned to this hospital.
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* AnimatePresence Booking Modal */}
            <AnimatePresence>
                {selectedDoctor && (
                    <BookingModal 
                        doctor={selectedDoctor} 
                        hospital={hospital} 
                        onClose={() => setSelectedDoctor(null)} 
                        setActiveTab={setActiveTab} 
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const BookingModal = ({ doctor, hospital, onClose, setActiveTab }) => {
    const [formData, setFormData] = useState({
        name: '', reason: '', date: '', time: '', age: '', gender: '', phoneNo: '', alternateNo: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createAppointment(doctor._id, formData);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || err.message || (typeof err === 'string' ? err : "Failed to book appointment"));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                    exit={{ scale: 0.95, y: 20, transition: { duration: 0.15 } }}
                    className="bg-white dark:bg-neutral-900 p-8 rounded-[32px] max-w-md w-full text-center shadow-2xl border border-slate-150/40 dark:border-neutral-800/80"
                >
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100/40 dark:border-emerald-900/40">
                        <Calendar size={36} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight italic">Booking Requested!</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-sm mb-8 leading-relaxed">
                        Your request with <strong className="text-slate-700 dark:text-slate-200 font-black">{doctor.name}</strong> at <strong className="text-slate-700 dark:text-slate-200 font-black">{hospital.name}</strong> has been submitted. You will be notified via email once approved.
                    </p>
                    <button 
                        onClick={() => {
                            onClose();
                            if (setActiveTab) {
                                setActiveTab(DASHBOARD_TABS.APPOINTMENTS);
                            }
                        }} 
                        className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-755 text-white font-black uppercase tracking-wider text-[9px] py-4.5 rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
                    >
                        Review Bookings
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
        >
            <motion.div 
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                exit={{ scale: 0.95, y: 30, transition: { duration: 0.15 } }}
                className="bg-white dark:bg-neutral-900 rounded-[32px] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-150/40 dark:border-neutral-800/80 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-slate-50 dark:bg-neutral-850 px-8 py-6 border-b border-slate-150/40 dark:border-neutral-800/80 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-150 tracking-tight flex items-center gap-2">
                            <Clock size={20} className="text-indigo-650 dark:text-indigo-400 shrink-0" />
                            Book Appointment
                        </h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mt-1.5">
                            Clinician: {doctor.name} &bull; ₹{doctor.fee}
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-200 border border-slate-150/40 dark:border-neutral-750 transition-colors cursor-pointer text-xl font-semibold"
                    >
                        &times;
                    </button>
                </div>
                
                {/* Scrollable Form */}
                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30 rounded-2xl font-bold text-sm flex items-start gap-2.5">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-widest">Patient Name</label>
                            <input 
                                required 
                                type="text" 
                                className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 outline-none transition-all font-semibold text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                placeholder="Full name of patient" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-widest">Age</label>
                            <input 
                                required 
                                type="number" 
                                className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 outline-none transition-all font-semibold text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400" 
                                value={formData.age} 
                                onChange={e => setFormData({...formData, age: e.target.value})} 
                                placeholder="Patient age" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-widest">Gender</label>
                            <select 
                                required 
                                className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 outline-none transition-all font-semibold text-sm text-slate-800 dark:text-slate-200" 
                                value={formData.gender} 
                                onChange={e => setFormData({...formData, gender: e.target.value})}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-widest">Primary Contact Number</label>
                            <input 
                                required 
                                type="tel" 
                                className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 outline-none transition-all font-semibold text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400" 
                                value={formData.phoneNo} 
                                onChange={e => setFormData({...formData, phoneNo: e.target.value})} 
                                placeholder="10-digit phone number" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-widest">Alternate Contact (Optional)</label>
                            <input 
                                type="tel" 
                                className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 outline-none transition-all font-semibold text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400" 
                                value={formData.alternateNo} 
                                onChange={e => setFormData({...formData, alternateNo: e.target.value})} 
                                placeholder="Secondary phone number" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-widest">Preferred Date</label>
                            <input 
                                required 
                                type="date" 
                                className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 outline-none transition-all font-semibold text-sm text-slate-800 dark:text-slate-200" 
                                value={formData.date} 
                                onChange={e => setFormData({...formData, date: e.target.value})} 
                                min={new Date().toISOString().split('T')[0]} 
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-widest">Preferred Time</label>
                            <input 
                                required 
                                type="time" 
                                className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 outline-none transition-all font-semibold text-sm text-slate-800 dark:text-slate-200" 
                                value={formData.time} 
                                onChange={e => setFormData({...formData, time: e.target.value})} 
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-widest">Reason for Visit</label>
                            <textarea 
                                required 
                                className="w-full p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 outline-none transition-all resize-none h-32 font-semibold text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400" 
                                value={formData.reason} 
                                onChange={e => setFormData({...formData, reason: e.target.value})} 
                                placeholder="Briefly summarize symptoms or purpose of the appointment..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-150/45 dark:border-neutral-800/80">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-neutral-750 font-black uppercase tracking-wider text-[9px] py-4.5 rounded-2xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="flex-1 bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-black uppercase tracking-wider text-[9px] py-4.5 rounded-2xl transition-all shadow-md shadow-indigo-650/10 dark:shadow-indigo-600/10 disabled:opacity-50 disabled:scale-100 active:scale-[0.98] cursor-pointer"
                        >
                            {loading ? 'Transmitting Request...' : 'Confirm Request'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default HospitalDetails;
