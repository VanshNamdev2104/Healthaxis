import { createBrowserRouter, RouterProvider } from "react-router"
import AuthPage from "../../features/auth/pages/AuthPage"
import Hospital from "../../features/hospital/pages/Hospital"
import DoctorsPage from "../../features/hospital/pages/DoctorsPage"


export const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthPage />
    },{
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