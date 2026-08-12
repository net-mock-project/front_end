import httpClient from '../../../api/httpClient'
import type { User } from '../../../types/User'

const PROFILE_ENDPOINT = '/api/me/profile'

export type UpdateProfileRequest = {
  fullName?: string
  email?: string
  phone?: string
  province?: string
}

/* Tạm thời dùng dữ liệu test vì BE chưa có GET Profile */
export async function getProfile(): Promise<User> {
  return {
    userId: 1,
    fullName: 'Minh Anh',
    role: 'Volunteer',
    profileUrl: "",
    email: 'minhanh@example.com',
    phoneNumber: '0901234567',
    province: 'Hồ Chí Minh',
    status: 'ACTIVE',
    location: {
      latitude: 10.762622,
      longitude: 106.660172,
    },
  }
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