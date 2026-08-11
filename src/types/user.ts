export type UserRole =
  | 'Requester'
  | 'Volunteer'
  | 'Coordinator'
  | 'Admin'

/* Thông tin tối thiểu dùng ở Header, Sidebar, Avatar */
export type UserSummary = {
  fullName: string
  role: UserRole
  profileUrl?: string | null
}

/* Thông tin đầy đủ dùng cho trang hồ sơ cá nhân */
export type UserProfile = UserSummary & {
  email?: string | null
  phone?: string | null
  province?: string | null
}