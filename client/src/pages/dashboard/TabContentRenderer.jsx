import React, { memo, Suspense } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { lazy } from "react";
import { DASHBOARD_TABS } from "../dashboard.constants.js";
import ErrorBoundary from "../../components/ErrorBoundary";
import LoadingFallback from "./LoadingFallback.jsx";
import DashboardWelcome from "./DashboardWelcome.jsx";
import SettingsPage from "./SettingsPage.jsx";

// Lazy load feature pages
const Hospital = lazy(() => import("../../features/hospital/pages/Hospital"));
const DoctorsPage = lazy(() => import("../../features/hospital/pages/DoctorsPage"));
const AppointmentPage = lazy(() => import("../../features/hospital/pages/AppointmentPage"));
const DiseasePage = lazy(() => import("../../features/health/pages/DiseasePage"));
const MedicinePage = lazy(() => import("../../features/health/pages/MedicinePage")); 
const ProfilePage = lazy(() => import("../../features/auth/pages/ProfilePage"));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("../../features/admin/pages/AdminDashboard"));
const UserManagement = lazy(() => import("../../features/admin/pages/UserManagement"));
const HospitalManagement = lazy(() => import("../../features/admin/pages/HospitalManagement"));
const DoctorManagement = lazy(() => import("../../features/admin/pages/DoctorManagement"));

const TabContentRenderer = memo(({ activeTab, user }) => {
  const contentMap = {
    [DASHBOARD_TABS.DASHBOARD]: <DashboardWelcome user={useSelector((state) => state.auth.user)} />,
    [DASHBOARD_TABS.HOSPITALS]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Hospital />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.DOCTORS]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <DoctorsPage />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.APPOINTMENTS]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <AppointmentPage />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.DISEASES]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <DiseasePage />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.MEDICINES]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <MedicinePage />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.SETTINGS]: <SettingsPage />,
    [DASHBOARD_TABS.PROFILE]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <ProfilePage />
        </Suspense>
      </ErrorBoundary>
    ),
    // Admin tabs
    [DASHBOARD_TABS.ADMIN_DASHBOARD]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <AdminDashboard />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.USER_MANAGEMENT]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <UserManagement />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.HOSPITAL_MANAGEMENT]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <HospitalManagement />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.DOCTOR_MANAGEMENT]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <DoctorManagement />
        </Suspense>
      </ErrorBoundary>
    ),
  };

  return contentMap[activeTab] || contentMap[user?.role === "admin" ? DASHBOARD_TABS.ADMIN_DASHBOARD : DASHBOARD_TABS.DASHBOARD];
});

TabContentRenderer.displayName = "TabContentRenderer";

TabContentRenderer.propTypes = {
  activeTab: PropTypes.string.isRequired,
  user: PropTypes.object,
};

TabContentRenderer.defaultProps = {
  user: null,
};

export default TabContentRenderer;
