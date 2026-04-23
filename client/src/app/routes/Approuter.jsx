import { createBrowserRouter, RouterProvider } from "react-router"
import AuthPage from "../../features/auth/pages/AuthPage"
import ResetPassword from "../../features/auth/components/ResetPassword"
import Hospital from "../../features/hospital/pages/Hospital"
import DoctorsPage from "../../features/hospital/pages/DoctorsPage"
import DoctorProfilePage from "../../features/hospital/pages/DoctorProfilePage"
import AppointmentPage from "../../features/hospital/pages/AppointmentPage"
import DiseasePage from "../../features/health/pages/DiseasePage"
import MedicinePage from "../../features/health/pages/MedicinePage"
import { Dashboard } from "../../pages/Dashboard"
import ProtectedRoute from "../routes/ProtectedRoute.jsx"
import Protected from "../../features/hospital/components/Protected.jsx"
import HomeLayout from "../../layouts/HomeLayout"
import AdminDashboard from "../../features/admin/pages/AdminDashboard"
import UserManagement from "../../features/admin/pages/UserManagement"
import HospitalManagement from "../../features/admin/pages/HospitalManagement"
import DoctorManagement from "../../features/admin/pages/DoctorManagement"


// Define the router with a protected layout for authenticated routes
export const router = createBrowserRouter([
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
        element: <Protected role="hospitalAdmin"><Hospital /></Protected>
    },
    {
        path: "/hospital/doctors",
        element: <Protected role="hospitalAdmin"><DoctorsPage /></Protected>
    },
    {
        path: "/hospital/doctors/:doctorId",
        element: <Protected role="hospitalAdmin"><DoctorProfilePage /></Protected>
    },
    {
        path: "/hospital/appointments",
        element: <Protected role="hospitalAdmin">< AppointmentPage /></Protected>
    },
    {
        path: "/admin",
        element: <Protected role="admin"><AdminDashboard /></Protected>
    },
    {
        path: "/admin/users",
        element: <Protected role="admin"><UserManagement /></Protected>
    },
    {
        path: "/admin/hospitals",
        element: <Protected role="admin"><HospitalManagement /></Protected>
    },
    {
        path: "/admin/doctors",
        element: <Protected role="admin"><DoctorManagement /></Protected>
    },
    {
        path: "/health/diseases",
        element: <Protected role="admin"><DiseasePage /></Protected>
    },
    {
        path: "/health/medicines",
        element: <Protected role="admin"><MedicinePage /></Protected>
    }
])

const Approuter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Approuter