import { EnvironmentOutlined, RightOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ReliefTask } from '../../../types/ReliefTask'

interface VolunteerTaskCardProps {
  task: ReliefTask
}

const statusLabels: Record<string, string> = {
  Pending: 'Đang chờ',
  InProgress: 'Đang thực hiện',
  Completed: 'Hoàn thành',
}

function VolunteerTaskCard({ task }: VolunteerTaskCardProps) {
  const navigate = useNavigate()
  const statusLabel = statusLabels[task.status] ?? task.status
  const createdDate = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
  }).format(new Date(task.createdAt))

  return (
    <article className="volunteer-task-card">
      <div className="volunteer-task-card__topline">
        <Tag color={task.status === 'InProgress' ? 'blue' : 'gold'}>
          {statusLabel}
        </Tag>
        <span className="volunteer-task-card__priority">
          Ưu tiên {task.priority}/5
        </span>
      </div>

      <h2>{task.title}</h2>
      <p className="volunteer-task-card__description">{task.description}</p>

      <div className="volunteer-task-card__meta">
        <span><TeamOutlined /> {task.requiredVolunteers} volunteer</span>
        <span><EnvironmentOutlined /> {task.latitude.toFixed(4)}, {task.longitude.toFixed(4)}</span>
      </div>

      <footer>
        <span>Giao ngày {createdDate}</span>
        <Button
          type="link"
          icon={<RightOutlined />}
          iconPosition="end"
          onClick={() => navigate(`/my-tasks/${task.id}`)}
        >
          Xem chi tiết
        </Button>
      </footer>
    </article>
  )
}

export default VolunteerTaskCard