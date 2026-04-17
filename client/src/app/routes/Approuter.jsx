import { createBrowserRouter, RouterProvider } from "react-router"
import Authlayout from "../../layouts/Authlayout"
import Hospital from "../../features/hospital/pages/Hospital"
import DoctorsPage from "../../features/hospital/pages/DoctorsPage"
import AppointmentPage from "../../features/hospital/pages/AppointmentPage"


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Authlayout />
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