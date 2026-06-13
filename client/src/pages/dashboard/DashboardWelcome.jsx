import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useHospital } from "../../features/hospital/hooks/useHospital.js";
import { DASHBOARD_TABS, DEFAULT_USER } from "../dashboard.constants.js";
import HealthScoreCard from "../../features/hospital/components/HealthScoreCard.jsx";
import RecommendedDoctors from "../../features/hospital/components/RecommendedDoctors.jsx";
import { getTranslation } from "../../utils/translate.js";
import {
  Users,
  Stethoscope,
  Calendar,
  Building2,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Activity,
  Heart,
  Clock,
  MapPin,
  ShieldAlert,
  ClipboardList,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";

const DashboardWelcome = memo(({ user, setActiveTab }) => {
  const navigate = useNavigate();
  const { 
    handleGetHospital, 
    handleGetUserAppointments, 
    handleGetAllDoctors, 
    handleGetAllAppointments 
  } = useHospital();

  const { hospital } = useSelector((state) => state.hospital);
  const { appointments, loading: appLoading } = useSelector((state) => state.appointment);
  const { doctors } = useSelector((state) => state.doctor);

  useEffect(() => {
    if (user?.role === "user") {
      handleGetUserAppointments();
    } else if (user?.role === "hospitalAdmin") {
      handleGetHospital();
    }
  }, [user?.role, handleGetHospital, handleGetUserAppointments]);

  const hospitalId = hospital?.data?._id;

  useEffect(() => {
    if (user?.role === "hospitalAdmin" && hospitalId) {
      handleGetAllDoctors(hospitalId);
      handleGetAllAppointments(hospitalId);
    }
  }, [user?.role, hospitalId, handleGetAllDoctors, handleGetAllAppointments]);

  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("healthaxis_settings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.language) {
          setLang(settings.language);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    let key = "good_evening";
    if (hour < 12) key = "good_morning";
    else if (hour < 18) key = "good_afternoon";
    return getTranslation(key, lang);
  };

  // ──── ANIMATIONS ────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // ──── DYNAMIC STATS ────
  const userStats = [
    {
      id: "total",
      label: getTranslation("total_bookings", lang),
      value: appointments?.length || 0,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgLight: "bg-blue-50 dark:bg-blue-950/20",
      icon: ClipboardList,
    },
    {
      id: "approved",
      label: getTranslation("approved_visits", lang),
      value: appointments?.filter((a) => a.status === "approved" || a.status === "APPROVED").length || 0,
      color: "from-emerald-400 to-teal-600",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/20",
      icon: Heart,
    },
    {
      id: "pending",
      label: getTranslation("pending_reviews", lang),
      value: appointments?.filter((a) => a.status === "pending" || a.status === "PENDING").length || 0,
      color: "from-amber-400 to-orange-600",
      textColor: "text-amber-600 dark:text-amber-400",
      bgLight: "bg-amber-50 dark:bg-amber-950/20",
      icon: Clock,
    },
  ];

  const adminStats = [
    {
      id: "docs",
      label: getTranslation("active_doctors", lang),
      value: doctors?.length || 0,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-600 dark:text-purple-400",
      bgLight: "bg-purple-50 dark:bg-purple-950/20",
      icon: Stethoscope,
    },
    {
      id: "total_bookings",
      label: getTranslation("total_bookings", lang),
      value: appointments?.length || 0,
      color: "from-blue-500 to-cyan-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgLight: "bg-blue-50 dark:bg-blue-950/20",
      icon: ClipboardList,
    },
    {
      id: "pending_approvals",
      label: getTranslation("pending_approvals", lang),
      value: appointments?.filter((a) => a.status === "pending" || a.status === "PENDING").length || 0,
      color: "from-rose-400 to-red-600",
      textColor: "text-rose-600 dark:text-rose-400",
      bgLight: "bg-rose-50 dark:bg-rose-950/20",
      icon: Clock,
    },
  ];

  const stats = user?.role === "hospitalAdmin" ? adminStats : userStats;

  // ──── NAVIGATION ACTIONS ────
  const userActions = [
    {
      title: getTranslation("find_hospitals", lang),
      desc: lang === "hi" ? "आस-पास के शीर्ष अस्पतालों और स्वास्थ्य क्लीनिकों को खोजें।" : lang === "es" ? "Explore los mejores centros y clínicas médicas cercanos." : "Explore top healthcare clinics & hospitals nearby.",
      icon: Building2,
      color: "from-cyan-500 to-blue-600",
      action: () => setActiveTab(DASHBOARD_TABS.HOSPITALS),
    },
    {
      title: getTranslation("ai_chat", lang),
      desc: lang === "hi" ? "लक्षणों और देखभाल के बारे में हमारे उन्नत चिकित्सा एआई से पूछें।" : lang === "es" ? "Consulte a nuestra IA sobre síntomas y cuidados médicos." : "Ask our advanced medical AI about symptoms & care.",
      icon: MessageSquare,
      color: "from-indigo-500 to-purple-600",
      action: () => navigate("/chat"),
    },
    {
      title: getTranslation("disease_registry", lang),
      desc: lang === "hi" ? "लक्षणों, ट्रिगर्स और निदान का अनुसंधान करें।" : lang === "es" ? "Investigue síntomas, desencadenantes y diagnósticos." : "Research symptoms, triggers, and diagnostics.",
      icon: ShieldAlert,
      color: "from-orange-400 to-pink-600",
      action: () => setActiveTab(DASHBOARD_TABS.DISEASES),
    },
    {
      title: getTranslation("medicine_directory", lang),
      desc: lang === "hi" ? "नुस्खे, खुराक और दुष्प्रभावों को ट्रैक करें।" : lang === "es" ? "Consulte recetas, dosis y efectos secundarios." : "Track prescriptions, dosage, and side-effects.",
      icon: Activity,
      color: "from-teal-400 to-emerald-600",
      action: () => setActiveTab(DASHBOARD_TABS.MEDICINES),
    },
  ];

  const adminActions = [
    {
      title: getTranslation("manage_doctors", lang),
      desc: lang === "hi" ? "चिकित्सा विशेषज्ञों के शेड्यूल जोड़ें या कॉन्फ़िगर करें।" : lang === "es" ? "Añadir o configurar horarios de especialistas médicos." : "Add or configure medical specialists schedules.",
      icon: Stethoscope,
      color: "from-purple-500 to-indigo-600",
      action: () => setActiveTab(DASHBOARD_TABS.DOCTORS),
    },
    {
      title: getTranslation("review_appointments", lang),
      desc: lang === "hi" ? "लंबित रोगी स्लॉट स्वीकृत, पुनर्निर्धारित या देखें।" : lang === "es" ? "Aprobar, reprogramar o ver citas pendientes." : "Approve, reschedule or view pending patient slots.",
      icon: Calendar,
      color: "from-blue-500 to-cyan-600",
      action: () => setActiveTab(DASHBOARD_TABS.APPOINTMENTS),
    },
    {
      title: getTranslation("hospital_profile", lang),
      desc: lang === "hi" ? "पंजीकरण विवरण, पता और संपर्क अपडेट करें।" : lang === "es" ? "Actualice detalles de registro, dirección y contacto." : "Update registration details, address & contact.",
      icon: Building2,
      color: "from-emerald-500 to-teal-600",
      action: () => setActiveTab(DASHBOARD_TABS.MY_HOSPITAL),
    },
    {
      title: getTranslation("account_settings", lang),
      desc: lang === "hi" ? "प्राथमिकताओं और सुरक्षा कॉन्फ़िगरेशन को अनुकूलित करें।" : lang === "es" ? "Personalice preferencias y configuraciones de seguridad." : "Customize preferences and security configurations.",
      icon: Users,
      color: "from-gray-500 to-slate-700",
      action: () => setActiveTab(DASHBOARD_TABS.SETTINGS),
    },
  ];

  const actions = user?.role === "hospitalAdmin" ? adminActions : userActions;
  const recentBookingsToShow = appointments?.slice(0, 3) || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full min-h-screen bg-slate-50 dark:bg-neutral-900 p-6 md:p-10 select-none transition-colors duration-300"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* 1. WELCOME HERO CARD */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-8 md:p-12 shadow-2xl"
        >
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {getTranslation("live_portal", lang)}
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                {getGreeting()}, <br />
                <span className="bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent italic">
                  {user?.name || DEFAULT_USER.NAME}
                </span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base font-medium max-w-xl">
                {user?.role === "hospitalAdmin"
                  ? (lang === "hi" 
                      ? `अपने चिकित्सा संस्थान (${hospital?.data?.name || "facility"}) के लिए क्लिनिक रिकॉर्ड, रोगी बुकिंग प्रबंधित करें और चिकित्सकों की स्थिति अपडेट करें।`
                      : lang === "es"
                      ? `Administre los registros de la clínica, las reservas de pacientes y actualice el estado del personal médico para ${hospital?.data?.name || "su centro"}.`
                      : `Manage clinic records, patient bookings, and update practitioner status for ${hospital?.data?.name || "your facility"}.`)
                  : (lang === "hi"
                      ? "आगामी स्वास्थ्य परामर्श की निगरानी करें, स्मार्ट एआई सहायक से परामर्श करें, या बीमारियों और दवाओं का शोध करें।"
                      : lang === "es"
                      ? "Monitoree las consultas médicas programadas, consulte al asistente inteligente de IA o investigue enfermedades y medicinas."
                      : "Monitor upcoming health consults, consult the smart AI assistant, or research conditions and medicines.")
                }
              </p>
            </div>

            {/* Quick Profile Widget */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-3xl self-stretch md:self-auto justify-center">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name || "User profile"}
                  className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/20"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20">
                  {user?.name?.charAt(0)?.toUpperCase() || DEFAULT_USER.INITIAL}
                </div>
              )}
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{getTranslation("authorized_account", lang)}</p>
                <p className="font-extrabold text-sm text-slate-100">{user?.role?.toUpperCase() || DEFAULT_USER.ROLE}</p>
                <p className="text-xs text-slate-300 truncate max-w-[150px]">{user?.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* HEALTH SCORE CARD (FOR USER ONLY) */}
        {user?.role === "user" && (
          <motion.div variants={itemVariants}>
            <HealthScoreCard />
          </motion.div>
        )}

        {/* 2. DYNAMIC METRICS CARDS */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white dark:bg-neutral-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200/55 dark:border-neutral-700/50 shadow-md hover:shadow-xl flex items-center justify-between transition-all"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bgLight} ${stat.textColor}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 3. DYNAMIC CONTENT SPLIT: BOOKINGS vs SHORTCUTS */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEFT: Short Action Cards Grid (3 Cols on large) */}
          <div className="lg:col-span-3 space-y-6">
            <motion.h3 
              variants={itemVariants} 
              className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2"
            >
              <Activity className="text-indigo-500 w-6 h-6" />
              {getTranslation("portal_actions", lang)}
            </motion.h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    variants={itemVariants}
                    onClick={action.action}
                    whileHover={{ 
                      y: -6, 
                      scale: 1.02,
                      boxShadow: "0 20px 30px rgba(99, 102, 241, 0.12)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 border border-gray-200/60 dark:border-neutral-700/60 p-6 shadow-md hover:shadow-xl transition-all cursor-pointer"
                  >
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-cyan-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-md`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 text-indigo-500 dark:text-indigo-400 transition-all duration-300">
                          <ArrowUpRight className="w-5 h-5" />
                        </span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 leading-relaxed">
                          {action.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Recent Bookings Panel (2 Cols on large) */}
          <div className="lg:col-span-2 space-y-6">
            <motion.h3 
              variants={itemVariants} 
              className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2"
            >
              <Calendar className="text-indigo-500 w-6 h-6" />
              {user?.role === "hospitalAdmin" ? getTranslation("incoming_bookings", lang) : getTranslation("my_appointments", lang)}
            </motion.h3>

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-800/80 backdrop-blur-md rounded-[32px] p-6 border border-gray-200/60 dark:border-neutral-700/60 shadow-md space-y-4 min-h-[350px] flex flex-col"
            >
              {appLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-400">Fetching records...</p>
                </div>
              ) : recentBookingsToShow.length > 0 ? (
                <div className="space-y-4 flex-1">
                  {recentBookingsToShow.map((app) => (
                    <motion.div
                      key={app._id}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-700/35 border border-slate-100 dark:border-neutral-700/50 hover:bg-slate-100 dark:hover:bg-neutral-700/55 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {user?.role === "hospitalAdmin"
                          ? app.patientName?.charAt(0)?.toUpperCase() || "P"
                          : app.doctor?.name?.charAt(0)?.toUpperCase() || "D"
                        }
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate">
                          {user?.role === "hospitalAdmin" ? app.patientName : `Dr. ${app.doctor?.name || "Doctor"}`}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                          {user?.role === "hospitalAdmin" 
                            ? `Age: ${app.age || "N/A"} • ${app.gender || "Gender"}`
                            : app.doctor?.specialization || "General Medicine"
                          }
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{app.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{app.time}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        app.status?.toLowerCase() === "approved"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : app.status?.toLowerCase() === "rejected"
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                      }`}>
                        {app.status}
                      </span>
                    </motion.div>
                  ))}
                  <button 
                    onClick={() => setActiveTab(DASHBOARD_TABS.APPOINTMENTS)}
                    className="w-full py-3.5 text-center text-xs font-black text-indigo-500 dark:text-indigo-400 bg-slate-50 dark:bg-neutral-700/35 hover:bg-slate-100 dark:hover:bg-neutral-700/50 rounded-2xl transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    View All Bookings <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-neutral-700/30 flex items-center justify-center text-2xl">
                    📅
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">{getTranslation("no_appointments", lang)}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-1 max-w-[200px] leading-relaxed">
                      {user?.role === "hospitalAdmin"
                        ? (lang === "hi" 
                            ? "वर्तमान में आपके क्लिनिक के लिए कोई आने वाली बुकिंग पंजीकृत नहीं है।" 
                            : lang === "es"
                            ? "Actualmente no hay reservas entrantes registradas para su clínica."
                            : "Currently there are no incoming bookings registered for your clinic.")
                        : (lang === "hi"
                            ? "अपॉइंटमेंट शेड्यूल करना शुरू करें या नेटवर्क में अस्पतालों की तलाश करें।"
                            : lang === "es"
                            ? "Comience a programar citas o busque centros médicos en la red."
                            : "Start scheduling appointments or search facilities in the network.")
                      }
                    </p>
                  </div>
                  {user?.role === "user" && (
                    <button
                      onClick={() => setActiveTab(DASHBOARD_TABS.HOSPITALS)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-full transition hover:scale-105 shadow-md shadow-indigo-600/25"
                    >
                      Book First Slot
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>

        </div>

        {/* RECOMMENDED DOCTORS (FOR USER ONLY) */}
        {user?.role === "user" && (
          <motion.div variants={itemVariants}>
            <RecommendedDoctors />
          </motion.div>
        )}

      </div>
    </motion.div>
  );
});

DashboardWelcome.displayName = "DashboardWelcome";

DashboardWelcome.propTypes = {
  user: PropTypes.object,
  setActiveTab: PropTypes.func.isRequired,
};

DashboardWelcome.defaultProps = {
  user: null,
};

export default DashboardWelcome;
