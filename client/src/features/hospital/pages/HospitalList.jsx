import React, { useState, useEffect } from 'react';
import { getAllHospitals } from '../services/hospital.api.js';
import { Building2, MapPin, Phone, Mail, ArrowRight, UserPlus, HeartPulse } from 'lucide-react';
import { DASHBOARD_TABS } from '../../../pages/dashboard.constants';
import HospitalDetails from './HospitalDetails';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    }
};

const HospitalList = ({ setActiveTab }) => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHospital, setSelectedHospital] = useState(null);

    useEffect(() => {
        console.log('Fetching hospitals...');
        getAllHospitals()
            .then(res => { 
                console.log('Hospital API response:', res.data);
                setHospitals(Array.isArray(res.data?.data) ? res.data.data : []);
                setLoading(false); 
            })
            .catch(err => { 
                console.error('Hospital fetch error:', err);
                setHospitals([]);
                setLoading(false); 
            });
    }, []);

    if (selectedHospital) {
        return <HospitalDetails hospital={selectedHospital} onBack={() => setSelectedHospital(null)} setActiveTab={setActiveTab} />;
    }

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 relative">
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)]" />
                </div>
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4 z-10"
                />
                <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-xs z-10 animate-pulse">
                    Decoding Registry...
                </p>
            </div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative w-full py-10 px-4 md:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900"
        >
            {/* Ambient background glow */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.04)_0%,transparent_70%)]" />
                <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                
                {/* Header Section */}
                <motion.div 
                    variants={itemVariants}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-8 md:p-10 rounded-[32px] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-slate-200/50 dark:border-neutral-800/50 gap-8 shadow-sm hover:shadow-md transition-all duration-350"
                >
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3.5 italic">
                            <Building2 className="text-indigo-600 dark:text-indigo-400 w-10 h-10 shrink-0" /> 
                            HOSPITAL <span className="text-indigo-650 bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">DIRECTORY</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg max-w-2xl leading-relaxed">
                            Discover premier healthcare institutions, review credentialed clinicians, and establish appointment pathways.
                        </p>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab(DASHBOARD_TABS.MY_HOSPITAL)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4.5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 flex items-center gap-3 transition-all shrink-0 cursor-pointer"
                    >
                        <UserPlus size={16} strokeWidth={2.5} /> Partner With Us
                    </motion.button>
                </motion.div>

                {/* Grid Section */}
                <motion.div 
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {Array.isArray(hospitals) && hospitals.length > 0 ? (
                        hospitals.map((h, idx) => (
                            <motion.div 
                                key={h._id}
                                variants={itemVariants}
                                whileHover={{
                                    y: -8,
                                    scale: 1.015,
                                    boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.15)",
                                    transition: { type: "spring", stiffness: 300, damping: 20 }
                                }}
                                className="bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md rounded-[32px] border border-slate-200/50 dark:border-neutral-800/80 p-7 shadow-sm transition-all duration-350 flex flex-col group cursor-pointer"
                                onClick={() => setSelectedHospital(h)}
                            >
                                {/* Media Banner Wrapper */}
                                <div className="h-44 bg-gradient-to-br from-indigo-50 to-blue-50/50 dark:from-neutral-850 dark:to-neutral-900/60 rounded-2xl mb-6 flex items-center justify-center border border-indigo-100/50 dark:border-neutral-800/60 group-hover:scale-[1.015] transition-transform overflow-hidden relative shadow-inner">
                                    <HeartPulse size={120} className="text-indigo-200/40 dark:text-neutral-800/40 absolute -right-6 -bottom-6 scale-150 rotate-12 transition-transform duration-700 group-hover:rotate-45" />
                                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-md border border-slate-100 dark:border-neutral-750 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        <Building2 size={32} />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {h.name}
                                </h2>
                                
                                <div className="space-y-3.5 text-slate-500 dark:text-slate-400 mb-8 flex-1 font-semibold text-xs sm:text-sm leading-relaxed">
                                    <p className="flex items-start gap-3.5">
                                        <MapPin size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" /> 
                                        <span>{h.address}, {h.city}</span>
                                    </p>
                                    <p className="flex items-center gap-3.5">
                                        <Phone size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0" /> 
                                        <span>{h.hospitalNumber}</span>
                                    </p>
                                    <p className="flex items-center gap-3.5 overflow-hidden">
                                        <Mail size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0" /> 
                                        <span className="truncate">{h.hospitalEmail}</span>
                                    </p>
                                </div>

                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedHospital(h);
                                    }}
                                    className="w-full bg-slate-50 dark:bg-neutral-850 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider text-[9px] py-4.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-slate-100 dark:border-neutral-850 shadow-xs"
                                >
                                    View Doctors <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center text-slate-400 dark:text-slate-500 font-bold text-lg bg-white/80 dark:bg-neutral-900/80 rounded-[32px] border border-slate-200/50 dark:border-neutral-800/50">
                            No hospitals registered at this time.
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default HospitalList;
