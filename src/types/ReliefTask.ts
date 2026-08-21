export type ReliefaskStatus = 'Pending' | 'InProgress' | string

export interface ReliefTask {
  id: string
  requestId: string
  title: string
  description: string
  requiredVolunteers: number
  priority: number
  latitude: number
  longitude: number
  status: ReliefaskStatus
  taskSkills: string[]
  createdAt: string
  updatedAt: string | null
}