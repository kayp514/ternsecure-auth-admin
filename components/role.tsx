"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

interface Role {
  id: string
  name: string
  permissions: string[]
}

const availablePermissions = [
  "read_users",
  "write_users",
  "delete_users",
  "manage_roles",
  "access_admin",
  "view_analytics",
]

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([
    { id: "1", name: "admin", permissions: availablePermissions },
    { id: "2", name: "moderator", permissions: ["read_users", "write_users", "view_analytics"] },
    { id: "3", name: "user", permissions: ["read_users"] },
  ])

  const [newRoleName, setNewRoleName] = useState("")
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([])

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast.error('', {
        description: "Role name is required.",
      })
      return
    }

    const newRole: Role = {
      id: Date.now().toString(),
      name: newRoleName.toLowerCase(),
      permissions: newRolePermissions,
    }

    setRoles([...roles, newRole])
    setNewRoleName("")
    setNewRolePermissions([])

    toast.success(`Role "${newRoleName}" has been created successfully.`)
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId))
    toast.success("Role deleted successfully.")
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setNewRolePermissions([...newRolePermissions, permission])
    } else {
      setNewRolePermissions(newRolePermissions.filter((p) => p !== permission))
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg capitalize">{role.name}</CardTitle>
                <CardDescription>{role.permissions.length} permissions assigned</CardDescription>
              </div>
              {role.name !== "admin" && (
                <Button variant="destructive" size="sm" onClick={() => handleDeleteRole(role.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <Badge key={permission} variant="secondary">
                    {permission.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Role</CardTitle>
          <CardDescription>Define a new role with specific permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Enter role name"
            />
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {availablePermissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={newRolePermissions.includes(permission)}
                    onCheckedChange={(checked) => handlePermissionChange(permission, checked as boolean)}
                  />
                  <Label htmlFor={permission} className="text-sm">
                    {permission.replace("_", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleCreateRole} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
