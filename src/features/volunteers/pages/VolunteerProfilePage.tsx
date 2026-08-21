// src/features/volunteers/pages/VolunteerProfilePage.tsx
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../profile/api/profileApi'
import ProfileSidebar from '../../profile/components/ProfileSidebar'
import { VolunteerProfileSection } from '../components/VolunteerProfileSection'
import { useMyVolunteerProfile } from '../hooks/useVolunteerQueries'
import { VolunteerApprovalStatus } from '../../../types/Volunteer'
import { Spin } from 'antd'
import '../../profile/profile.css'

export const VolunteerProfilePage = () => {
  const { data: user, isPending: isUserPending, isError: isUserError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { data: volunteerProfile, isPending: isVolunteerPending } = useMyVolunteerProfile()

  if (isUserPending || isVolunteerPending) {
    return (
      <main className="profile-page">
        <Spin fullscreen tip="Đang tải thông tin hồ sơ..." />
      </main>
    )
  }

  if (isUserError || !user) {
    return (
      <main className="profile-page">
        <div>Không thể tải thông tin hồ sơ.</div>
      </main>
    )
  }

  // Header Title & Subtitle theo từng trạng thái
  let title = 'Hồ sơ Volunteer'
  let subtitle = 'Mỗi User chỉ có một hồ sơ Volunteer.'

  if (volunteerProfile?.approvalStatus === VolunteerApprovalStatus.Pending) {
    subtitle = 'Trạng thái xét duyệt hồ sơ.'
  } else if (volunteerProfile?.approvalStatus === VolunteerApprovalStatus.Approved) {
    title = 'Hồ sơ Volunteer đã được duyệt'
    subtitle = 'Kỹ năng, lịch sử và hỗ trợ cứu trợ tự động.'
  }

  return (
    <main className="profile-page">
      <header className="profile-page__header">
        <div className="profile-page__breadcrumb">Profile / Volunteer</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>

      <div className="profile-page__layout">
        {/* Sidebar bên trái */}
        <ProfileSidebar user={user} />

        {/* Nội dung hồ sơ tình nguyện viên */}
        <div
          className="profile-page__content"
          style={{ padding: 0, background: 'transparent', boxShadow: 'none' }}
        >
          <VolunteerProfileSection user={user} />
        </div>
      </div>
    </main>
  )
}