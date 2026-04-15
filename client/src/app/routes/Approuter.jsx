import { createBrowserRouter, RouterProvider } from "react-router"
import Authlayout from "../../layouts/Authlayout"
import Hospital from "../../features/hospital/pages/Hospital"
import DoctorsPage from "../../features/hospital/pages/DoctorsPage"


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
    }
])

const Approuter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Approuter