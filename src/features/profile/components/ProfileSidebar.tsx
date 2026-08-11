import { Avatar, Menu } from 'antd'

import { getProfileMenuItems } from '../../../components/layout/navigation'
import type { User } from '../../../types/User'

type ProfileSidebarProps = {
  user: User
}

function ProfileSidebar({ user }: ProfileSidebarProps) {
  const items = getProfileMenuItems(user.role)

  // Tạo chữ viết tắt từ họ tên
  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

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
          <div>{user.role}</div>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={['profile']}
        items={items}
      />
    </aside>
  )
}

export default ProfileSidebar