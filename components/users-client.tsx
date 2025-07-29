"use client"

import { useState, useMemo } from "react"
import type { UserData } from "@/lib/types"
import { UsersDataTable } from "@/components/table-data"
import type { ColumnDef } from "@tanstack/react-table"

interface UsersPageClientProps {
  data: UserData[]
  columns: ColumnDef<UserData>[]
}

export function UsersPageClient({ data, columns }: UsersPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [globalFilter, setGlobalFilter] = useState("")
  const itemsPerPage = 10

  const filteredUsers = useMemo(() => {
    if (!globalFilter) return data

    const searchTerm = globalFilter.toLowerCase()
    return data.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm) ||
        user.uid.toLowerCase().includes(searchTerm) ||
        (user.customClaims?.role && user.customClaims.role.toLowerCase().includes(searchTerm)),
    )
  }, [data, globalFilter])

  const totalUsers = filteredUsers.length
  const totalPages = Math.ceil(totalUsers / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // Reset to first page when search changes
  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <UsersDataTable
      columns={columns}
      data={currentUsers}
      totalUsers={totalUsers}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      globalFilter={globalFilter}
      onGlobalFilterChange={handleGlobalFilterChange}
      isLoading={false}
    />
  )
}
