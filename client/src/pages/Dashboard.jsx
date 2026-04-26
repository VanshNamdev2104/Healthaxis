import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Sidebar, SidebarBody, SidebarLink } from "../components/Sidebar";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  Stethoscope,
  Calendar,
  Brain,
  Shield,
  BarChart3,
  Pill,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/slice/auth.slice.js";
import {
  DASHBOARD_TABS,
  STORAGE_KEYS,
  ROUTES,
  DEFAULT_USER,
} from "./dashboard.constants.js";
import Logo from "./dashboard/Logo.jsx";
import LogoIcon from "./dashboard/LogoIcon.jsx";
import DashboardContent from "./dashboard/DashboardContent.jsx";

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
    id: "chat",
    label: "AI Chat",
    icon: MessageCircle,
    isRoute: true,
    route: "/chat",
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
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    dispatch(logout());
    navigate(ROUTES.AUTH);
  }, [dispatch, navigate]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const sidebarLinks = tabConfig.map((tab) => ({
    label: tab.label,
    href: "#",
    onClick: () => {
      if (tab.isRoute) {
        navigate(tab.route);
      } else {
        handleTabChange(tab.id);
      }
    },
    icon: (
      <tab.icon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
  }));

  const logoutLink = {
    label: "Logout",
    href: "#",
    onClick: handleLogout,
    icon: (
      <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden" role="main">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}

            <nav className="mt-8 flex flex-col gap-2" aria-label="Main navigation">
              {sidebarLinks.map((link) => (
                <SidebarLink 
                  key={link.label} 
                  link={link} 
                  active={activeTab === tabConfig.find(tab => tab.label === link.label)?.id}
                />
              ))}
            </nav>
          </div>

          <div>
            <SidebarLink
              link={{
                label: user?.name || DEFAULT_USER.NAME,
                href: "#",
                onClick: () => handleTabChange(DASHBOARD_TABS.PROFILE),
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {user?.name?.charAt(0) || DEFAULT_USER.INITIAL}
                  </div>
                ),
              }}
            />
            <SidebarLink link={logoutLink} />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <DashboardContent activeTab={activeTab} user={user} />
    </div>
  );
}

Dashboard.propTypes = {
  children: PropTypes.node,
};

Dashboard.defaultProps = {
  children: null,
};