import httpClient from '../../../api/httpClient'
import type { UserProfile } from '../../../types/User'

const PROFILE_ENDPOINT = '/api/me/profile'

export type UpdateProfileRequest = {
  fullName?: string
  email?: string
  phone?: string
  province?: string
}

/* Tạm thời dùng dữ liệu test vì BE chưa có GET Profile */
export async function getProfile(): Promise<UserProfile> {
  return {
    fullName: 'Minh Anh',
    role: 'Volunteer',
    profileUrl: null,
    email: 'minhanh@example.com',
    phone: '0901234567',
    province: 'Hồ Chí Minh',
  }
}

/* API update thật */
export async function updateProfile(
  data: UpdateProfileRequest,
) {
  const response = await httpClient.patch<UserProfile>(
    PROFILE_ENDPOINT,
    data,
  )

  return response.data
}