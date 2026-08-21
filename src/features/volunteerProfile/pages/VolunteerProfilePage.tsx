import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Modal, Spin, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

import {
  createVolunteerProfile,
  deleteVolunteerProfile,
  getVolunteerProfile,
  updateVolunteerProfile,
} from '../api/volunteerProfileApi'
import VolunteerProfileForm from '../components/VolunteerProfileForm'
import VolunteerProfileView from '../components/VolunteerProfileView'
import type {
  VolunteerProfile,
  VolunteerProfilePayload,
} from '../../../types/VolunteerProfile'

import '../volunteerProfile.css'

const { Title, Paragraph } = Typography

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { errorMessages?: string[]; message?: string } | undefined
    return data?.errorMessages?.[0] || data?.message || fallback
  }

  return fallback
}

function VolunteerProfilePage() {
  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)

  const profileQuery = useQuery({
    queryKey: ['volunteer-profile'],
    queryFn: getVolunteerProfile,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })

  const saveMutation = useMutation({
    mutationFn: ({ profile, values }: { profile: VolunteerProfile | null; values: VolunteerProfilePayload }) => (
      profile ? updateVolunteerProfile(values) : createVolunteerProfile(values)
    ),
    onSuccess: () => {
      messageApi.success('Lưu hồ sơ Volunteer thành công')
      queryClient.invalidateQueries({ queryKey: ['volunteer-profile'] })
      setFormOpen(false)
    },
    onError: (error) => messageApi.error(getErrorMessage(error, 'Không thể lưu hồ sơ Volunteer')),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVolunteerProfile,
    onSuccess: () => {
      messageApi.success('Đã xóa yêu cầu Volunteer')
      queryClient.invalidateQueries({ queryKey: ['volunteer-profile'] })
    },
    onError: (error) => messageApi.error(getErrorMessage(error, 'Không thể xóa hồ sơ Volunteer')),
  })

  const profile = profileQuery.data

  const handleDelete = () => {
    Modal.confirm({
      title: 'Xóa yêu cầu Volunteer?',
      content: 'Bạn có chắc chắn muốn xóa hồ sơ Volunteer hiện tại không?',
      okText: 'Xác nhận xóa',
      cancelText: 'Đóng',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(),
    })
  }

  return (
    <main className="volunteer-profile-page">
      {contextHolder}
      <header className="volunteer-profile-page__header">
        <div className="volunteer-profile-page__breadcrumb">Volunteer / Hồ sơ Volunteer</div>
        <Title level={1}>Hồ sơ Volunteer</Title>
        <Paragraph>Đăng ký và quản lý thông tin tham gia hoạt động cứu trợ.</Paragraph>
      </header>

      <section className="volunteer-profile-page__content">
        {profileQuery.isPending ? (
          <div className="volunteer-profile-page__state"><Spin /><p>Đang tải hồ sơ Volunteer...</p></div>
        ) : profileQuery.isError ? (
          <div className="volunteer-profile-page__state"><p>Không thể tải hồ sơ Volunteer.</p></div>
        ) : profile ? (
          <VolunteerProfileView profile={profile} onEdit={() => setFormOpen(true)} onDelete={handleDelete} />
        ) : (
          <div className="volunteer-profile-page__empty">
            <Title level={2}>Bạn chưa có hồ sơ Volunteer</Title>
            <Paragraph>Gửi thông tin kinh nghiệm và kỹ năng để đăng ký tham gia cứu trợ.</Paragraph>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormOpen(true)}>Tạo hồ sơ Volunteer</Button>
          </div>
        )}
      </section>

      <Modal
        title={profile ? 'Chỉnh sửa hồ sơ Volunteer' : 'Tạo hồ sơ Volunteer'}
        open={formOpen}
        footer={null}
        width={720}
        destroyOnClose
        onCancel={() => setFormOpen(false)}
      >
        <VolunteerProfileForm
          key={profile?.approvalStatus ?? 'new'}
          initialValues={profile ? {
            experienceYears: profile.experienceYears,
            cvUrl: profile.cvUrl ?? '',
            skills: profile.skills,
          } : undefined}
          loading={saveMutation.isPending}
          onCancel={() => setFormOpen(false)}
          onSubmit={(values) => saveMutation.mutate({ profile: profile ?? null, values })}
        />
      </Modal>
    </main>
  )
}

export default VolunteerProfilePage
