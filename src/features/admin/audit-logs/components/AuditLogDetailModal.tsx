import {
  Descriptions,
  Modal,
  Spin,
  Tag,
} from 'antd'

import {
  useQuery,
} from '@tanstack/react-query'

import dayjs from 'dayjs'

import {
  getAuditLogDetail,
} from '../api/auditLogApi'


type AuditLogDetailModalProps = {
  auditLogId: string | null
  open: boolean
  onClose: () => void
}


// Format JSON nếu OldValue/NewValue là JSON
function formatValue(
  value: string | null,
) {
  if (!value) {
    return '-'
  }

  try {
    return JSON.stringify(
      JSON.parse(value),
      null,
      2,
    )
  } catch {
    return value
  }
}


function AuditLogDetailModal({
  auditLogId,
  open,
  onClose,
}: AuditLogDetailModalProps) {

  const {
    data: auditLog,
    isPending,
    isError,
  } = useQuery({

    queryKey: [
      'audit-log-detail',
      auditLogId,
    ],

    queryFn: () =>
      getAuditLogDetail(
        auditLogId!,
      ),

    enabled:
      open &&
      !!auditLogId,
  })


  return (
    <Modal
      className="audit-log-detail-modal"
      title="Chi tiết Audit Log"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnHidden
    >

      {isPending && (
        <div className="audit-log-detail-loading">
          <Spin />
        </div>
      )}


      {isError && (
        <div>
          Không thể tải chi tiết Audit Log.
        </div>
      )}


      {auditLog && (
        <>
          <Descriptions
            bordered
            column={2}
            size="small"

            items={[
              {
                key: 'id',
                label: 'ID Audit Log',
                span: 2,
                children:
                  auditLog.id,
              },

              {
                key: 'createdAt',
                label: 'Thời gian',
                children:
                  dayjs(
                    auditLog.createdAt,
                  ).format(
                    'DD/MM/YYYY HH:mm:ss',
                  ),
              },

              {
                key: 'action',
                label: 'Hành động',
                children: (
                  <Tag>
                    {auditLog.action}
                  </Tag>
                ),
              },

              {
                key: 'userId',
                label: 'User ID',
                children:
                  auditLog.userId,
              },

              {
                key: 'entityName',
                label: 'Đối tượng',
                children:
                  auditLog.entityName,
              },

              {
                key: 'entityId',
                label: 'Entity ID',
                span: 2,
                children:
                  auditLog.entityId,
              },
            ]}
          />


          <div className="audit-log-detail__changes">

            <div>
              <h4>
                Giá trị trước
              </h4>

              <pre>
                {formatValue(
                  auditLog.oldValue,
                )}
              </pre>
            </div>


            <div>
              <h4>
                Giá trị sau
              </h4>

              <pre>
                {formatValue(
                  auditLog.newValue,
                )}
              </pre>
            </div>

          </div>
        </>
      )}

    </Modal>
  )
}


export default AuditLogDetailModal