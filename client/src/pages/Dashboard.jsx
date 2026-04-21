import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/Sidebar";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  Stethoscope,
  Calendar,
  Pill,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/slice/auth.slice.js";
import Hospital from "../features/hospital/pages/Hospital";
import DoctorsPage from "../features/hospital/pages/DoctorsPage";
import AppointmentPage from "../features/hospital/pages/AppointmentPage";
import Disease from "../components/Disease";
import Medicine from "../components/Medicine";
import ProfilePage from "../features/auth/pages/ProfilePage";

export function Dashboard() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/Auth");
  };

  const allLinks = [
    {
      label: "Dashboard",
      href: "#",
      onClick: () => setActiveTab("Dashboard"),
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Hospitals",
      href: "#",
      onClick: () => setActiveTab("Hospitals"),
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Doctors",
      href: "#",
      onClick: () => setActiveTab("Doctors"),
      icon: (
        <Stethoscope className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Appointments",
      href: "#",
      onClick: () => setActiveTab("Appointments"),
      icon: (
        <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Diseases",
      href: "#",
      onClick: () => setActiveTab("Diseases"),
      icon: (
        <Pill className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Medicines",
      href: "#",
      onClick: () => setActiveTab("Medicines"),
      icon: (
        <Pill className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      onClick: () => setActiveTab("Settings"),
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      onClick: handleLogout,
      icon: (
        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const links = allLinks.filter(link => !link.roles || link.roles.includes(user?.role));

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} active={activeTab === (link.tabKey || link.label)} />
              ))}
            </div>
          </div>

          <div>
            <SidebarLink
              link={{
                label: user?.name || "Profile",
                href: "#",
                onClick: () => setActiveTab("Profile"),
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
      <DashboardContent activeTab={activeTab} />
    </div>
  );
}

export const Logo = () => {
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
};


export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </a>
  );
};

// Dashboard Content Component
const DashboardContent = ({ activeTab }) => {
  return (
    <div className="flex flex-1 w-full overflow-y-auto">
      <div className="flex flex-col flex-1 w-full min-h-full">
        {activeTab === "Dashboard" && (
          <div className="p-12 text-center min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-800 rounded-3xl shadow-2xl">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6 tracking-tight">
              Welcome to HealthAxis
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12 leading-relaxed">
              Your comprehensive healthcare management platform. Access hospitals, doctors, appointments, 
              diseases, medicines and more from this central dashboard.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
              <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-xl hover:scale-105 transition-all">
                <Users className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hospital Network</h3>
                <p className="text-gray-600 dark:text-gray-400">Manage healthcare facilities and admin</p>
              </div>
              <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-xl hover:scale-105 transition-all">
                <Stethoscope className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Medical Professionals</h3>
                <p className="text-gray-600 dark:text-gray-400">Doctor profiles and scheduling</p>
              </div>
              <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-xl hover:scale-105 transition-all">
                <Calendar className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Appointments</h3>
                <p className="text-gray-600 dark:text-gray-400">Patient bookings and management</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}</p>
              <p>Role: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.role || 'User'}</span></p>
            </div>
          </div>
        )}

        {activeTab === "Hospitals" && (
          <div className="animate-in slide-in-from-right duration-500">
            <Hospital />
          </div>
        )}

        {activeTab === "Doctors" && (
          <div className="animate-in slide-in-from-right duration-500">
            <DoctorsPage />
          </div>
        )}

        {activeTab === "Appointments" && (
          <div className="animate-in slide-in-from-right duration-500">
            <AppointmentPage />
          </div>
        )}

        {activeTab === "Diseases" && (
          <div className="animate-in slide-in-from-right duration-500">
            <Disease />
          </div>
        )}

        {activeTab === "Medicines" && (
          <div className="animate-in slide-in-from-right duration-500">
            <Medicine />
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="animate-in slide-in-from-right duration-500">
            <div className="text-white"><p>Settings Page</p></div>
          </div>
        )}

        {activeTab === "Profile" && (
          <div className="animate-in slide-in-from-right duration-500">
            <ProfilePage />
          </div>
        )}
      </div>
    </div>
  );
};