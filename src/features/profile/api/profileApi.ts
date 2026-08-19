import httpClient from '../../../api/httpClient'
import type { User } from '../../../types/User'

const PROFILE_ENDPOINT = '/api/me/profile'

export type UpdateProfileRequest = {
  fullName?: string
  email?: string
  phone?: string
  province?: string
}


export async function getProfile(): Promise<User> {
  const response= await httpClient.get(PROFILE_ENDPOINT);
  return response.data.result;
}

/* API update thật */
export async function updateProfile(
  data: UpdateProfileRequest,
) {
  const response = await httpClient.patch<User>(
    PROFILE_ENDPOINT,
    data,
  )

  return response.data
}