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

import type {
  AuditLogFilter,
  AuditLogSortDirection,
  AuditLogSortField,
} from '../../../../types/AuditLog'

import '../auditLogs.css'


function AuditLogsPage() {

  // ==========================
  // PAGINATION
  // ==========================

  const [
    pageNumber,
    setPageNumber,
  ] = useState(1)


  const [
    pageSize,
    setPageSize,
  ] = useState(10)


  // ==========================
  // SEARCH
  // ==========================

  const [
    search,
    setSearch,
  ] = useState('')


  // ==========================
  // FILTER
  // ==========================

  const [
    filters,
    setFilters,
  ] =
    useState<
      AuditLogFilter[]
    >([])


  // ==========================
  // SORT
  // ==========================

  const [
    sortBy,
    setSortBy,
  ] =
    useState<AuditLogSortField>(
      'createdAt',
    )


  const [
    sortDirection,
    setSortDirection,
  ] =
    useState<
      AuditLogSortDirection
    >('Desc')


  // ==========================
  // DETAIL
  // ==========================

  const [
    selectedAuditLogId,
    setSelectedAuditLogId,
  ] =
    useState<string | null>(
      null,
    )


  // ==========================
  // QUERY
  // ==========================

  const auditLogsQuery =
    useQuery({

      queryKey: [
        'audit-logs',

        pageNumber,

        pageSize,

        search,

        filters,

        sortBy,

        sortDirection,
      ],


      queryFn: () =>
        getAuditLogs({

          pageNumber,

          pageSize,

          search:
            search ||
            undefined,

          filters:
            filters.length > 0
              ? filters
              : undefined,

          sortBy,

          sortDirection,
        }),
    })


  // ==========================
  // SEARCH
  // ==========================

  const handleSearch = (
    value: string,
  ) => {

    setSearch(value)

    setPageNumber(1)
  }


  // ==========================
  // FILTER
  // ==========================

  const handleFiltersChange = (
    nextFilters:
      AuditLogFilter[],
  ) => {

    setFilters(
      nextFilters,
    )

    setPageNumber(1)
  }


  // ==========================
  // SORT
  // ==========================

  const handleSortChange = (
    field:
      AuditLogSortField,

    direction:
      AuditLogSortDirection,
  ) => {

    setSortBy(
      field,
    )

    setSortDirection(
      direction,
    )

    setPageNumber(1)
  }


  // ==========================
  // PAGINATION
  // ==========================

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
            Theo dõi các hành động
            và thay đổi trong hệ thống.
          </p>

        </div>

      </header>


      <AuditLogsTable

        auditLogs={
          auditLogsQuery
            .data
            ?.items ??
          []
        }


        totalCount={
          auditLogsQuery
            .data
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
          auditLogsQuery
            .isPending ||
          auditLogsQuery
            .isFetching
        }


        sortBy={
          sortBy
        }


        sortDirection={
          sortDirection
        }


        onSearch={
          handleSearch
        }


        onFiltersChange={
          handleFiltersChange
        }


        onSortChange={
          handleSortChange
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