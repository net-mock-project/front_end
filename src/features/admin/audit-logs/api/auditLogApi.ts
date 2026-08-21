import httpClient
  from '../../../../api/httpClient'

import type {
  AuditLog,
  GetAuditLogsParams,
} from '../../../../types/AuditLog'

import type {
  PaginationResult,
} from '../../../../types/Pagination'


const AUDIT_LOGS_ENDPOINT =
  '/api/audit-logs'


export async function getAuditLogs(
  params: GetAuditLogsParams,
): Promise<
  PaginationResult<AuditLog>
> {

  const response =
    await httpClient.get(
      AUDIT_LOGS_ENDPOINT,
      {
        params: {
          pageNumber:
            params.pageNumber,

          pageSize:
            params.pageSize,

          search:
            params.search ||
            undefined,

          filters:
            params.filters
              ?.length
              ? JSON.stringify(
                  params.filters,
                )
              : undefined,

          sortBy:
            params.sortBy,

          sortDirection:
            params.sortDirection,
        },
      },
    )

  return response.data.result
}


export async function getAuditLogDetail(
  auditLogId: string,
): Promise<AuditLog> {

  const response =
    await httpClient.get(
      `${AUDIT_LOGS_ENDPOINT}/${auditLogId}`,
    )

  return response.data.result
}