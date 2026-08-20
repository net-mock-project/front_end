import type {
  PaginationParams,
} from './Pagination'


export interface AuditLog {
  id: string
  userId: string
  action: string
  entityName: string
  entityId: string
  oldValue: string | null
  newValue: string | null
  createdAt: string
}


// Params lấy danh sách Audit Log
export interface GetAuditLogsParams
  extends PaginationParams {

  search?: string
}