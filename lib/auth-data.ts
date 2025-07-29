import { UserData } from "@/lib/types"

export function getUserRoles(user: UserData): string[] {
    const roles: string[] = []
  
    if (user.isAdmin) roles.push("admin")
    if (user.isSuperuser) roles.push("superuser")
    if (user.isStaff) roles.push("staff")
    if (!user.isAdmin && !user.isSuperuser && !user.isStaff) roles.push("member")
  
    return roles
  }

  export function getPrimaryRole(user: UserData): string {
    if (user.isAdmin) return "admin"
    if (user.isSuperuser) return "superuser"
    if (user.isStaff) return "staff"
    return "member"
  }