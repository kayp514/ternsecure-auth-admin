import { adminTernSecureAuth as adminAuth } from "./admin-init"
import { cookies } from "next/headers"

export interface AuthUser {
  uid: string
  email: string
  role: string
  customClaims: Record<string, any>
}

export async function verifyAuth(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("_session_cookie")?.value

    if (!token) {
      return null
    }

    const decodedToken = await adminAuth.verifySessionCookie(token)
    const userRecord = await adminAuth.getUser(decodedToken.uid)

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      role: decodedToken.role || "user",
      customClaims: decodedToken,
    }
  } catch (error) {
    console.error("Auth verification failed:", error)
    return null
  }
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await verifyAuth()

  if (!user) {
    throw new Error("Admin access required")
  }

  return user
}
