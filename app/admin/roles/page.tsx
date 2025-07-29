import { RoleManagement } from "@/components/role"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
        <p className="text-gray-600">Define and manage user roles and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Roles</CardTitle>
          <CardDescription>Configure roles and their associated permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <RoleManagement />
        </CardContent>
      </Card>
    </div>
  )
}
