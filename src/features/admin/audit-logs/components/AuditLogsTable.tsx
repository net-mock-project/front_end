import {
  Button,
  Input,
  Space,
  Table,
  Tag,
  type TableProps,
} from 'antd'

import dayjs from 'dayjs'

import type {
  AuditLog,
} from '../../../../types/AuditLog'


type AuditLogsTableProps = {
  auditLogs: AuditLog[]
  totalCount: number
  pageNumber: number
  pageSize: number
  loading: boolean

  onSearch: (value: string) => void

  onPageChange: (
    pageNumber: number,
    pageSize: number,
  ) => void

  onView: (
    auditLogId: string,
  ) => void
}


// Rút gọn Guid trên Table
function shortId(id: string) {
  return `${id.slice(0, 8)}...`
}


// Màu theo hành động
function getActionColor(action: string) {
  switch (action.toLowerCase()) {
    case 'create':
    case 'unlock':
    case 'approve':
      return 'success'

    case 'lock':
    case 'delete':
      return 'error'

    case 'update':
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
  onSearch,
  onPageChange,
  onView,
}: AuditLogsTableProps) {

  const columns:
    TableProps<AuditLog>['columns'] = [

    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,

      render: (createdAt: string) =>
        dayjs(createdAt).format(
          'DD/MM/YYYY HH:mm',
        ),
    },


    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',

      render: (action: string) => (
        <Tag color={getActionColor(action)}>
          {action}
        </Tag>
      ),
    },


    {
      title: 'Đối tượng',
      dataIndex: 'entityName',
      key: 'entityName',

      render: (entityName: string) => (
        <Tag>
          {entityName}
        </Tag>
      ),
    },


    {
      title: 'Người thực hiện',
      dataIndex: 'userId',
      key: 'userId',

      render: (userId: string) => (
        <span title={userId}>
          {shortId(userId)}
        </span>
      ),
    },


    {
      title: 'Đối tượng ID',
      dataIndex: 'entityId',
      key: 'entityId',

      render: (entityId: string) => (
        <span title={entityId}>
          {shortId(entityId)}
        </span>
      ),
    },


    {
      title: 'Thao tác',
      key: 'actions',

      render: (_, auditLog) => (
        <Space>
          <Button
            type="link"
            onClick={() =>
              onView(auditLog.id)
            }
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ]


  return (
    <section className="audit-logs-card">

      <div className="audit-logs-toolbar">

        <Input.Search
          allowClear
          placeholder="Tìm theo hành động, đối tượng hoặc nội dung thay đổi"
          onSearch={(value) =>
            onSearch(value.trim())
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


      <Table<AuditLog>
        rowKey="id"
        columns={columns}
        dataSource={auditLogs}
        loading={loading}

        scroll={{
          x: 900,
        }}

        pagination={{
          current: pageNumber,
          pageSize,
          total: totalCount,

          showSizeChanger: true,

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
              nextPageSize !== pageSize
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