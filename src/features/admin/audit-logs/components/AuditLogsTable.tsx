import {
  Button,
  DatePicker,
  Input,
  Select,
  Space,
  Table,
  Tag,
  type TableProps,
} from 'antd'

import {
  useState,
} from 'react'

import dayjs from 'dayjs'

import type {
  AuditLog,
  AuditLogFilter,
  AuditLogSortDirection,
  AuditLogSortField,
} from '../../../../types/AuditLog'


type AuditLogsTableProps = {
  auditLogs: AuditLog[]
  totalCount: number
  pageNumber: number
  pageSize: number
  loading: boolean

  sortBy: AuditLogSortField
  sortDirection:
    AuditLogSortDirection

  onSearch: (
    value: string,
  ) => void

  onFiltersChange: (
    filters: AuditLogFilter[],
  ) => void

  onSortChange: (
    field: AuditLogSortField,
    direction:
      AuditLogSortDirection,
  ) => void

  onPageChange: (
    pageNumber: number,
    pageSize: number,
  ) => void

  onView: (
    auditLogId: string,
  ) => void
}


type DateFilter = {
  from: string
  to: string
}


const actionOptions = [
  'Create',
  'Update',
  'Approve',
  'Assign',
  'Accept',
  'Lock',
  'Unlock',
].map((value) => ({
  value,
  label: value,
}))


const entityOptions = [
  'User',
  'ReliefRequest',
  'ReliefTask',
  'TaskAssignment',
  'Donation',
  'Warehouse',
  'Transaction',
  'VolunteerEngagement',
].map((value) => ({
  value,
  label: value,
}))


function shortId(
  id: string,
) {
  return `${id.slice(0, 8)}...`
}


function getActionColor(
  action: string,
) {
  switch (
    action.toLowerCase()
  ) {
    case 'create':
    case 'unlock':
      return 'success'

    case 'lock':
    case 'delete':
      return 'error'

    case 'update':
    case 'approve':
      return 'processing'

    case 'assign':
    case 'accept':
      return 'warning'

    default:
      return 'default'
  }
}


function AuditLogsTable({
  auditLogs,
  totalCount,
  pageNumber,
  pageSize,
  loading,
  sortBy,
  sortDirection,
  onSearch,
  onFiltersChange,
  onSortChange,
  onPageChange,
  onView,
}: AuditLogsTableProps) {

  const [
    actionFilter,
    setActionFilter,
  ] = useState<string>()

  const [
    entityFilter,
    setEntityFilter,
  ] = useState<string>()

  const [
    dateFilter,
    setDateFilter,
  ] =
    useState<DateFilter | null>(
      null,
    )


  const applyFilters = (
    action?: string,
    entity?: string,
    date?: DateFilter | null,
  ) => {
    const nextFilters:
      AuditLogFilter[] = []


    if (action) {
      nextFilters.push({
        field: 'action',
        value: action,
        operator: 'Equals',
      })
    }


    if (entity) {
      nextFilters.push({
        field: 'entityName',
        value: entity,
        operator: 'Equals',
      })
    }


    if (date) {
      nextFilters.push({
        field: 'createdAt',
        value: date.from,
        operator:
          'GreaterThanOrEqual',
      })

      nextFilters.push({
        field: 'createdAt',
        value: date.to,
        operator: 'LessThan',
      })
    }


    onFiltersChange(
      nextFilters,
    )
  }


  const getSortOrder = (
    field: AuditLogSortField,
  ) => {
    if (sortBy !== field) {
      return null
    }

    return sortDirection === 'Asc'
      ? 'ascend'
      : 'descend'
  }


  const columns:
    TableProps<AuditLog>['columns'] = [

    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,

      sorter: true,

      sortOrder:
        getSortOrder(
          'createdAt',
        ),

      render: (
        createdAt: string,
      ) =>
        dayjs(
          createdAt,
        ).format(
          'DD/MM/YYYY HH:mm',
        ),
    },


    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',

      sorter: true,

      sortOrder:
        getSortOrder(
          'action',
        ),

      render: (
        action: string,
      ) => (
        <Tag
          color={
            getActionColor(
              action,
            )
          }
        >
          {action}
        </Tag>
      ),
    },


    {
      title: 'Đối tượng',
      dataIndex: 'entityName',
      key: 'entityName',

      sorter: true,

      sortOrder:
        getSortOrder(
          'entityName',
        ),

      render: (
        entityName: string,
      ) => (
        <Tag>
          {entityName}
        </Tag>
      ),
    },


    {
      title: 'Người thực hiện',
      dataIndex: 'userId',
      key: 'userId',

      sorter: true,

      sortOrder:
        getSortOrder(
          'userId',
        ),

      render: (
        userId: string,
      ) => (
        <span title={userId}>
          {shortId(userId)}
        </span>
      ),
    },


    {
      title: 'Đối tượng ID',
      dataIndex: 'entityId',
      key: 'entityId',

      sorter: true,

      sortOrder:
        getSortOrder(
          'entityId',
        ),

      render: (
        entityId: string,
      ) => (
        <span title={entityId}>
          {shortId(entityId)}
        </span>
      ),
    },


    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,

      render: (
        _,
        auditLog,
      ) => (
        <Space>
          <Button
            type="link"

            onClick={() =>
              onView(
                auditLog.id,
              )
            }
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ]


  const handleTableChange:
    TableProps<AuditLog>['onChange'] =
    (
      _,
      __,
      sorter,
      extra,
    ) => {

      if (
        extra.action !==
        'sort'
      ) {
        return
      }


      const currentSorter =
        Array.isArray(sorter)
          ? sorter[0]
          : sorter


      if (
        !currentSorter.field ||
        !currentSorter.order
      ) {
        onSortChange(
          'createdAt',
          'Desc',
        )

        return
      }


      const field =
        String(
          currentSorter.columnKey ??
          currentSorter.field,
        ) as AuditLogSortField


      const direction:
        AuditLogSortDirection =
        currentSorter.order ===
        'ascend'
          ? 'Asc'
          : 'Desc'


      onSortChange(
        field,
        direction,
      )
    }


  return (
    <section className="audit-logs-card">

      <div className="audit-logs-toolbar">

        <Input.Search
          allowClear

          placeholder="Tìm theo hành động, đối tượng hoặc nội dung thay đổi"

          onSearch={(
            value,
          ) =>
            onSearch(
              value.trim(),
            )
          }
        />


        <span>
          Tổng:{' '}
          <strong>
            {totalCount}
          </strong>
          {' '}bản ghi
        </span>

      </div>


      <div className="audit-logs-filters">

        <DatePicker.RangePicker
          placeholder={[
            'Từ ngày',
            'Đến ngày',
          ]}

          onChange={(
            dates,
          ) => {

            if (
              !dates?.[0] ||
              !dates?.[1]
            ) {
              setDateFilter(
                null,
              )

              applyFilters(
                actionFilter,
                entityFilter,
                null,
              )

              return
            }


            const nextDate:
              DateFilter = {

              from:
                dates[0]
                  .startOf(
                    'day',
                  )
                  .format(
                    'YYYY-MM-DDTHH:mm:ss',
                  ),

              to:
                dates[1]
                  .add(
                    1,
                    'day',
                  )
                  .startOf(
                    'day',
                  )
                  .format(
                    'YYYY-MM-DDTHH:mm:ss',
                  ),
            }


            setDateFilter(
              nextDate,
            )


            applyFilters(
              actionFilter,
              entityFilter,
              nextDate,
            )
          }}
        />


        <Select
          allowClear
          showSearch

          placeholder="Hành động"

          value={
            actionFilter
          }

          options={
            actionOptions
          }

          optionFilterProp="label"

          style={{
            width: 160,
          }}

          onChange={(
            value,
          ) => {

            setActionFilter(
              value,
            )

            applyFilters(
              value,
              entityFilter,
              dateFilter,
            )
          }}
        />


        <Select
          allowClear
          showSearch

          placeholder="Đối tượng"

          value={
            entityFilter
          }

          options={
            entityOptions
          }

          optionFilterProp="label"

          style={{
            width: 190,
          }}

          onChange={(
            value,
          ) => {

            setEntityFilter(
              value,
            )

            applyFilters(
              actionFilter,
              value,
              dateFilter,
            )
          }}
        />

      </div>


      <Table<AuditLog>
        rowKey="id"

        columns={
          columns
        }

        dataSource={
          auditLogs
        }

        loading={
          loading
        }

        onChange={
          handleTableChange
        }

        sortDirections={[
          'ascend',
          'descend',
        ]}

        scroll={{
          x: 900,
        }}

        pagination={{
          current:
            pageNumber,

          pageSize,

          total:
            totalCount,

          showSizeChanger:
            true,

          pageSizeOptions: [
            10,
            20,
            50,
          ],

          onChange: (
            nextPage,
            nextPageSize,
          ) => {

            onPageChange(
              nextPageSize !==
                pageSize
                ? 1
                : nextPage,

              nextPageSize,
            )
          },
        }}
      />

    </section>
  )
}


export default AuditLogsTable