"use server"

import { adminTernSecureAuth as adminAuth } from "@/lib/admin-init"
import { requireAdmin } from "@/lib/auth-middleware"
import { revalidatePath } from "next/cache"
import type { UserData } from "@/lib/types"
import { redis, type DisabledUserRecord } from "@/lib/redis"


export async function getAllUsers(): Promise<UserData[]> {
  await requireAdmin()

  try {
    const listUsersResult = await adminAuth.listUsers(1000)

    return listUsersResult.users.map((user) => ({
      uid: user.uid,
      email: user.email || "",
      disabled: user.disabled,
      createdAt: user.metadata.creationTime,
      lastSignInAt: user.metadata.lastSignInTime,
      customClaims: user.customClaims || {},
    }))
  } catch (error) {
    console.error("Failed to fetch users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function disableUser(uid: string): Promise<void> {
  await requireAdmin()

  try {
    await redis.set(`disabled_user:${uid}`, JSON.stringify({ uid, disabled: true }))
    await adminAuth.updateUser(uid, { disabled: true })
    revalidatePath("/admin/users")
  } catch (error) {
    console.error("Failed to disable user:", error)
    throw new Error("Failed to disable user")
  }
}

export async function enableUser(uid: string): Promise<void> {
  await requireAdmin()

  try {
    await adminAuth.updateUser(uid, { disabled: false })
    revalidatePath("/admin/users")
  } catch (error) {
    console.error("Failed to enable user:", error)
    throw new Error("Failed to enable user")
  }
}

export async function deleteUser(uid: string): Promise<void> {
  await requireAdmin()

  try {
    await adminAuth.deleteUser(uid)
    revalidatePath("/admin/users")
  } catch (error) {
    console.error("Failed to delete user:", error)
    throw new Error("Failed to delete user")
  }
}

export async function setUserRole(uid: string, role: string): Promise<void> {
  await requireAdmin()

  try {
    await adminAuth.setCustomUserClaims(uid, { role })
    revalidatePath("/admin/users")
  } catch (error) {
    console.error("Failed to set user role:", error)
    throw new Error("Failed to set user role")
  }
}