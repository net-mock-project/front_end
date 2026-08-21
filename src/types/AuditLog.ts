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


export type FilterOperator =
  | 'Equals'
  | 'NotEquals'
  | 'Contains'
  | 'GreaterThan'
  | 'GreaterThanOrEqual'
  | 'LessThan'
  | 'LessThanOrEqual'


export type AuditLogFilterField =
  | 'id'
  | 'userId'
  | 'entityId'
  | 'action'
  | 'entityName'
  | 'createdAt'


export interface AuditLogFilter {
  field: AuditLogFilterField
  value: string
  operator: FilterOperator
}


export type AuditLogSortField =
  | 'userId'
  | 'action'
  | 'entityName'
  | 'entityId'
  | 'createdAt'


export type AuditLogSortDirection =
  | 'Asc'
  | 'Desc'


export interface GetAuditLogsParams
  extends PaginationParams {

  search?: string

  filters?: AuditLogFilter[]

  sortBy?: AuditLogSortField

  sortDirection?:
    AuditLogSortDirection
}