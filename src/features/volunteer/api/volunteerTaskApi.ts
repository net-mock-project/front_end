import httpClient from '../../../api/httpClient'
import type { ReliefTask } from '../../../types/ReliefTask'

const VOLUNTEER_TASKS_ENDPOINT = '/api/me/tasks'

export async function getMyVolunteerTasks(): Promise<ReliefTask[]> {
  const response = await httpClient.get(VOLUNTEER_TASKS_ENDPOINT)
  return response.data.result
}

export async function getVolunteerTaskDetail(taskId: string): Promise<ReliefTask> {
  const response = await httpClient.get(`${VOLUNTEER_TASKS_ENDPOINT}/${taskId}`)
  return response.data.result
}