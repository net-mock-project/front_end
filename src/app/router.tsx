

import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "./App";
import ProfilePage from "../features/profile/pages/ProfilePage";
import { MapTest } from "../features/map/components/MapTest";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { Spin } from "antd";



function privateRoute(){
    const {data: user, isLoading, isError} = useCurrentUser();
    if(isLoading){
        return <Spin fullscreen/>
    }
    if(!user|| isError){
        return <Navigate to="/login"/>
    }

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
        Component: LoginPage
    },
    {
        path: "/register",
        Component: RegisterPage,
    }

])