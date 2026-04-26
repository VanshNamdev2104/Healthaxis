import { createBrowserRouter, RouterProvider } from "react-router"
import { lazy, Suspense } from "react"
import AuthPage from "../../features/auth/pages/AuthPage"
import ResetPassword from "../../features/auth/components/ResetPassword"
import { Dashboard } from "../../pages/Dashboard"
import ProtectedRoute from "../routes/ProtectedRoute.jsx"
import Protected from "../../features/hospital/components/Protected.jsx"
import HomeLayout from "../../layouts/HomeLayout"

const Hospital = lazy(() => import("../../features/hospital/pages/Hospital"))
const DoctorsPage = lazy(() => import("../../features/hospital/pages/DoctorsPage"))
const DoctorProfilePage = lazy(() => import("../../features/hospital/pages/DoctorProfilePage"))
const AppointmentPage = lazy(() => import("../../features/hospital/pages/AppointmentPage"))
const DiseasePage = lazy(() => import("../../features/health/pages/DiseasePage"))
const MedicinePage = lazy(() => import("../../features/health/pages/MedicinePage"))
const ChatPage = lazy(() => import("../../features/chat/pages/ChatPage"))
const AdminDashboard = lazy(() => import("../../features/admin/pages/AdminDashboard"))
const UserManagement = lazy(() => import("../../features/admin/pages/UserManagement"))
const HospitalManagement = lazy(() => import("../../features/admin/pages/HospitalManagement"))
const DoctorManagement = lazy(() => import("../../features/admin/pages/DoctorManagement"))

const Loadable = (Component) => (props) => (
  <Suspense fallback={
    <div className="flex h-screen items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  }>
    <Component {...props} />
  </Suspense>
)

const LazyHospital = Loadable(Hospital)
const LazyDoctorsPage = Loadable(DoctorsPage)
const LazyDoctorProfilePage = Loadable(DoctorProfilePage)
const LazyAppointmentPage = Loadable(AppointmentPage)
const LazyDiseasePage = Loadable(DiseasePage)
const LazyMedicinePage = Loadable(MedicinePage)
const LazyChatPage = Loadable(ChatPage)
const LazyAdminDashboard = Loadable(AdminDashboard)
const LazyUserManagement = Loadable(UserManagement)
const LazyHospitalManagement = Loadable(HospitalManagement)
const LazyDoctorManagement = Loadable(DoctorManagement)


// Define the router with a protected layout for authenticated routes
const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />
    },
    {
        path: "/auth",
        element: <AuthPage />
    },
    {
        path: "/reset-password",
        element: <ResetPassword />
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <Dashboard />
            }
        ]
    },
    {
        path: "/hospital",
        element: <Protected role="hospitalAdmin"><LazyHospital /></Protected>
    },
    {
        path: "/hospital/doctors",
        element: <Protected role="hospitalAdmin"><LazyDoctorsPage /></Protected>
    },
    {
        path: "/hospital/doctors/:doctorId",
        element: <Protected role="hospitalAdmin"><LazyDoctorProfilePage /></Protected>
    },
    {
        path: "/hospital/appointments",
        element: <Protected role="hospitalAdmin"><LazyAppointmentPage /></Protected>
    },
    {
        path: "/admin",
        element: <Protected role="admin"><LazyAdminDashboard /></Protected>
    },
    {
        path: "/admin/users",
        element: <Protected role="admin"><LazyUserManagement /></Protected>
    },
    {
        path: "/admin/hospitals",
        element: <Protected role="admin"><LazyHospitalManagement /></Protected>
    },
    {
        path: "/admin/doctors",
        element: <Protected role="admin"><LazyDoctorManagement /></Protected>
    },
    {
        path: "/health/diseases",
        element: <Protected role="admin"><LazyDiseasePage /></Protected>
    },
    {
        path: "/health/medicines",
        element: <Protected role="admin"><LazyMedicinePage /></Protected>
    },
    {
        path: "/chat",
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <LazyChatPage />
            }
        ]
    }
])

const Approuter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Approuter