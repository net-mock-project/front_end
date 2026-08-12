import {
  BellOutlined,
  HeartFilled,
} from '@ant-design/icons'
import {
  Badge,
  Button,
  Menu,
  type MenuProps,
} from 'antd'
import { Link, useLocation } from 'react-router-dom'

import type {User} from '../../types/User'

import ProfileDropdown from './ProfileDropdown'
import './Header.css'

type HeaderProps = {
  user: User
}

type MenuItem = Required<MenuProps>['items'][number]

function Header({ user }: HeaderProps) {
  const location = useLocation()

  /* Menu Header theo từng role */
  const menuItemsByRole: Record<User['role'], MenuItem[]> = {
    Requester: [
      {
        key: '/',
        label: <Link to="/">Trang chủ</Link>,
      },
      {
        key: '/map',
        label: <Link to="/map">Bản đồ</Link>,
      },
      {
        key: '/relief-report',
        label: <Link to="/relief-report">Báo cáo cứu trợ</Link>,
      },
      {
        key: '/donation',
        label: <Link to="/donation">Quyên góp</Link>,
      },
      {
        key: '/guide',
        label: <Link to="/guide">Hướng dẫn</Link>,
      },
    ],

    Volunteer: [
      {
        key: '/',
        label: <Link to="/">Trang chủ</Link>,
      },
      {
        key: '/map',
        label: <Link to="/map">Bản đồ</Link>,
      },
      {
        key: '/relief-report',
        label: <Link to="/relief-report">Báo cáo cứu trợ</Link>,
      },
      {
        key: '/donation',
        label: <Link to="/donation">Quyên góp</Link>,
      },
      {
        key: '/my-tasks',
        label: <Link to="/my-tasks">Nhiệm vụ của tôi</Link>,
      },
      {
        key: '/guide',
        label: <Link to="/guide">Hướng dẫn</Link>,
      },
    ],

    Coordinator: [
      {
        key: '/',
        label: <Link to="/">Trang chủ</Link>,
      },
      {
        key: '/map',
        label: <Link to="/map">Bản đồ</Link>,
      },
      {
        key: '/volunteer-management',
        label: <Link to="/volunteer-management">Quản lý volunteer</Link>,
      },
      {
        key: '/regional-relief-request',
        label: <Link to="/regional-relief-request">Yêu cầu cứu trợ khu vực</Link>,
      },
      {
        key: '/warehouse-management',
        label: <Link to="/warehouse-management">Quản lý khu vật tư</Link>,
      },
    ],

    Admin: [
      {
        key: '/',
        label: <Link to="/">Trang chủ</Link>,
      },
      {
        key: '/map',
        label: <Link to="/map">Bản đồ</Link>,
      },
      {
        key: '/dashboard',
        label: <Link to="/dashboard">Dashboard</Link>,
      },
      {
        key: '/user-management',
        label: <Link to="/user-management">Quản lý user</Link>,
      },
      {
        key: '/audit-log',
        label: <Link to="/audit-log">Audit log</Link>,
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
        items={menuItemsByRole[user.role]}
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