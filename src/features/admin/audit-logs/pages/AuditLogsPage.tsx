import {
  useQuery,
} from '@tanstack/react-query'

import {
  useState,
} from 'react'

import {
  getAuditLogs,
} from '../api/auditLogApi'

import AuditLogsTable
  from '../components/AuditLogsTable'

import AuditLogDetailModal
  from '../components/AuditLogDetailModal'

import '../auditLogs.css'


function AuditLogsPage() {

  const [
    pageNumber,
    setPageNumber,
  ] = useState(1)

  const [
    pageSize,
    setPageSize,
  ] = useState(10)

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    selectedAuditLogId,
    setSelectedAuditLogId,
  ] = useState<string | null>(
    null,
  )


  // Lấy danh sách Audit Log
  const auditLogsQuery =
    useQuery({

      queryKey: [
        'audit-logs',
        pageNumber,
        pageSize,
        search,
      ],

      queryFn: () =>
        getAuditLogs({
          pageNumber,
          pageSize,

          search:
            search ||
            undefined,
        }),
    })


  const handleSearch = (
    value: string,
  ) => {
    setSearch(value)
    setPageNumber(1)
  }


  const handlePageChange = (
    nextPageNumber: number,
    nextPageSize: number,
  ) => {
    setPageNumber(
      nextPageNumber,
    )

    setPageSize(
      nextPageSize,
    )
  }


  return (
    <main className="audit-logs-page">

      <header className="audit-logs-page__header">

        <div>
          <div className="audit-logs-page__breadcrumb">
            Admin / Audit Log
          </div>

          <h1>
            Nhật ký hoạt động
          </h1>

          <p>
            Theo dõi các hành động và thay đổi trong hệ thống.
          </p>
        </div>

      </header>


      <AuditLogsTable
        auditLogs={
          auditLogsQuery.data
            ?.items ??
          []
        }

        totalCount={
          auditLogsQuery.data
            ?.totalCount ??
          0
        }

        pageNumber={
          pageNumber
        }

        pageSize={
          pageSize
        }

        loading={
          auditLogsQuery.isPending ||
          auditLogsQuery.isFetching
        }

        onSearch={
          handleSearch
        }

        onPageChange={
          handlePageChange
        }

        onView={
          setSelectedAuditLogId
        }
      />


      <AuditLogDetailModal
        auditLogId={
          selectedAuditLogId
        }

        open={
          !!selectedAuditLogId
        }

        onClose={() =>
          setSelectedAuditLogId(
            null,
          )
        }
      />

    </main>
  )
}


export default AuditLogsPage