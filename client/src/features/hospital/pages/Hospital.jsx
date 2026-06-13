"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CircleUser, X, LogOut, Trash2, Mail, Phone, 
    Hospital as HospitalIcon, Shield, AlertTriangle, 
    ArrowRight, Activity, Zap, CheckCircle2, ShieldAlert 
} from "lucide-react";

import { CinematicFooter } from '../components/MotionFooter';
import { useHospital } from '../hooks/useHospital.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import Loading from '../components/Loading.jsx';
import LogoutConfirmDialog from '../../../components/LogoutConfirmDialog.jsx';
import CreateHospital from '../components/CreateHospital.jsx';

// ── Motion Animation Variants ──
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 18 }
    }
};

const cardHoverEffects = {
    hover: {
        y: -10,
        scale: 1.015,
        boxShadow: "0 20px 40px rgba(16, 185, 129, 0.12)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
    }
};

function Demo({ hospital, admin, onLogoutClick, isTab, onDeleteAccountClick }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            className={`relative w-full bg-slate-50/50 dark:bg-neutral-900/40 min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden ${isTab ? "pt-0" : ""}`}
        >
            {/* Background Glow Ambience */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(16,185,129,0.04)_0%,transparent_70%)]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(52,211,153,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(52,211,153,0.02)_0%,transparent_70%)]" />
                <div className="absolute inset-0 opacity-[0.25] dark:opacity-[0.05] mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            <main className="relative z-10 w-full flex flex-col items-center px-4 md:px-8">
                
                {/* ── Profile Toolbar ── */}
                {!isTab && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setIsProfileOpen(true)} 
                        className="mb-8 group absolute right-6 top-6 cursor-pointer z-40"
                    >
                        <span className="px-5 py-2.5 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border border-slate-200/50 dark:border-neutral-700/60 text-slate-700 dark:text-slate-200 hover:text-emerald-500 active:scale-95 text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <CircleUser className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            {admin?.name || "Hospital Admin"}
                        </span>
                    </motion.div>
                )}

                {/* ── Hero Section ── */}
                <motion.section 
                    variants={containerVariants}
                    className={`${isTab ? "py-14" : "min-h-[90vh] py-20"} flex flex-col items-center justify-center text-center w-full max-w-5xl`}
                >
                    <motion.div variants={itemVariants} className="relative inline-block">
                        <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-8 italic">
                            HEALTH<br />
                            <span className="text-emerald-600 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">AXIS AI</span>
                        </h1>
                        <motion.div 
                            animate={{ rotate: [10, 14, 10], y: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -top-6 -right-12 text-[9px] font-black text-white bg-emerald-600 px-3.5 py-2 rounded-2xl shadow-lg shadow-emerald-500/20 uppercase tracking-widest rotate-12"
                        >
                            Next-Gen
                        </motion.div>
                    </motion.div>

                    <motion.p 
                        variants={itemVariants} 
                        className="max-w-2xl text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12"
                    >
                        Convergence of clinical <span className="text-slate-900 dark:text-white font-bold border-b-2 border-emerald-500/20">Human Insight</span> and <span className="text-emerald-600 font-bold">Intelligent Precision</span>.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4.5">
                        <button className="px-10 py-4.5 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all active:scale-95 group flex items-center gap-2 cursor-pointer">
                            Initiate Diagnostic
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-10 py-4.5 bg-white dark:bg-neutral-800 border border-slate-200/50 dark:border-neutral-700/60 rounded-full text-slate-800 dark:text-slate-200 font-black uppercase tracking-widest text-[10px] shadow-xs hover:bg-slate-50 dark:hover:bg-neutral-750 transition-all active:scale-95 cursor-pointer">
                            Secure Cloud
                        </button>
                    </motion.div>
                </motion.section>

                {/* ── Bento Grid Content ── */}
                <motion.section 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative w-full max-w-5xl pb-32"
                >
                    <motion.div variants={itemVariants} className="mb-16 text-center">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3 italic">
                            {hospital?.data?.name || "Health Axis Central"}
                        </h2>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            Affiliated Global Healthcare Unit
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                        {/* Card 1: Precision */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover="hover"
                            variants={cardHoverEffects}
                            className="md:col-span-2 group relative overflow-hidden rounded-[32px] border border-slate-200/40 dark:border-neutral-800/80 bg-white dark:bg-slate-900 p-8 shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <Activity className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                                    Precision AI Diagnosis
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    Leveraging the world's most advanced clinical AI engines to run automated pre-screening triage with 99.9% accuracy parameters.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-2 text-emerald-600 dark:text-emerald-450 font-black text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                Network Status: Optimal <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </motion.div>

                        {/* Card 2: Emergency */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover="hover"
                            variants={cardHoverEffects}
                            className="md:col-span-2 group relative overflow-hidden rounded-[32px] border border-slate-200/40 dark:border-neutral-800/80 bg-white dark:bg-slate-900 p-8 shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-450 flex items-center justify-center mb-6 shadow-inner group-hover:bg-rose-500 group-hover:text-white transition-all">
                                    <Zap className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                                    Rapid Pulse 24/7 Response
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    Integrated real-time triage emergency warnings, immediately alerting trauma teams and dispatching mapping resources.
                                </p>
                            </div>
                            <div className="mt-8">
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-4/5 bg-rose-500 group-hover:w-full transition-all duration-1000" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 3: Global Units */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="md:col-span-1 group relative overflow-hidden rounded-[32px] border border-slate-200/40 dark:border-neutral-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between"
                        >
                            <div className="text-emerald-500 dark:text-emerald-450 mb-4 group-hover:rotate-6 transition-transform">
                                <HospitalIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic">
                                    12
                                </h4>
                                <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-wider mt-1">
                                    Global Units Active
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 4: Trust Call-out */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            className="md:col-span-3 group relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-600 to-teal-700 p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06)_0%,transparent_50%)] pointer-events-none" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                                    Connecting patient care with AI precision.
                                </h3>
                                <p className="text-emerald-50/80 text-xs sm:text-sm max-w-md font-medium">
                                    Join thousands of users who rely on HealthAxis's dashboard services for secure daily health operations.
                                </p>
                            </div>
                            <Link 
                                to="https://chat.whatsapp.com/L7OXSObUNZABMDiXjmzNym"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative z-10 px-6 py-3.5 bg-white text-emerald-700 hover:text-emerald-800 font-black uppercase tracking-wider text-[10px] rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                            >
                                Join WhatsApp
                            </Link>
                        </motion.div>

                    </div>
                </motion.section>

            </main>

            {/* ── Slide-Out Profile Side Panel ── */}
            <AnimatePresence>
                {isProfileOpen && (
                    <>
                        {/* Backdrop Overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 cursor-pointer"
                            onClick={() => setIsProfileOpen(false)}
                        />

                        {/* Sidebar Drawer */}
                        <motion.aside 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 26, stiffness: 220 }}
                            className="fixed top-0 right-0 h-screen w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-100 dark:border-neutral-850"
                        >
                            {/* Header Banner */}
                            <div className="relative h-44 bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center overflow-hidden shrink-0">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
                                <button 
                                    onClick={() => setIsProfileOpen(false)}
                                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
                                >
                                    <X size={16} strokeWidth={3} />
                                </button>
                                
                                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-xl absolute -bottom-10 overflow-hidden border-4 border-white dark:border-slate-800 z-10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    {admin?.avatar ? (
                                        <img src={admin.avatar} alt="Admin Profile" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <CircleUser size={48} strokeWidth={1.2} />
                                    )}
                                </div>
                            </div>

                            {/* Panel Information */}
                            <div className="px-6 pt-14 pb-4 flex-1 overflow-y-auto space-y-5">
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                                        {admin?.name || "Admin Account"}
                                    </h2>
                                    <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider mt-1.5 bg-emerald-50 dark:bg-emerald-950/20 inline-block px-3 py-1 rounded-full border border-emerald-100/50 dark:border-emerald-900/35">
                                        {admin?.role || "Hospital Administrator"}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-4.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100/40 dark:border-neutral-800/40">
                                        <div className="p-2 bg-white dark:bg-slate-850 rounded-xl shadow-xs text-slate-400">
                                            <Mail size={16} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Email Address</span>
                                            <span className="text-slate-700 dark:text-slate-350 font-semibold text-xs sm:text-sm truncate block">{admin?.email}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100/40 dark:border-neutral-800/40">
                                        <div className="p-2 bg-white dark:bg-slate-850 rounded-xl shadow-xs text-slate-400">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Contact Number</span>
                                            <span className="text-slate-700 dark:text-slate-350 font-semibold text-xs sm:text-sm block">{admin?.number || "Not provided"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100/40 dark:border-neutral-800/40">
                                        <div className="p-2 bg-white dark:bg-slate-850 rounded-xl shadow-xs text-slate-400">
                                            <HospitalIcon size={16} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Hospital Association</span>
                                            <span className="text-slate-700 dark:text-slate-350 font-semibold text-xs sm:text-sm truncate block">{hospital?.data?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-slate-100 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-slate-950/30 shrink-0 flex flex-col gap-3">
                                <button 
                                    onClick={onLogoutClick}
                                    className="w-full py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-neutral-750 rounded-2xl flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-neutral-750 transition-all active:scale-[0.98] cursor-pointer"
                                >
                                    <LogOut size={15} className="text-slate-450 shrink-0" />
                                    <span className="text-[10px] uppercase tracking-wider">Sign Out</span>
                                </button>
                                
                                <button 
                                    onClick={onDeleteAccountClick}
                                    className="w-full py-3.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-100/35 transition-all font-bold active:scale-[0.98] cursor-pointer"
                                >
                                    <Trash2 size={15} className="shrink-0" />
                                    <span className="text-[10px] uppercase tracking-wider">Delete Account</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Cinematic Footer */}
            {!isTab && (
                <CinematicFooter 
                    hospital={hospital}
                    admin={admin}
                />
            )}
        </motion.div>
    );
}

Demo.propTypes = {
    hospital: PropTypes.object,
    admin: PropTypes.object,
    onLogoutClick: PropTypes.func.isRequired,
    isTab: PropTypes.bool,
    onDeleteAccountClick: PropTypes.func.isRequired
};

const Hospital = ({ isTab = false }) => {
    const { handleGetHospital, handleGetHospitalAdmin } = useHospital();
    const { handleLogout, handleDeleteAccount } = useAuth();
    const { hospital, hospitalAdmin, loading } = useSelector((state) => state.hospital);
    
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isResubmitting, setIsResubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetHospital();
        handleGetHospitalAdmin();
    }, []);

    if (loading) {
        return <Loading />;
    }

    const status = hospital?.data?.status;
    const reason = hospital?.data?.rejectionReason;

    // Review Status Overlays (Animated with spring variants)
    if (hospital && hospitalAdmin && !isResubmitting) {
        if (status === 'PENDING') {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-neutral-900 p-6 relative z-50">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl border border-slate-100 dark:border-neutral-800/80 max-w-md w-full text-center"
                    >
                        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Shield className="w-8 h-8 animate-pulse" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Profile Under Review</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed font-semibold">
                            Your registration has been submitted and is currently being evaluated by our compliance panel. Estimated wait is 24-48 hours.
                        </p>
                        <button 
                            onClick={() => setShowLogoutDialog(true)} 
                            className="text-amber-600 hover:text-amber-700 font-bold uppercase tracking-widest text-[10px] cursor-pointer"
                        >
                            Sign Out
                        </button>
                    </motion.div>
                    <LogoutConfirmDialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} onConfirm={() => { handleLogout(); navigate("/"); }} />
                </div>
            );
        }
        if (status === 'REJECTED') {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-neutral-900 p-6 relative z-50">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl border border-slate-100 dark:border-neutral-800/80 max-w-md w-full text-center"
                    >
                        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Registration Rejected</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-4 leading-relaxed font-semibold">
                            Unfortunately, your profile credentials was not approved by the administrative committee.
                        </p>
                        <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/60 dark:border-rose-900/35 text-rose-600 dark:text-rose-400 p-4 rounded-2xl mb-8 text-xs text-left leading-relaxed font-semibold">
                            <strong className="block mb-1 text-rose-800 dark:text-rose-350">Reason for rejection:</strong> {reason || "No reason provided."}
                        </div>
                        <div className="flex flex-col gap-3.5">
                            <button 
                                onClick={() => setIsResubmitting(true)} 
                                className="w-full bg-slate-950 text-white dark:bg-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl hover:scale-103 transition-all cursor-pointer shadow-lg shadow-slate-950/10 dark:shadow-white/5"
                            >
                                Update & Resubmit
                            </button>
                            <button 
                                onClick={() => setShowLogoutDialog(true)} 
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold uppercase tracking-widest text-[10px] transition-colors cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                    <LogoutConfirmDialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} onConfirm={() => { handleLogout(); navigate("/"); }} />
                </div>
            );
        }
        if (status === 'SUSPENDED') {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-neutral-900 p-6 relative z-50">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl border border-slate-100 dark:border-neutral-800/80 max-w-md w-full text-center"
                    >
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <ShieldAlert className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Account Suspended</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed font-semibold">
                            Your clinic account privileges has been suspended due to policy violations. Please contact clinical support.
                        </p>
                        <button 
                            onClick={() => setShowLogoutDialog(true)} 
                            className="text-red-600 hover:text-red-700 font-bold uppercase tracking-widest text-[10px] cursor-pointer"
                        >
                            Sign Out
                        </button>
                    </motion.div>
                    <LogoutConfirmDialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} onConfirm={() => { handleLogout(); navigate("/"); }} />
                </div>
            );
        }
    }

    return (
        <div>
            {(!hospital || !hospitalAdmin || isResubmitting) ? (
                <CreateHospital isResubmitting={isResubmitting} />
            ) : (
                <Demo
                    hospital={hospital}
                    admin={hospitalAdmin}
                    onLogoutClick={() => setShowLogoutDialog(true)}
                    isTab={isTab}
                    onDeleteAccountClick={async () => {
                        if (window.confirm("Are you sure you want to permanently delete your account? This action is irreversible and will delete all associated hospital details, doctors, and appointments.")) {
                            try {
                                await handleDeleteAccount();
                                navigate("/");
                            } catch (err) {
                                alert(err?.response?.data?.message || err?.message || "Failed to delete account");
                            }
                        }
                    }}
                />
            )}

            <LogoutConfirmDialog
                isOpen={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                onConfirm={() => {
                    handleLogout();
                    navigate("/");
                }}
            />
        </div>
    );
};

Hospital.propTypes = {
    isTab: PropTypes.bool
};

export default Hospital;
