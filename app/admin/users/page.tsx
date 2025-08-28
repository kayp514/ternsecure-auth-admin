import { getAllUsers } from "@/app/actions/user-mgnmt";
import { UsersPageClient } from "@/components/users-client";
import { UsersTableSkeleton } from "@/components/skeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function UsersContent() {
  const users = await getAllUsers();

  return <UsersPageClient data={users} />;
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <UsersContent />
    </Suspense>
  );
}
