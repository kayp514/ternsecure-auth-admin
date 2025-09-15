"use server";

import { adminTernSecureAuth as adminAuth } from "@/lib/admin-init";
import { revalidatePath } from "next/cache";
import type { UserData } from "@/lib/types";
import { redis, type DisabledUserRecord } from "@/lib/redis";

export async function getAllUsers(): Promise<UserData[]> {

  try {
    let allUsers: UserData[] = [];
    let nextPageToken: string | undefined = undefined;
    do {
      const listUsersResult = await adminAuth.listUsers(1000, nextPageToken);

      const batchUsers = listUsersResult.users.map((user) => ({
        uid: user.uid,
        tenantId: user.tenantId || "",
        email: user.email || "",
        disabled: user.disabled,
        customClaims: user.customClaims || {},
        createdAt: user.metadata.creationTime,
        lastSignInAt: user.metadata.lastSignInTime,
      }));

      allUsers = allUsers.concat(batchUsers);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    return allUsers;
  } catch (error) {
    console.error("Failed to fetch all users:", error);
    throw new Error("Failed to fetch all users");
  }
}

export async function disableUser(uid: string): Promise<void> {
  try {
    await adminAuth.updateUser(uid, { disabled: true });
    //await redis.set(
    //  `disabled_user:${uid}`,
    //  JSON.stringify({ uid, disabled: true })
    //);

    const user = await adminAuth.getUser(uid);
    const disabledRecord: DisabledUserRecord = {
      uid: user.uid,
      email: user.email || "",
      disabledTime: new Date().toISOString(),
    };
    await redis.set(`disabled_user:${uid}`, disabledRecord);
    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Failed to disable user:", error);
    throw new Error("Failed to disable user");
  }
}

export async function enableUser(uid: string): Promise<void> {
  try {
    await redis.del(`disabled_user:${uid}`);
    await adminAuth.updateUser(uid, { disabled: false });
    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Failed to enable user:", error);
    throw new Error("Failed to enable user");
  }
}

export async function deleteUser(uid: string): Promise<void> {

  try {
    await adminAuth.deleteUser(uid);
    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function setUserRole(uid: string, role: string): Promise<void> {
  try {
    await adminAuth.setCustomUserClaims(uid, { role });
    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Failed to set user role:", error);
    throw new Error("Failed to set user role");
  }
}

export async function revalidateUsersPage(): Promise<void> {
  revalidatePath("/admin/users");
}

export async function getDisabledUsers(): Promise<DisabledUserRecord[]> {
  try {
    const keys = await redis.keys("disabled_user:*");
    if (keys.length === 0) return [];

    const records = await redis.mget(...keys);
    return records.filter(Boolean) as DisabledUserRecord[];
  } catch (error) {
    console.error("Failed to fetch disabled users from Redis:", error);
    return [];
  }
}

export async function getDisabledUserRecord(
  uid: string
): Promise<DisabledUserRecord | null> {
  try {
    const record = await redis.get(`disabled_user:${uid}`);
    return record as DisabledUserRecord | null;
  } catch (error) {
    console.error("Failed to fetch disabled user record from Redis:", error);
    return null;
  }
}
