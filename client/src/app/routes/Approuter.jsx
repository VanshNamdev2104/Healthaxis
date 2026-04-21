import { createBrowserRouter, RouterProvider } from "react-router"
import AuthPage from "../../features/auth/pages/AuthPage"
import ResetPassword from "../../features/auth/components/ResetPassword"
import Hospital from "../../features/hospital/pages/Hospital"
import DoctorsPage from "../../features/hospital/pages/DoctorsPage"
import DoctorProfilePage from "../../features/hospital/pages/DoctorProfilePage"
import AppointmentPage from "../../features/hospital/pages/AppointmentPage"
import { Dashboard } from "../../pages/Dashboard"
import ProtectedRoute from "../routes/ProtectedRoute.jsx"
import Protected from "../../features/hospital/components/Protected.jsx"
import HomeLayout from "../../layouts/HomeLayout"


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
    }
])

const Approuter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Approuter