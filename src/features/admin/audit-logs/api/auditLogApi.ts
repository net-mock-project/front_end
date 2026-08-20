import httpClient from '../../../../api/httpClient'

import type {
  AuditLog,
  GetAuditLogsParams,
} from '../../../../types/AuditLog'

import type {
  PaginationResult,
} from '../../../../types/Pagination'


const AUDIT_LOGS_ENDPOINT = '/api/audit-logs'


// Lấy danh sách Audit Log
export async function getAuditLogs(
  params: GetAuditLogsParams,
): Promise<PaginationResult<AuditLog>> {
  const response = await httpClient.get(
    AUDIT_LOGS_ENDPOINT,
    {
      params,
    },
  )

  return response.data.result
}


// Lấy chi tiết Audit Log
export async function getAuditLogDetail(
  auditLogId: string,
): Promise<AuditLog> {
  const response = await httpClient.get(
    `${AUDIT_LOGS_ENDPOINT}/${auditLogId}`,
  )

  return response.data.result
}