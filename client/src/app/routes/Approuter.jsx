import { createBrowserRouter, RouterProvider } from "react-router"
import AuthPage from "../../features/auth/pages/AuthPage"
import ResetPassword from "../../features/auth/components/ResetPassword"
import Hospital from "../../features/hospital/pages/Hospital"
import DoctorsPage from "../../features/hospital/pages/DoctorsPage"
import AppointmentPage from "../../features/hospital/pages/AppointmentPage"
import ProtectedRoute from "../routes/ProtectedRoute.jsx"


// Define the router with a protected layout for authenticated routes
export const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthPage />
    },
    {
        path: "/reset-password",
        element: <ResetPassword />
    },
    {
        path: "/hospital",
        element: < Hospital />
    },
    {
        path: "/hospital/doctors",
        element: < DoctorsPage />
    },
    {
        path: "/hospital/appointments",
        element: < AppointmentPage />
    }
])

const Approuter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Approuter