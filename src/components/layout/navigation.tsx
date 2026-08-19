import {
  AreaChartOutlined,
  IdcardOutlined,
  LockOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

import type { User } from '../../types/User'

export type MenuItem = Required<MenuProps>['items'][number]

const commonProfileItems: MenuItem[] = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Xem Profile',
  },
  {
    key: 'change-password',
    icon: <LockOutlined />,
    label: 'Đổi mật khẩu',
  },
]

const profileItemsByRole: Record<User['roleName'], MenuItem[]> = {
  Requester: [
    {
      key: 'volunteer-profile',
      icon: <IdcardOutlined />,
      label: 'Hồ sơ Volunteer',
    },
  ],

  Volunteer: [
    {
      key: 'volunteer-profile',
      icon: <IdcardOutlined />,
      label: 'Hồ sơ Volunteer',
    },
  ],

  Coordinator: [
    {
      key: 'managed-area',
      icon: <AreaChartOutlined />,
      label: 'Khu vực phụ trách',
    },
    {
      key: 'summary-report',
      icon: <ProfileOutlined />,
      label: 'Báo cáo tổng hợp',
    },
  ],

  Admin: [],
}

export function getProfileMenuItems(roleName: User['roleName']): MenuItem[] {
  return [
    ...commonProfileItems,
    ...(profileItemsByRole[roleName] ),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ]
}