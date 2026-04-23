import React, { useState, useCallback, Suspense, lazy, memo } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/Sidebar";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  Stethoscope,
  Calendar,
  Pill,
  Brain,
  Shield,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/slice/auth.slice.js";
import Spinner from "../components/Spinner";

// Lazy load feature pages for better performance
const Hospital = lazy(() => import("../features/hospital/pages/Hospital"));
const DoctorsPage = lazy(() => import("../features/hospital/pages/DoctorsPage"));
const AppointmentPage = lazy(() => import("../features/hospital/pages/AppointmentPage"));
const DiseasePage = lazy(() => import("../features/health/pages/DiseasePage"));
const MedicinePage = lazy(() => import("../features/health/pages/MedicinePage")); 
const ProfilePage = lazy(() => import("../features/auth/pages/ProfilePage"));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("../features/admin/pages/AdminDashboard"));
const UserManagement = lazy(() => import("../features/admin/pages/UserManagement"));
const HospitalManagement = lazy(() => import("../features/admin/pages/HospitalManagement"));
const DoctorManagement = lazy(() => import("../features/admin/pages/DoctorManagement"));

// Tab configuration constants
const DASHBOARD_TABS = {
  DASHBOARD: "Dashboard",
  HOSPITALS: "Hospitals",
  DOCTORS: "Doctors",
  APPOINTMENTS: "Appointments",
  DISEASES: "Diseases",
  MEDICINES: "Medicines",
  SETTINGS: "Settings",
  PROFILE: "Profile",
  // Admin tabs
  ADMIN_DASHBOARD: "AdminDashboard",
  USER_MANAGEMENT: "UserManagement",
  HOSPITAL_MANAGEMENT: "HospitalManagement",
  DOCTOR_MANAGEMENT: "DoctorManagement",
};

const USER_TAB_CONFIG = [
  {
    id: DASHBOARD_TABS.DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: DASHBOARD_TABS.HOSPITALS,
    label: "Hospitals",
    icon: Users,
  },
  {
    id: DASHBOARD_TABS.DOCTORS,
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    id: DASHBOARD_TABS.APPOINTMENTS,
    label: "Appointments",
    icon: Calendar,
  },
  {
    id: DASHBOARD_TABS.DISEASES,
    label: "Diseases",
    icon: Brain,
  },
  {
    id: DASHBOARD_TABS.MEDICINES,
    label: "Medicines",
    icon: Pill,
  },
  {
    id: DASHBOARD_TABS.SETTINGS,
    label: "Settings",
    icon: Settings,
  },
];

const ADMIN_TAB_CONFIG = [
  {
    id: DASHBOARD_TABS.ADMIN_DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: DASHBOARD_TABS.USER_MANAGEMENT,
    label: "Users",
    icon: Users,
  },
  {
    id: DASHBOARD_TABS.HOSPITAL_MANAGEMENT,
    label: "Hospitals",
    icon: Users,
  },
  {
    id: DASHBOARD_TABS.DOCTOR_MANAGEMENT,
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    id: DASHBOARD_TABS.SETTINGS,
    label: "Settings",
    icon: Settings,
  },
];

const TAB_CONFIG = USER_TAB_CONFIG;

const WELCOME_FEATURES = [
  {
    icon: Users,
    color: "text-indigo-500",
    title: "Hospital Network",
    description: "Manage healthcare facilities and admin",
  },
  {
    icon: Stethoscope,
    color: "text-green-500",
    title: "Medical Professionals",
    description: "Doctor profiles and scheduling",
  },
  {
    icon: Calendar,
    color: "text-orange-500",
    title: "Appointments",
    description: "Patient bookings and management",
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Determine tab config based on user role
  const tabConfig = user?.role === "admin" ? ADMIN_TAB_CONFIG : USER_TAB_CONFIG;
  const initialTab = user?.role === "admin" ? DASHBOARD_TABS.ADMIN_DASHBOARD : DASHBOARD_TABS.DASHBOARD;

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/Auth");
  }, [dispatch, navigate]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const sidebarLinks = tabConfig.map((tab) => ({
    label: tab.label,
    href: "#",
    onClick: () => handleTabChange(tab.id),
    icon: (
      <tab.icon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  }));

  const logoutLink = {
    label: "Logout",
    href: "#",
    onClick: handleLogout,
    icon: (
      <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}

            <div className="mt-8 flex flex-col gap-2">
              {sidebarLinks.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link} 
                  active={activeTab === tabConfig[idx].id}
                />
              ))}
            </div>
          </div>

          <div>
            <SidebarLink
              link={{
                label: user?.name || "Profile",
                href: "#",
                onClick: () => handleTabChange(DASHBOARD_TABS.PROFILE),
                icon: (
                  <div className="h-7 w-7 flex-shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <DashboardContent activeTab={activeTab} user={user} />
    </div>
  );
}

const Logo = memo(() => {
  return (
    <a
      href="/"
      className="flex items-center gap-2 text-sm text-white py-1 relative z-20"
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30">
        <Pill className="w-4 h-4 text-cyan-400" />
      </div>

      {/* Text */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold tracking-wide text-black dark:text-white"
      >
        HealthAxis
      </motion.span>
    </a>
  );
});

Logo.displayName = "Logo";

const LogoIcon = memo(() => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </a>
  );
});

LogoIcon.displayName = "LogoIcon";

// Welcome Feature Card Component
const FeatureCard = memo(({ feature, index }) => {
  const { icon: Icon, color, title, description } = feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{
        y: -10,
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-neutral-700 dark:to-neutral-800 backdrop-blur-xl p-8 rounded-2xl border border-white/50 dark:border-neutral-600/50 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10">
        <motion.div
          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition leading-relaxed">
          {description}
        </p>

        {/* Animated corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";

// Dashboard Welcome Section Component
const DashboardWelcome = memo(({ user }) => {
  const welcomeContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const welcomeItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };

  return (
    <motion.div
      variants={welcomeContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-neutral-900 dark:via-slate-800 dark:to-neutral-900 p-6 md:p-12"
    >
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Icon Section */}
        <motion.div
          variants={welcomeItemVariants}
          className="flex justify-center mb-8"
        >
          <motion.div
            className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            whileHover={{ scale: 1.1, rotate: 0 }}
          >
            <motion.svg
              className="w-16 h-16 md:w-20 md:h-20 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Title Section */}
        <motion.div variants={welcomeItemVariants} className="text-center mb-8">
          <motion.h1
            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-indigo-200 dark:to-cyan-200 bg-clip-text text-transparent mb-4 tracking-tight leading-tight"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Welcome to HealthAxis
          </motion.h1>

          <motion.p
            variants={welcomeItemVariants}
            className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Your comprehensive healthcare management platform. Access hospitals, doctors, appointments, diseases, medicines and more from this central dashboard.
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={welcomeItemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
        >
          {WELCOME_FEATURES.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} index={idx} />
          ))}
        </motion.div>

        {/* Quick Stats Section */}
        <motion.div
          variants={welcomeItemVariants}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl text-white mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Healthcare Facilities", value: "500+", icon: "🏥" },
              { label: "Expert Doctors", value: "2000+", icon: "👨‍⚕️" },
              { label: "Active Users", value: "50K+", icon: "👥" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="text-5xl md:text-6xl mb-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div className="text-4xl md:text-5xl font-black mb-2">
                  {stat.value}
                </motion.div>
                <div className="text-white/90 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Info Footer */}
        <motion.div
          variants={welcomeItemVariants}
          className="text-center"
        >
          <motion.div
            className="inline-block bg-white dark:bg-neutral-800 rounded-full px-8 py-4 shadow-lg border border-gray-200 dark:border-neutral-700"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">Member since</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {user?.role?.toUpperCase() || "USER"}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
});

DashboardWelcome.displayName = "DashboardWelcome";

// Tab Content Renderer Component
const TabContentRenderer = memo(({ activeTab, user }) => {
  const contentMap = {
    [DASHBOARD_TABS.DASHBOARD]: <DashboardWelcome user={useSelector((state) => state.auth.user)} />,
    [DASHBOARD_TABS.HOSPITALS]: (
      <Suspense fallback={<LoadingFallback />}>
        <Hospital />
      </Suspense>
    ),
    [DASHBOARD_TABS.DOCTORS]: (
      <Suspense fallback={<LoadingFallback />}>
        <DoctorsPage />
      </Suspense>
    ),
    [DASHBOARD_TABS.APPOINTMENTS]: (
      <Suspense fallback={<LoadingFallback />}>
        <AppointmentPage />
      </Suspense>
    ),
    [DASHBOARD_TABS.DISEASES]: (
      <Suspense fallback={<LoadingFallback />}>
        <DiseasePage />
      </Suspense>
    ),
    [DASHBOARD_TABS.MEDICINES]: (
      <Suspense fallback={<LoadingFallback />}>
        <MedicinePage />
      </Suspense>
    ),
    [DASHBOARD_TABS.SETTINGS]: <SettingsPage />,
    [DASHBOARD_TABS.PROFILE]: (
      <Suspense fallback={<LoadingFallback />}>
        <ProfilePage />
      </Suspense>
    ),
    // Admin tabs
    [DASHBOARD_TABS.ADMIN_DASHBOARD]: (
      <Suspense fallback={<LoadingFallback />}>
        <AdminDashboard />
      </Suspense>
    ),
    [DASHBOARD_TABS.USER_MANAGEMENT]: (
      <Suspense fallback={<LoadingFallback />}>
        <UserManagement />
      </Suspense>
    ),
    [DASHBOARD_TABS.HOSPITAL_MANAGEMENT]: (
      <Suspense fallback={<LoadingFallback />}>
        <HospitalManagement />
      </Suspense>
    ),
    [DASHBOARD_TABS.DOCTOR_MANAGEMENT]: (
      <Suspense fallback={<LoadingFallback />}>
        <DoctorManagement />
      </Suspense>
    ),
  };

  return contentMap[activeTab] || contentMap[user?.role === "admin" ? DASHBOARD_TABS.ADMIN_DASHBOARD : DASHBOARD_TABS.DASHBOARD];
});

TabContentRenderer.displayName = "TabContentRenderer";

// Loading Fallback Component
const LoadingFallback = memo(() => (
  <div className="w-full h-screen flex items-center justify-center">
    <Spinner />
  </div>
));

LoadingFallback.displayName = "LoadingFallback";

// Settings Page Placeholder
const SettingsPage = memo(() => (
  <motion.div
    className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 p-6 md:p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-3">
          Settings
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Manage your preferences and configurations
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: "🎨", title: "Appearance", description: "Customize your theme and interface" },
          { icon: "🔔", title: "Notifications", description: "Control your notification preferences" },
          { icon: "🔒", title: "Privacy", description: "Manage your privacy settings" },
          { icon: "⚙️", title: "Preferences", description: "Configure your application preferences" },
        ].map((setting, idx) => (
          <motion.div
            key={idx}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-700 cursor-pointer group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{
              y: -5,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="text-4xl mb-3"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {setting.icon}
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              {setting.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {setting.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
        <p>More settings options will be available in the next update.</p>
      </motion.div>
    </motion.div>
  </motion.div>
));

SettingsPage.displayName = "SettingsPage";

// Main Dashboard Content Component
const DashboardContent = memo(({ activeTab, user }) => {
  return (
    <div className="flex flex-1 w-full overflow-y-auto bg-gray-50 dark:bg-neutral-900">
      <div className="flex flex-col flex-1 w-full min-h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            className="w-full"
          >
            <TabContentRenderer activeTab={activeTab} user={user} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

DashboardContent.displayName = "DashboardContent";