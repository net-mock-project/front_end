import { EnvironmentOutlined, TeamOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import {  useParams } from 'react-router-dom'
import { AdvancedMarker } from '@vis.gl/react-google-maps'

import { getVolunteerTaskDetail } from '../api/volunteerTaskApi'
import { MapContainer } from '../../map/components/MapContainer'
import '../volunteerTaskDetail.css'

const statusLabels: Record<string, string> = {
  Pending: 'Đang chờ',
  InProgress: 'Đang thực hiện',
  Completed: 'Hoàn thành',
}

function VolunteerTaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const taskQuery = useQuery({
    queryKey: ['volunteer-task', taskId],
    queryFn: () => getVolunteerTaskDetail(taskId as string),
    enabled: Boolean(taskId),
  })

  if (taskQuery.isPending) {
    return <main className="volunteer-task-detail-page"><div className="volunteer-task-detail__state">Đang tải chi tiết nhiệm vụ...</div></main>
  }

  if (taskQuery.isError || !taskQuery.data) {
    return <main className="volunteer-task-detail-page"><div className="volunteer-task-detail__state volunteer-task-detail__state--error">Không thể tải chi tiết nhiệm vụ.</div></main>
  }

  const task = taskQuery.data

  return (
    <main className="volunteer-task-detail-page">
      <div className="volunteer-task-detail-page__inner">
        

        <header className="volunteer-task-detail-page__header">
          <div className="volunteer-task-detail-page__breadcrumb">Volunteer / Nhiệm vụ / Chi tiết</div>
          <h1>Chi tiết nhiệm vụ</h1>
          <p>Thông tin chi tiết về hoạt động cứu trợ được phân công cho bạn.</p>
        </header>

        <section className="volunteer-task-detail__layout">
          <div className="volunteer-task-detail__content">
            <div className="volunteer-task-detail__section">
              <div className="volunteer-task-detail__title-row">
                <h2>{task.title}</h2>
                <Tag color={task.status === 'InProgress' ? 'blue' : 'gold'}>{statusLabels[task.status] ?? task.status}</Tag>
              </div>
              <span className="volunteer-task-detail__eyebrow">Mô tả nhiệm vụ</span>
              <p>{task.description}</p>
            </div>

            <div className="volunteer-task-detail__facts">
              <div><span>Độ ưu tiên</span><strong>{task.priority}/5</strong></div>
              <div><span>Nhân sự cần thiết</span><strong><TeamOutlined /> {task.requiredVolunteers} volunteer</strong></div>
              <div><span>Vị trí</span><strong><EnvironmentOutlined /> {task.latitude.toFixed(4)}, {task.longitude.toFixed(4)}</strong></div>
            </div>
          </div>

          <section className="volunteer-task-detail__map-section">
            <div className="volunteer-task-detail__section-heading">
              <div><span className="volunteer-task-detail__eyebrow">Địa điểm cứu trợ</span><h2>Vị trí nhiệm vụ</h2></div>
              <EnvironmentOutlined />
            </div>
            <div className="volunteer-task-detail__map">
              <MapContainer center={{ lat: task.latitude, lng: task.longitude }} zoom={14}>
                <AdvancedMarker position={{ lat: task.latitude, lng: task.longitude }} />
              </MapContainer>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

export default VolunteerTaskDetailPage