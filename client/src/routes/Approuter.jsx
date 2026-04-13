import {createBrowserRouter , RouterProvider} from "react-router"
import Authlayout from "../layouts/Authlayout"

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Authlayout />
    }
])

const Approuter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Approuter