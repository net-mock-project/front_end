import {
  Button,
} from 'antd'

import {
  PlusOutlined,
} from '@ant-design/icons'

import {
  useQuery,
} from '@tanstack/react-query'

import {
  useState,
} from 'react'

import {
  getUsers,
} from '../api/adminUserApi'

import AdminUsersTable
  from '../components/AdminUsersTable'

import CreateUserModal
  from '../components/CreateUserModal'

import UserDetailModal
  from '../components/UserDetailModal'

import '../adminUsers.css'


function AdminUsersPage() {

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
    selectedUserId,
    setSelectedUserId,
  ] = useState<string | null>(
    null,
  )

  const [
    isCreateOpen,
    setIsCreateOpen,
  ] = useState(false)


  // Lấy danh sách User
  const usersQuery =
    useQuery({

      queryKey: [
        'admin-users',
        pageNumber,
        pageSize,
        search,
      ],

      queryFn: () =>
        getUsers({
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
    <main className="admin-users-page">

      <header className="admin-users-page__header">

        <div>

          <div className="admin-users-page__breadcrumb">
            Admin / Quản lý người dùng
          </div>

          <h1>
            Quản lý người dùng
          </h1>

          <p>
            Xem danh sách, tạo mới và quản lý trạng thái tài khoản.
          </p>

        </div>


        <Button
          type="primary"
          icon={
            <PlusOutlined />
          }
          onClick={() =>
            setIsCreateOpen(
              true,
            )
          }
        >
          Thêm người dùng
        </Button>

      </header>


      <AdminUsersTable
        users={
          usersQuery.data
            ?.items ??
          []
        }

        totalCount={
          usersQuery.data
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
          usersQuery.isPending ||
          usersQuery.isFetching
        }

        onSearch={
          handleSearch
        }

        onPageChange={
          handlePageChange
        }

        onView={
          setSelectedUserId
        }
      />


      <CreateUserModal
        open={
          isCreateOpen
        }

        onClose={() =>
          setIsCreateOpen(
            false,
          )
        }
      />


      <UserDetailModal
        userId={
          selectedUserId
        }

        open={
          !!selectedUserId
        }

        onClose={() =>
          setSelectedUserId(
            null,
          )
        }
      />

    </main>
  )
}


export default AdminUsersPage