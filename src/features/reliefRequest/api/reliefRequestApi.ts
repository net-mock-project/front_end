import httpClient from '../../../api/httpClient'
import type { ReliefRequest, ReliefRequestPayload } from '../../../types/ReliefRequest'

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