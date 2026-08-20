export type Gender = 'Male' | 'Female' | 'Other'

export type UserStatus =
  | 'Active'
  | 'Inactive'
  | 'Suspended'

export interface User {
    userId: number;
    fullName: string;
    email: string;
    status: string;
    province: string | null;
    profileUrl: string | null;
    roleName: string;
    phone: string | null;
    dateOfBirth?: string | null;
    gender?: Gender | null;
    location: {
        latitude: number;
        longitude: number;
    };
}

// User hiển thị trong danh sách Admin
export interface AdminUserListItem {
  id: string
  roleId: string
  roleName: string
  fullName: string
  email: string
  phone: string
  province: string | null
  profileUrl: string | null
  status: UserStatus
  isVerified: boolean
  createdAt: string
}


// User hiển thị trong màn chi tiết
export interface AdminUserDetail {
  id: string
  roleId: string
  roleName: string
  fullName: string
  email: string
  phone: string
  profileUrl: string | null
  dateOfBirth: string | null
  gender: Gender | null
  province: string | null
  status: UserStatus
  isVerified: boolean
  createdAt: string
  updatedAt: string | null
  reliefRequestCount: number
  donationCount: number
  taskCompletedCount: number
}


// Payload Admin tạo User
export interface CreateUserRequest {
  roleName: string
  province?: string
  fullName: string
  email: string
  phone: string
  dateOfBirth?: string
  gender?: Gender
  password: string
}


// Response sau khi tạo User
export interface CreateUserResponse {
  userId: string
}


// Response sau khi khóa / mở khóa User
export interface UserStatusResponse {
  id: string
  status: UserStatus
  updatedAt: string | null
}


// Kết quả phân trang từ BE
export interface PaginationResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}