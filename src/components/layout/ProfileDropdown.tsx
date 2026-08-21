import { Avatar, Dropdown, Space, type MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'

import { getProfileMenuItems } from './navigation'
import type { User } from '../../types/User'

type ProfileDropdownProps = {
  user: User
}

function ProfileDropdown({ user }: ProfileDropdownProps) {
  const navigate = useNavigate()

  const items = getProfileMenuItems(user.roleName)

  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile') {
      navigate('/profile')
    }

    if (key === 'volunteer-profile') {
      navigate('/volunteer-profile')
    }

    // Các chức năng khác sẽ nối route/API khi triển khai tương ứng
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
      <Space className="profile-dropdown">
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