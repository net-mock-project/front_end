import {
  BellOutlined,
  HeartFilled,
} from '@ant-design/icons'
import {
  Badge,
  Button,
  Menu,
  Spin,
  type MenuProps,
} from 'antd'
import { Link, Navigate, useLocation } from 'react-router-dom'

import type {User} from '../../types/User'

import ProfileDropdown from './ProfileDropdown'
import './Header.css'
import { useCurrentUser } from '../../features/auth/hooks/useCurrentUser'

// const authUser: User = {
//   userId: 1,
//   fullName: 'Minh Anh',
//   role: 'Volunteer',
//   profileUrl: '',
//   email: 'minhanh@example.com',
//   phone: '0123456789',
//   province: 'Hanoi',
//   status: 'ACTIVE',
//   location: {
//     latitude: 21.0285,
//     longitude: 105.8542,
//   },
// }


type MenuItem = Required<MenuProps>['items'][number]

function Header() {
  const {data: user, isLoading, isError}= useCurrentUser();
  const location = useLocation();
  if(isLoading){
    return <Spin fullscreen/>
  }
  if(!user|| isError){
    return <Navigate to="/login"/>;
  }

  

  /* Menu Header theo từng role */
  const menuItemsByRole: Record<User['roleName'], MenuItem[]> = {
    Requester: [
      {
        key: '/',
        label: <Link to="/">Trang chủ</Link>,
      },
    
      {
        key: '/relief-report',
        label: <Link to="/me/relief-requests">Yêu cầu cứu trợ của tôi</Link>,
      },
      {
        key: '/donation',
        label: <Link to="/donation">Quyên góp</Link>,
      },
    ],

    Volunteer: [
      {
        key: '/',
        label: <Link to="/">Trang chủ</Link>,
      },
  
      {
        key: '/donation',
        label: <Link to="/donation">Quyên góp</Link>,
      },
      {
        key: '/my-tasks',
        label: <Link to="/my-tasks">Nhiệm vụ của tôi</Link>,
      },
    ],

    Coordinator: [
      {
        key: '/',
        label: <Link to="/">Trang chủ</Link>,
      },
 
      {
        key: '/volunteer-management',
        label: <Link to="/volunteer-management">Quản lý volunteer</Link>,
      },
      {
        key: '/regional-relief-request',
        label: <Link to="/regional-relief-request">Yêu cầu cứu trợ khu vực</Link>,
      },
    ],

    Admin: [
      {
        key: '/',
        label: <Link to="/">Trang chủ</Link>,
      },
      {
        key: '/admin/users',
        label: (
          <Link to="/admin/users">
            Quản lý người dùng
          </Link>
        ),
      },
      {
        key: '/admin/audit-logs',
        label: (
          <Link to="/admin/audit-logs">
            Audit log
          </Link>
        ),
      },
    ],
  }



  return (
    <header className="app-header">
      <div className="app-header__brand">
        <div className="app-header__logo">
          <HeartFilled />
        </div>

        <span>RescueHub</span>
      </div>

      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        defaultSelectedKeys={['/']}
        className="app-header__menu"
        items={menuItemsByRole[user.roleName]}
      />

      <div className="app-header__actions">
        <Badge dot>
          <Button
            className="app-header__notification"
            shape="circle"
            icon={<BellOutlined />}
            aria-label="Thông báo"
          />
        </Badge>

        <ProfileDropdown user={user} />
      </div>
    </header>
  )
}

export default Header