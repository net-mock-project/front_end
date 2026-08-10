import { useQuery } from '@tanstack/react-query'

import { getProfile } from '../api/profileApi'
import AvatarSection from '../components/AvatarSection'
import ProfileForm from '../components/ProfileForm'
import ProfileSidebar from '../components/ProfileSidebar'

import '../profile.css'

function ProfilePage() {
  
  // Lấy thông tin hồ sơ người dùng.
  const {
    data: user,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  // Đang lấy dữ liệu hồ sơ
  if (isPending) {
    return (
      <main className="profile-page">
        <div>Đang tải thông tin hồ sơ...</div>
      </main>
    )
  }

  // Không lấy được dữ liệu
  if (isError || !user) {
    return (
      <main className="profile-page">
        <div>Không thể tải thông tin hồ sơ.</div>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <header className="profile-page__header">
        <div className="profile-page__breadcrumb">
          Profile / Hồ sơ cá nhân
        </div>

        <h1>Hồ sơ cá nhân</h1>

        <p>
          Cập nhật thông tin cá nhân và vị trí liên hệ.
        </p>
      </header>

      <div className="profile-page__layout">
        {/* Sidebar hiển thị menu theo role */}
        <ProfileSidebar user={user} />

        <div className="profile-page__content">
          {/* Khu vực ảnh đại diện */}
          <AvatarSection user={user} />

          {/* Khu vực chỉnh sửa thông tin cá nhân */}
          <ProfileForm user={user} />
        </div>
      </div>
    </main>
  )
}

export default ProfilePage