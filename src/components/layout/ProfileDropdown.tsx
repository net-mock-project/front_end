import { Avatar, Dropdown, Space, type MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { getProfileMenuItems } from './navigation'
import type { User } from '../../types/User'
import { logoutApi } from '../../features/auth/api/authApi'

type ProfileDropdownProps = {
  user: User
}

function ProfileDropdown({ user }: ProfileDropdownProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const items = getProfileMenuItems(user.roleName)

  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word: string) => word[0])
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
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Space className="profile-dropdown" style={{ cursor: 'pointer' }}>
        <Avatar src={user.profileUrl || undefined}>
          {initials}
        </Avatar>

        <div className="profile-dropdown__info">
          <strong>{user.fullName}</strong>
          <div>{user.roleName}</div>
        </div>
      </Space>
    </Dropdown>
  )
}

export default ProfileDropdown