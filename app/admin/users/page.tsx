import { getAllUsers } from "@/app/actions/user-mgnmt"
import { columns } from "@/components/columns-users"
import { UsersDataTable } from "@/components/table-data"
import { UsersTableSkeleton } from "@/components/skeleton"
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function UsersContent() {
  const users = await getAllUsers()

  return (
    <UsersDataTable columns={columns} data={users} />
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <UsersContent />
    </Suspense>
  )
}
