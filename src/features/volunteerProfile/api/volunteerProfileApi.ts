import httpClient from '../../../api/httpClient'
import axios from 'axios'
import type {
  VolunteerProfile,
  VolunteerProfilePayload,
} from '../../../types/VolunteerProfile'

const VOLUNTEER_PROFILE_ENDPOINT = '/api/volunteers/profile'

export async function getVolunteerProfile(): Promise<VolunteerProfile | null> {
  try {
    const response = await httpClient.get(VOLUNTEER_PROFILE_ENDPOINT)
    return response.data.result ?? null
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 404) return null
    }

    throw error
  }
}

export async function createVolunteerProfile(
  payload: VolunteerProfilePayload,
): Promise<VolunteerProfile> {
  const response = await httpClient.post(VOLUNTEER_PROFILE_ENDPOINT, payload)
  return response.data.result
}

export async function updateVolunteerProfile(
  payload: VolunteerProfilePayload,
): Promise<VolunteerProfile> {
  const response = await httpClient.put(VOLUNTEER_PROFILE_ENDPOINT, payload)
  return response.data.result
}

export async function deleteVolunteerProfile(): Promise<void> {
  await httpClient.delete(VOLUNTEER_PROFILE_ENDPOINT)
}
