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


export interface GetAuditLogsParams {
  pageNumber: number
  pageSize: number
  search?: string
}