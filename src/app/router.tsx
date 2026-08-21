import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "./App";
import ProfilePage from "../features/profile/pages/ProfilePage";
import AdminUsersPage from "../features/admin/users/pages/AdminUsersPage";
import AuditLogsPage from "../features/admin/audit-logs/pages/AuditLogsPage";
import MapPage from "../features/map/pages/MapPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import VolunteerTasksPage from "../features/volunteer/pages/VolunteerTasksPage";
import VolunteerTaskDetailPage from "../features/volunteer/pages/VolunteerTaskDetailPage";
import { Spin } from "antd";
import { MyDonationPage } from "../features/myDonation/pages/MyDonationPage";
import { CreateDonationPage } from "../features/createDonaton/pages/CreateDonationPage";
import ReliefRequestsPage from "../features/reliefRequest/pages/ReliefRequestsPage";

function PrivateRoute(){
    const {data: user, isLoading, isError} = useCurrentUser();
    if(isLoading){
        return <Spin fullscreen/>
    }
    if(!user|| isError){
        return <Navigate to="/login"/>
    }

    return <Outlet/>
}

function AdminRoute() {

    const {
        data: user,
        isLoading,
        isError
    } = useCurrentUser();

    if(isLoading){
        return <Spin fullscreen/>
    }

    if(!user || isError){
        return <Navigate to="/login"/>
    }

    if(user.roleName !== "Admin"){
        return <Navigate to="/"/>
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
                Component: MapPage,
            },

            {
                Component: PrivateRoute,
                children: [
                    {
                        path: "/profile",
                        Component: ProfilePage
                    },
                    {
                        path: "/me/relief-requests",
                        Component: ReliefRequestsPage
                    },
                    {
                        path: "/regional-relief-request",
                        Component: ReliefRequestsPage
                    },
                    {
                        path: "/me/donations",
                        Component: MyDonationPage
                    },
                    {
                        path: "/me/donations/create",
                        Component: CreateDonationPage
                    },

                    {
                        path: "/my-tasks",
                        Component: VolunteerTasksPage,
                    },
                    {
                        path: "/my-tasks/:taskId",
                        Component: VolunteerTaskDetailPage,
                    },
                    {
                        path: "/donation",
                        Component: MyDonationPage
                    },
                    {
                        path: "/donation/create",
                        Component: CreateDonationPage
                    },
                    {
                        path: "/map",
                        Component: MapPage,
                    },
                ]
            },

            {
                Component: AdminRoute,
                children: [
                    {
                        path: "/admin/users",
                        Component: AdminUsersPage
                    },
                    {
                        path: "/admin/audit-logs",
                        Component: AuditLogsPage
                    },

                       

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