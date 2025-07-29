import type React from "react";
import { AdminHeader } from "@/components/admin-headers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <AdminHeader />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-3.5 px-2.5 my-3.5 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <div className="space-y-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
