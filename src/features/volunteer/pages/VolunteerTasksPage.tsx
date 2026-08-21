import { useQuery } from '@tanstack/react-query'

import { getMyVolunteerTasks } from '../api/volunteerTaskApi'
import VolunteerTaskCard from '../components/VolunteerTaskCard'
import '../volunteerTasks.css'

function VolunteerTasksPage() {
  const tasksQuery = useQuery({
    queryKey: ['volunteer-tasks'],
    queryFn: getMyVolunteerTasks,
  })

  if (tasksQuery.isPending) {
    return (
      <main className="volunteer-tasks-page">
        <div className="volunteer-tasks-page__state">Đang tải danh sách nhiệm vụ...</div>
      </main>
    )
  }

  if (tasksQuery.isError) {
    return (
      <main className="volunteer-tasks-page">
        <div className="volunteer-tasks-page__state volunteer-tasks-page__state--error">
          Không thể tải danh sách nhiệm vụ. Vui lòng thử lại sau.
        </div>
      </main>
    )
  }

  const tasks = tasksQuery.data ?? []

  return (
    <main className="volunteer-tasks-page">
      <header className="volunteer-tasks-page__header">
        <div className="volunteer-tasks-page__breadcrumb">Volunteer / Nhiệm vụ</div>
        <h1>Nhiệm vụ của tôi</h1>
        <p>Theo dõi những hoạt động cứu trợ đang được phân công cho bạn.</p>
      </header>

      {tasks.length === 0 ? (
        <div className="volunteer-tasks-page__state">Hiện chưa có nhiệm vụ nào được phân công.</div>
      ) : (
        <>
          <div className="volunteer-tasks-page__toolbar">
            <h2>Nhiệm vụ đang phân công</h2>
            <strong className="volunteer-tasks-page__count">{tasks.length} nhiệm vụ</strong>
          </div>
          <section className="volunteer-tasks-page__grid" aria-label="Danh sách nhiệm vụ">
            {tasks.map((task) => <VolunteerTaskCard key={task.id} task={task} />)}
          </section>
        </>
      )}
    </main>
  )
}

export default VolunteerTasksPage