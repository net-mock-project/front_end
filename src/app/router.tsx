import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProfilePage from "../features/profile/pages/ProfilePage";
import AdminUsersPage from "../features/admin/users/pages/AdminUsersPage";
import AuditLogsPage from "../features/admin/audit-logs/pages/AuditLogsPage";
import { MapTest } from "../features/map/components/MapTest";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { MyDonationPage } from "../features/myDonation/pages/MyDonationPage";
import { CreateDonationPage } from "../features/createDonaton/pages/CreateDonationPage";
import VolunteerProfilePage from "../features/volunteerProfile/pages/VolunteerProfilePage";
import { AdminRoute, PrivateRoute } from './routeGuards';

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
                Component: PrivateRoute,
                children: [
                    {
                        path: "/profile",
                        Component: ProfilePage,
                    },
                    {
                        path: "/volunteer-profile",
                        Component: VolunteerProfilePage,
                    },
                    {
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
                Component: AdminRoute,
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
    },
    {
        path: "/login",
        Component: LoginPage,
    },
    {
        path: "/register",
        Component: RegisterPage,
    },
]);