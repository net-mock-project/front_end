import { Avatar, Menu, type MenuProps } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { getProfileMenuItems } from '../../../components/layout/navigation'
import type { User } from '../../../types/User'
import { logoutApi } from '../../auth/api/authApi'

type ProfileSidebarProps = {
  user: User
}

function ProfileSidebar({ user }: ProfileSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const items = getProfileMenuItems(user.roleName)

  const selectedKey = location.pathname.includes('volunteer-profile')
    ? 'volunteer-profile'
    : 'profile'

  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  const handleMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'profile') {
      navigate('/profile')
    } else if (key === 'volunteer-profile') {
      navigate('/volunteer-profile')
    } else if (key === 'logout') {
      try {
        await logoutApi()
      } finally {
        queryClient.clear()
        navigate('/login', { replace: true })
      }
    }
  }

  return (
    <aside className="profile-sidebar">
      <div className="profile-sidebar__user">
        <Avatar
          size={60}
          src={user.profileUrl || undefined}
        >
          {initials}
        </Avatar>

        <div>
          <strong>{user.fullName}</strong>
          <div>{user.roleName}</div>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
        onClick={handleMenuClick}
      />
    </aside>
  )
}

export default ProfileSidebar