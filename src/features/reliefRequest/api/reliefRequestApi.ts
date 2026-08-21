import httpClient from '../../../api/httpClient'
import type {
    ReliefRequest,
    ReliefRequestPayload,
    ReliefTask,
    ReliefTaskPayload,
    SuitableVolunteer,
} from '../../../types/ReliefRequest'

const RELIEF_REQUEST_ENDPOINT = '/api/relief-requests'

export const getMyReliefRequests = async (): Promise<ReliefRequest[]> => {
    const response = await httpClient.get(`${RELIEF_REQUEST_ENDPOINT}?mine=true`)
    return response.data.result ?? []
}

export const getAllReliefRequests = async (): Promise<ReliefRequest[]> => {
    const response = await httpClient.get(`${RELIEF_REQUEST_ENDPOINT}?mine=false`)
    return response.data.result ?? []
}

export const getReliefRequest = async (requestId: string): Promise<ReliefRequest> => {
    const response = await httpClient.get(`${RELIEF_REQUEST_ENDPOINT}/${requestId}`)
    return response.data.result
}

export const createReliefRequest = async (payload: ReliefRequestPayload) => {
    const response = await httpClient.post(RELIEF_REQUEST_ENDPOINT, payload)
    return response.data.result as ReliefRequest
}

export const updateReliefRequest = async ({ requestId, payload }: { requestId: string; payload: ReliefRequestPayload }) => {
    const response = await httpClient.patch(`${RELIEF_REQUEST_ENDPOINT}/${requestId}`, payload)
    return response.data.result as ReliefRequest
}

export const cancelReliefRequest = async (requestId: string) => {
    await httpClient.delete(`${RELIEF_REQUEST_ENDPOINT}/${requestId}`)
}

const taskEndpoint = (requestId: string, taskId?: string) => (
    `${RELIEF_REQUEST_ENDPOINT}/${requestId}/tasks${taskId ? `/${taskId}` : ''}`
)

export const getReliefTasks = async (requestId: string): Promise<ReliefTask[]> => {
    const response = await httpClient.get(taskEndpoint(requestId))
    return response.data.result ?? []
}

export const getReliefTask = async (requestId: string, taskId: string): Promise<ReliefTask> => {
    const response = await httpClient.get(taskEndpoint(requestId, taskId))
    return response.data.result
}

export const createReliefTask = async ({ requestId, payload }: { requestId: string; payload: ReliefTaskPayload }) => {
    const response = await httpClient.post(taskEndpoint(requestId), payload)
    return response.data.result as ReliefTask
}

export const updateReliefTask = async ({ requestId, taskId, payload }: { requestId: string; taskId: string; payload: ReliefTaskPayload }) => {
    const response = await httpClient.patch(taskEndpoint(requestId, taskId), payload)
    return response.data.result as ReliefTask
}

export const deleteReliefTask = async ({ requestId, taskId }: { requestId: string; taskId: string }) => {
    await httpClient.delete(taskEndpoint(requestId, taskId))
}

export const completeReliefTask = async ({ requestId, taskId }: { requestId: string; taskId: string }) => {
    const response = await httpClient.put(`${taskEndpoint(requestId, taskId)}/complete`)
    return response.data.result as ReliefTask
}

export const getSuitableVolunteers = async (requestId: string, taskId: string): Promise<SuitableVolunteer[]> => {
    const response = await httpClient.get(`${taskEndpoint(requestId, taskId)}/suitable-volunteers`)
    return response.data.result ?? []
}

export const assignVolunteer = async ({ requestId, taskId, volunteerId }: { requestId: string; taskId: string; volunteerId: string }) => {
    const response = await httpClient.post(`${taskEndpoint(requestId, taskId)}/assignments/assign`, { volunteerId })
    return response.data.result
}