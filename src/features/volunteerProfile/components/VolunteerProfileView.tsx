import { Button, Descriptions, Empty, Tag, Typography } from 'antd'

import type { VolunteerProfile } from '../../../types/VolunteerProfile'
import { getVolunteerSkillName } from '../config/skills'

type VolunteerProfileViewProps = {
  profile: VolunteerProfile
  onEdit: () => void
  onDelete: () => void
}

const { Title, Text } = Typography

function getStatusColor(status?: string | null) {
  if (status === 'Approved' || status === 'Accepted') return 'success'
  if (status === 'Rejected') return 'error'
  return 'warning'
}

function VolunteerProfileView({ profile, onEdit, onDelete }: VolunteerProfileViewProps) {
  const isApproved = profile.approvalStatus === 'Approved' || profile.approvalStatus === 'Accepted'

  return (
    <section className="volunteer-profile-view">
      <div className="volunteer-profile-view__heading">
        <div>
          <Title level={2}>Hồ sơ Volunteer</Title>
          <Text type="secondary">Thông tin hoạt động tình nguyện của bạn.</Text>
        </div>
        {profile.approvalStatus && (
          <Tag color={getStatusColor(profile.approvalStatus)}>
            {profile.approvalStatus}
          </Tag>
        )}
      </div>

      <Descriptions bordered column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Kinh nghiệm">
          {profile.experienceYears} năm
        </Descriptions.Item>
        <Descriptions.Item label="CV">
          {profile.cvUrl ? <a href={profile.cvUrl} target="_blank" rel="noreferrer">Mở CV</a> : 'Chưa cập nhật'}
        </Descriptions.Item>
      </Descriptions>

      <div className="volunteer-profile-view__skills">
        <Title level={4}>Kỹ năng</Title>
        {profile.skills.length ? (
          <div className="volunteer-profile-view__skill-list">
            {profile.skills.map((skill) => (
              <div className="volunteer-profile-view__skill" key={skill.skillId}>
                <strong>{getVolunteerSkillName(skill.skillId)}</strong>
                <span>Cấp độ {skill.level}/5</span>
              </div>
            ))}
          </div>
        ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có kỹ năng" />}
      </div>

      {!isApproved && (
        <div className="volunteer-profile-view__actions">
          <Button danger onClick={onDelete}>Xóa yêu cầu</Button>
          <Button type="primary" onClick={onEdit}>Chỉnh sửa</Button>
        </div>
      )}
    </section>
  )
}

export default VolunteerProfileView
