import { Navigate, Outlet } from 'react-router-dom'
import { Spin } from 'antd'

import { useCurrentUser } from '../features/auth/hooks/useCurrentUser'

export function PrivateRoute() {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return <Spin fullscreen />
  }

  if (!user || isError) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export function AdminRoute() {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return <Spin fullscreen />
  }

  if (!user || isError) {
    return <Navigate to="/login" />
  }

  if (user.roleName !== 'Admin') {
    return <Navigate to="/" />
  }

  return <Outlet />
}
