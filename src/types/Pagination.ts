export interface PaginationParams {
  pageNumber: number
  pageSize: number
}

export interface PaginationResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}