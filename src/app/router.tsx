

import { createBrowserRouter, Outlet } from "react-router-dom";
import App from "./App";
import ProfilePage from "../features/profile/pages/ProfilePage";
import { MapTest } from "../features/map/components/MapTest";
import { RegisterPage } from "../features/register/pages/RegisterPage";



function privateRoute(){



    return <Outlet/>
}

export const router= createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                Component: MapTest,
            },
            {
                Component: privateRoute,
                children: [
                    {
                        path: "/profile",
                        Component: ProfilePage
                    }
                ]
            }
        ]
    },
    {
        path: "/login",
        
    },
    {
        path: "/register",
        Component: RegisterPage,
    }

])