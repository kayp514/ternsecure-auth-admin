import { FirebaseOptions } from 'firebase/app'

export type UserRole = "admin" | "superuser" | "user" | "guest" | "member" | "staff"

export interface UserData {
  uid: string
  email: string
  tenantId: string
  disabled: boolean
  createdAt: string
  lastSignInAt: string
  isAdmin?: boolean
  isSuperuser?: boolean
  isStaff?: boolean
  role?: UserRole
  customClaims: Record<string, any>
}

export type UserStatus = 'online' | 'offline' | 'away' | 'busy' | 'unknown';


/**
 * TernSecure Firebase configuration interface
 * Extends Firebase's base configuration options
 */
export interface TernSecureConfig extends FirebaseOptions {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string // Optional for analytics
}

/**
 * TernSecure initialization options
 */
export interface TernSecureOptions {
  /** Environment setting for different configurations */
  environment?: 'development' | 'production'
  /** Geographic region for data storage */
  region?: string
  /** Custom error handler */
  onError?: (error: Error) => void
  /** Debug mode flag */
  debug?: boolean
}

/**
 * Firebase initialization state
 */
export interface FirebaseState {
  /** Whether Firebase has been initialized */
  initialized: boolean
  /** Any initialization errors */
  error: Error | null
  /** Timestamp of last initialization attempt */
  lastInitAttempt?: number
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  isValid: boolean
  errors: string[]
  config: TernSecureConfig
}

/**
 * Firebase Admin configuration interface
 */
export interface TernSecureAdminConfig {
  projectId: string
  clientEmail: string
  privateKey: string
}

/**
 * Firebase Admin configuration validation result
 */
export interface AdminConfigValidationResult {
  isValid: boolean
  errors: string[]
  config: TernSecureAdminConfig
}



export interface TernSecureState {
  userId: string | null
  isLoaded: boolean
  error: Error | null
  isValid: boolean
  isVerified: boolean
  isAuthenticated: boolean
  token: any | null
  email: string | null
  status: "loading" | "authenticated" | "unauthenticated" | "unverified"
  requiresVerification: boolean
}

export interface RedirectConfig {
  // URL to redirect to after successful authentication
  redirectUrl?: string
  // Whether this is a return visit (e.g. after sign out)
  isReturn?: boolean
  // Priority of the redirect (higher number = higher priority)
  priority?: number
}

export interface SignInProps extends RedirectConfig {
  onError?: (error: Error) => void
  onSuccess?: () => void
  className?: string
  customStyles?: {
    card?: string
    input?: string
    button?: string
    label?: string
    separator?: string
    title?: string
    description?: string
    socialButton?: string
  }
}

/**
 * Base user interface with essential properties from token
 * Used by server-side auth
 */
export interface BaseUser {
  uid: string
  email: string | null
  emailVerified?: boolean
  tenantId: string | null
  authTime?: number
  disabled?: boolean
}


/**
 * Maps to Firebase UserInfo interface
 * Basic user information
 */
export interface TernSecureUser extends BaseUser {
  displayName: string | null
  email: string | null
  phoneNumber: string | null
  photoURL: string | null
  uid: string
}

/**
 * Maps to Firebase User interface
 * Complete user information available client-side
 */
export interface CurrentUser extends TernSecureUser {
  emailVerified: boolean
  isAnonymous: boolean
  metadata: {
    creationTime?: string
    lastSignInTime?: string
  }
  providerData: TernSecureUser[]
  refreshToken: string
  tenantId: string | null
}

export interface FirebaseAuthUser {
  uid: string
  email: string | null
  displayName?: string | null
  photoURL?: string | null
  tenantId: string
  emailVerified: boolean
  phoneNumber: string | null
  metadata: {
      creationTime: string | undefined
      lastSignInTime: string | undefined
    }
}

export interface SessionResult {
  isAuthenticated: boolean
  user: BaseUser | null
  error?: string
}