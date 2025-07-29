"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsersSearchFilters } from "@/components/users-search";
import { UsersPagination } from "@/components/users-pagination";
import { UserActionsCell } from "@/components/users-action-cell";
import type { UserData } from "@/lib/types";
import { PageHeader, PageWrapper } from "@/components/page-layout";

interface UsersDataTableProps {
  columns: ColumnDef<UserData>[];
  data: UserData[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  isLoading?: boolean;
}

export function UsersDataTable({
  columns,
  data,
  totalUsers,
  totalPages,
  currentPage,
  onPageChange,
  globalFilter,
  onGlobalFilterChange,
  isLoading,
}: UsersDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    uid: false,
    role: false,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Users"
        description="Manage users, their roles, and permissions."
      />
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <UsersSearchFilters
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={onGlobalFilterChange}
          disabled={isLoading}
        />
        <div className="border-t overflow-hidden">
          <div className="overflow-x-auto min-w-0">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => {
                        if (cell.column.id === "actions") {
                          return (
                            <TableCell
                              key={cell.id}
                              className="px-2 py-3 align-top"
                            >
                              <UserActionsCell user={row.original} />
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell
                            key={cell.id}
                            className={`px-2 py-3 ${
                              cell.column.id === "email" ? "max-w-[200px]" : ""
                            }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <UsersPagination
          totalUsers={totalUsers}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      </div>
    </PageWrapper>
  );
}
