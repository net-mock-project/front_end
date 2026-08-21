import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "./App";
import ProfilePage from "../features/profile/pages/ProfilePage";
import AdminUsersPage from "../features/admin/users/pages/AdminUsersPage";
import AuditLogsPage from "../features/admin/audit-logs/pages/AuditLogsPage";
import { MapTest } from "../features/map/components/MapTest";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import VolunteerTasksPage from "../features/volunteer/pages/VolunteerTasksPage";
import VolunteerTaskDetailPage from "../features/volunteer/pages/VolunteerTaskDetailPage";
import { Spin } from "antd";
import { MyDonationPage } from "../features/myDonation/pages/MyDonationPage";
import { CreateDonationPage } from "../features/createDonaton/pages/CreateDonationPage";

// Đổi thành chữ hoa: PrivateRoute
function PrivateRoute() {
    const { data: user, isLoading, isError } = useCurrentUser();
    if (isLoading) {
        return <Spin fullscreen />;
    }
    if (!user || isError) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

<<<<<<< HEAD
function adminRoute() {
    const {
        data: user,
        isLoading,
        isError
    } = useCurrentUser();

    if(isLoading){
        return <Spin fullscreen/>
=======
// Đổi thành chữ hoa: AdminRoute
function AdminRoute() {
    const { data: user, isLoading, isError } = useCurrentUser();

    if (isLoading) {
        return <Spin fullscreen />;
>>>>>>> f5136ae (đã sửa hai folder myDonation và createDonation)
    }

    if (!user || isError) {
        return <Navigate to="/login" />;
    }

    if (user.roleName !== "Admin") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                Component: MapTest,
            },
            {
                Component: PrivateRoute, // Cập nhật tên mới
                children: [
                    {
                        path: "/profile",
                        Component: ProfilePage,
                    },
                    {
<<<<<<< HEAD
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
                    }
                ]
            },
            {
                Component: adminRoute,
                children: [
                    {
                        path: "/admin/users",
                        Component: AdminUsersPage
                    },
                    {
                        path: "/admin/audit-logs",
                        Component: AuditLogsPage
                    }
                ]
            }
        ]
=======
                        path: "/me/donations",
                        Component: MyDonationPage,
                    },
                    {
                        path: "/me/donations/create",
                        Component: CreateDonationPage,
                    },
                ],
            },
            {
                Component: AdminRoute, // Cập nhật tên mới
                children: [
                    {
                        path: "/admin/users",
                        Component: AdminUsersPage,
                    },
                    {
                        path: "/admin/audit-logs",
                        Component: AuditLogsPage,
                    },
                ],
            },
        ],
>>>>>>> f5136ae (đã sửa hai folder myDonation và createDonation)
    },
    {
        path: "/login",
        Component: LoginPage,
    },
    {
        path: "/register",
        Component: RegisterPage,
<<<<<<< HEAD
    }
=======
    },
>>>>>>> f5136ae (đã sửa hai folder myDonation và createDonation)
]);