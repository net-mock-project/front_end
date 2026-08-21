import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";

import App from "./App";
import { HomePage } from "../features/home/pages/HomePage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import AdminUsersPage from "../features/admin/users/pages/AdminUsersPage";
import AuditLogsPage from "../features/admin/audit-logs/pages/AuditLogsPage";
import MapPage from "../features/map/pages/MapPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import VolunteerTasksPage from "../features/volunteer/pages/VolunteerTasksPage";
import VolunteerTaskDetailPage from "../features/volunteer/pages/VolunteerTaskDetailPage";
import { MyDonationPage } from "../features/myDonation/pages/MyDonationPage";
import { CreateDonationPage } from "../features/createDonaton/pages/CreateDonationPage";
import ReliefRequestsPage from "../features/reliefRequest/pages/ReliefRequestsPage";
import { ManageVolunteersPage, VolunteerProfilePage } from "../features/volunteers";

function PrivateRoute() {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <Spin fullscreen />;
  }

  if (!user || isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function AdminRoute() {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <Spin fullscreen />;
  }

  if (!user || isError) {
    return <Navigate to="/login" replace />;
  }

  if (user.roleName !== "Admin") {
    return <Navigate to="/" replace />;
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
        Component: HomePage,
      },
      {
        path: "map",
        Component: MapPage,
      },

      {
        Component: PrivateRoute,
        children: [
          {
            path: "profile",
            Component: ProfilePage,
          },
          {
            path: "me/relief-requests",
            Component: ReliefRequestsPage,
          },
          {
            path: "regional-relief-request",
            Component: ReliefRequestsPage,
          },
          {
            path: "volunteer-profile",
            Component: VolunteerProfilePage,
          },
          {
            path: "volunteer-management",
            Component: ManageVolunteersPage,
          },
          {
            path: "my-tasks",
            Component: VolunteerTasksPage,
          },
          {
            path: "my-tasks/:taskId",
            Component: VolunteerTaskDetailPage,
          },
          {
            path: "me/donations",
            Component: MyDonationPage,
          },
          {
            path: "me/donations/create",
            Component: CreateDonationPage,
          },
          {
            path: "donation",
            Component: MyDonationPage,
          },
          {
            path: "donation/create",
            Component: CreateDonationPage,
          },

          // Admin routes
          {
            Component: AdminRoute,
            children: [
              {
                path: "admin/users",
                Component: AdminUsersPage,
              },
              {
                path: "admin/audit-logs",
                Component: AuditLogsPage,
              },
            ],
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