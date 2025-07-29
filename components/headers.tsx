"use client"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-layout"
import {  Download, Plus, Trash2, UserPlus } from "lucide-react"


interface UsersHeaderProps {
  onCreateUser: () => void
  onBulkDelete: () => void
}

interface TenantHeaderProps {
  selectedCount: number
  onCreateTenant: () => void
  onBulkDelete: () => void
}


export function TenantHeader({ selectedCount, onCreateTenant, onBulkDelete }: TenantHeaderProps) {
  return (
    <PageHeader
      title="Tenants Management"
      description="Manage your VogatPBX tenants, organizations, and their settings"
      actions={
        <>
          {selectedCount > 0 ? (
            <>
              <Button variant="outline" size="sm" className="text-red-600" onClick={onBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedCount})
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" onClick={onCreateTenant}>
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </>
          )}
        </>
      }
    />
  )
}

export function UsersHeader({ onCreateUser, onBulkDelete }: UsersHeaderProps) {
  return (
    <PageHeader
      title="User Management"
      description="Manage system users, roles, and permissions"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={onCreateUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </>
      }
    />
  )
}

