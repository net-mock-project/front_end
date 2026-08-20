import httpClient from '../../../api/httpClient'
import type { Gender } from '../../../types/Enums'
import type { User } from '../../../types/User'

const PROFILE_ENDPOINT = '/api/me/profile'
const AVATAR_ENDPOINT = '/api/me/profile/avatar'

export type UpdateProfileRequest = {
  fullName?: string
  phone?: string
  dateOfBirth?: string
  gender?: Gender
}

// API lấy thông tin hồ sơ người dùng
export async function getProfile(): Promise<User> {
  const response= await httpClient.get(PROFILE_ENDPOINT);
  return response.data.result;
}

// API cập nhật thông tin hồ sơ
export async function updateProfile(
  data: UpdateProfileRequest,
) {
  const response = await httpClient.patch(
    PROFILE_ENDPOINT,
    data,
  )

  return response.data.result
}

// API cập nhật ảnh đại diện
export async function updateAvatar(file: File) {
  const formData = new FormData()

  formData.append('avatar', file)

  const response = await httpClient.patch(
    AVATAR_ENDPOINT,
    formData,
  )

  return response.data.result
}