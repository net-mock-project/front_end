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
import { useLocation } from 'react-router-dom'

import type {
  UserRole,
  UserSummary,
} from '../../types/user'

import ProfileDropdown from './ProfileDropdown'
import './Header.css'

type HeaderProps = {
  user: UserSummary
}

type MenuItem = Required<MenuProps>['items'][number]

function Header({ user }: HeaderProps) {
  const location = useLocation()

  /* Menu Header theo từng role */
  const menuItemsByRole: Record<UserRole, MenuItem[]> = {
    Requester: [
      {
        key: 'home',
        label: 'Trang chủ',
      },
      {
        key: 'map',
        label: 'Bản đồ',
      },
      {
        key: 'relief-report',
        label: 'Báo cáo cứu trợ',
      },
      {
        key: 'donation',
        label: 'Quyên góp',
      },
      {
        key: 'guide',
        label: 'Hướng dẫn',
      },
    ],

    Volunteer: [
      {
        key: 'home',
        label: 'Trang chủ',
      },
      {
        key: 'map',
        label: 'Bản đồ',
      },
      {
        key: 'relief-report',
        label: 'Báo cáo cứu trợ',
      },
      {
        key: 'donation',
        label: 'Quyên góp',
      },
      {
        key: 'my-tasks',
        label: 'Nhiệm vụ của tôi',
      },
      {
        key: 'guide',
        label: 'Hướng dẫn',
      },
    ],

    Coordinator: [
      {
        key: 'home',
        label: 'Trang chủ',
      },
      {
        key: 'map',
        label: 'Bản đồ',
      },
      {
        key: 'volunteer-management',
        label: 'Quản lý volunteer',
      },
      {
        key: 'regional-relief-request',
        label: 'Yêu cầu cứu trợ khu vực',
      },
      {
        key: 'warehouse-management',
        label: 'Quản lý khu vật tư',
      },
    ],

    Admin: [
      {
        key: 'home',
        label: 'Trang chủ',
      },
      {
        key: 'map',
        label: 'Bản đồ',
      },
      {
        key: 'dashboard',
        label: 'Dashboard',
      },
      {
        key: 'user-management',
        label: 'Quản lý user',
      },
      {
        key: 'audit-log',
        label: 'Audit log',
      },
    ],
  }

  const selectedKey =
    location.pathname === '/'
      ? 'home'
      : location.pathname.startsWith('/map')
        ? 'map'
        : ''

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
        selectedKeys={selectedKey ? [selectedKey] : []}
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