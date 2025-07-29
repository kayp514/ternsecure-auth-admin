import { getAllUsers } from "@/app/actions/user-mgnmt"
import { columns } from "@/components/columns-users"
import { UsersDataTable } from "@/components/table-data"

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getAllUsers()

  return <UsersDataTable columns={columns} data={users} />

}
