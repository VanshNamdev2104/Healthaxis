import React, { memo, Suspense } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { lazy } from "react";
import { DASHBOARD_TABS } from "../dashboard.constants.js";
import ErrorBoundary from "../../components/ErrorBoundary";
import LoadingFallback from "./LoadingFallback.jsx";
import DashboardWelcome from "./DashboardWelcome.jsx";
import SettingsPage from "./SettingsPage.jsx";
import AccessDenied from "./components/AccessDenied.jsx";
// Lazy load feature pages
const Hospital = lazy(() => import("../../features/hospital/pages/Hospital"));
const HospitalList = lazy(() => import("../../features/hospital/pages/HospitalList"));
const DoctorsPage = lazy(() => import("../../features/hospital/pages/DoctorsPage"));
const AppointmentPage = lazy(() => import("../../features/hospital/pages/AppointmentPage"));
const DiseasePage = lazy(() => import("../../features/health/pages/DiseasePage"));
const MedicinePage = lazy(() => import("../../features/health/pages/MedicinePage"));
const ProfilePage = lazy(() => import("../../features/auth/pages/ProfilePage"));
const Appointments_user = lazy(() => import("../../features/user/pages/Appointments_user"));
const Disease_user = lazy(() => import("../../features/user/pages/Disease_user"));
const Medicine_user = lazy(() => import("../../features/user/pages/Medicine_user"));
const ReportUploadPage = lazy(() => import("../../features/hospital/pages/ReportUploadPage"));
const HealthTimeline = lazy(() => import("../../features/hospital/pages/HealthTimeline"));
const VideoConsultation = lazy(() => import("../../features/hospital/pages/VideoConsultation"));
const HospitalAnalytics = lazy(() => import("../../features/hospital/pages/HospitalAnalytics"));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("../../features/admin/pages/AdminDashboard"));
const VerificationQueue = lazy(() => import("../../features/admin/pages/VerificationQueue"));
const UserManagement = lazy(() => import("../../features/admin/pages/UserManagement"));
const HospitalManagement = lazy(() => import("../../features/admin/pages/HospitalManagement"));
const DoctorManagement = lazy(() => import("../../features/admin/pages/DoctorManagement"));



const TabContentRenderer = memo(({ activeTab, user, setActiveTab }) => {

  const contentMap = {
    [DASHBOARD_TABS.DASHBOARD]: <DashboardWelcome user={useSelector((state) => state.auth.user)} setActiveTab={setActiveTab} />,
    [DASHBOARD_TABS.HOSPITALS]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <HospitalList setActiveTab={setActiveTab} />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.MY_HOSPITAL]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Hospital isTab={true} />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.DOCTORS]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {(user.role === "hospitalAdmin") ? <DoctorsPage /> : <AccessDenied />}
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.APPOINTMENTS]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {user.role === "hospitalAdmin" ? (
            <AppointmentPage />
          ) : user.role === "user" ? (
            <Appointments_user />
          ) : (
            <AccessDenied />
          )}
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.DISEASES]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {user.role === "admin" ? <DiseasePage /> : <Disease_user />}
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.MEDICINES]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {user.role === "admin" ? <MedicinePage /> : <Medicine_user />}
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
    [DASHBOARD_TABS.REPORTS]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <ReportUploadPage />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.TIMELINE]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <HealthTimeline />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.VIDEO_CONSULT]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <VideoConsultation />
        </Suspense>
      </ErrorBoundary>
    ),
    [DASHBOARD_TABS.HOSPITAL_ANALYTICS]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {user.role === "hospitalAdmin" ? <HospitalAnalytics /> : <AccessDenied />}
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
    [DASHBOARD_TABS.VERIFICATION_QUEUE]: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <VerificationQueue />
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
