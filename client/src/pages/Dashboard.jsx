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
          <div className="text-white">
            <p>Welcome to HealthAxis Dashboard</p>
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