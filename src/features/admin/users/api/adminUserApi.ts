import httpClient from '../../../../api/httpClient'

import type {
  AdminUserDetail,
  AdminUserListItem,
  CreateUserRequest,
  CreateUserResponse,
  UserStatusResponse,
} from '../../../../types/User'

import type {
  PaginationResult,
} from '../../../../types/Pagination'

const USERS_ENDPOINT = '/api/users'


// Lấy danh sách User
export async function getUsers(
  params: {
    pageNumber: number
    pageSize: number
    search?: string
  },
): Promise<PaginationResult<AdminUserListItem>> {
  const response = await httpClient.get(
    USERS_ENDPOINT,
    {
      params,
    },
  )

  return response.data.result
}


// Lấy chi tiết User
export async function getUserDetail(
  userId: string,
): Promise<AdminUserDetail> {
  const response = await httpClient.get(
    `${USERS_ENDPOINT}/${userId}`,
  )

  return response.data.result
}


// Admin tạo User
export async function createUser(
  data: CreateUserRequest,
): Promise<CreateUserResponse> {
  const response = await httpClient.post(
    USERS_ENDPOINT,
    data,
  )

  return response.data.result
}


// Khóa User
export async function lockUser(
  userId: string,
): Promise<UserStatusResponse> {
  const response = await httpClient.patch(
    `${USERS_ENDPOINT}/${userId}/lock`,
  )

  return response.data.result
}


// Mở khóa User
export async function unlockUser(
  userId: string,
): Promise<UserStatusResponse> {
  const response = await httpClient.patch(
    `${USERS_ENDPOINT}/${userId}/unlock`,
  )

  return response.data.result
}