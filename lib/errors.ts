import { SignInResponse } from "./types"

export type ErrorCode = keyof typeof ERRORS

export interface AuthErrorResponse {
  success: false
  message: string
  code: ErrorCode
}

export const ERRORS = {
  SERVER_SIDE_INITIALIZATION: "TernSecure must be initialized on the client side",
  REQUIRES_VERIFICATION: "AUTH_REQUIRES_VERIFICATION",
  AUTHENTICATED: "AUTHENTICATED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  UNVERIFIED: "UNVERIFIED",
  NOT_INITIALIZED: "TernSecure services are not initialized. Call initializeTernSecure() first",
  HOOK_CONTEXT: "Hook must be used within TernSecureProvider",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_DISABLED: "USER_DISABLED",
  TOO_MANY_ATTEMPTS: "TOO_MANY_ATTEMPTS",
  NETWORK_ERROR: "NETWORK_ERROR",
  INVALID_EMAIL: "INVALID_EMAIL",
  WEAK_PASSWORD: "WEAK_PASSWORD",
  EMAIL_EXISTS: "EMAIL_EXISTS",
  POPUP_BLOCKED: "POPUP_BLOCKED",
  OPERATION_NOT_ALLOWED: "OPERATION_NOT_ALLOWED",
  EXPIRED_TOKEN: "EXPIRED_TOKEN",
  INVALID_TOKEN: "INVALID_TOKEN",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const

// Firebase Auth Error Code patterns
const ERROR_PATTERNS = {
  INVALID_EMAIL: /auth.*invalid.*email|invalid.*email.*auth|Firebase:.*Error.*auth\/invalid-email/i,
  INVALID_CREDENTIALS:
    /auth.*invalid.*credential|invalid.*password|wrong.*password|Firebase:.*Error.*auth\/(invalid-credential|wrong-password|user-not-found)/i,
  USER_DISABLED: /user.*disabled|disabled.*user|Firebase:.*Error.*auth\/user-disabled/i,
  TOO_MANY_ATTEMPTS: /too.*many.*attempts|too.*many.*requests|Firebase:.*Error.*auth\/too-many-requests/i,
  NETWORK_ERROR: /network.*request.*failed|failed.*network|Firebase:.*Error.*auth\/network-request-failed/i,
  OPERATION_NOT_ALLOWED: /operation.*not.*allowed|method.*not.*allowed|Firebase:.*Error.*auth\/operation-not-allowed/i,
  POPUP_BLOCKED: /popup.*blocked|blocked.*popup|Firebase:.*Error.*auth\/popup-blocked/i,
  EMAIL_EXISTS: /email.*exists|email.*already.*use|Firebase:.*Error.*auth\/email-already-in-use/i,
  EXPIRED_TOKEN: /token.*expired|expired.*token|Firebase:.*Error.*auth\/expired-token/i,
  INVALID_TOKEN: /invalid.*token|token.*invalid|Firebase:.*Error.*auth\/invalid-token/i,
  SESSION_EXPIRED: /session.*expired|expired.*session|Firebase:.*Error.*auth\/session-expired/i,
  WEAK_PASSWORD: /weak.*password|password.*weak|Firebase:.*Error.*auth\/weak-password/i,
} as const

export class TernSecureError extends Error {
  code: ErrorCode

  constructor(code: ErrorCode, message?: string) {
    super(message || code)
    this.name = "TernSecureError"
    this.code = code
  }
}

interface SerializedFirebaseError {
  name?: string
  code?: string
  message?: string
  stack?: string
}

/**
 * Determines if an object matches the shape of a Firebase Error
 */
function isFirebaseErrorLike(error: unknown): error is SerializedFirebaseError {
  if (!error || typeof error !== "object") return false

  const err = error as SerializedFirebaseError

  // Check for bundled Firebase error format: "Firebase: Error (auth/error-code)"
  if (typeof err.message === "string") {
    const bundledErrorMatch = err.message.match(/Firebase:\s*Error\s*$$auth\/([^)]+)$$/)
    if (bundledErrorMatch) {
      // Add the extracted code to the error object
      err.code = `auth/${bundledErrorMatch[1]}`
      return true
    }
  }

  return (
    (typeof err.code === "string" && err.code.startsWith("auth/")) ||
    (typeof err.name === "string" && err.name.includes("FirebaseError"))
  )
}

/**
 * Extracts the error code from a Firebase-like error object
 */
function extractFirebaseErrorCode(error: SerializedFirebaseError): string {
  // First try to extract from bundled error message format
  if (typeof error.message === "string") {
    const bundledErrorMatch = error.message.match(/Firebase:\s*Error\s*$$auth\/([^)]+)$$/)
    if (bundledErrorMatch) {
      return bundledErrorMatch[1]
    }
  }

  // Then try the standard code property
  if (error.code) {
    return error.code.replace("auth/", "")
  }

  // Finally try to extract from error message if it contains an error code
  if (typeof error.message === "string") {
    const messageCodeMatch = error.message.match(/auth\/([a-z-]+)/)
    if (messageCodeMatch) {
      return messageCodeMatch[1]
    }
  }

  return ""
}

/**
 * Maps a Firebase error code to our internal error code
 */
function mapFirebaseErrorCode(code: string): ErrorCode {
  // Direct mapping for known error codes
  const directMappings: Record<string, ErrorCode> = {
    "invalid-email": "INVALID_EMAIL",
    "user-disabled": "USER_DISABLED",
    "too-many-requests": "TOO_MANY_ATTEMPTS",
    "network-request-failed": "NETWORK_ERROR",
    "operation-not-allowed": "OPERATION_NOT_ALLOWED",
    "popup-blocked": "POPUP_BLOCKED",
    "email-already-in-use": "EMAIL_EXISTS",
    "weak-password": "WEAK_PASSWORD",
    "invalid-credential": "INVALID_CREDENTIALS",
    "wrong-password": "INVALID_CREDENTIALS",
    "user-not-found": "INVALID_CREDENTIALS",
    "invalid-password": "INVALID_CREDENTIALS",
    "user-token-expired": "EXPIRED_TOKEN",
    "invalid-id-token": "INVALID_TOKEN",
  }

  return directMappings[code] || "INTERNAL_ERROR"
}

/**
 * Determines error type based on error message pattern matching
 */
function determineErrorTypeFromMessage(message: string): ErrorCode {
  // First check for bundled Firebase error format
  const bundledErrorMatch = message.match(/Firebase:\s*Error\s*$$auth\/([^)]+)$$/)
  if (bundledErrorMatch) {
    const errorCode = bundledErrorMatch[1]
    const mappedCode = mapFirebaseErrorCode(errorCode)
    if (mappedCode) {
      return mappedCode
    }
  }

  // Then check standard patterns
  for (const [errorType, pattern] of Object.entries(ERROR_PATTERNS)) {
    if (pattern.test(message)) {
      return errorType as ErrorCode
    }
  }

  return "INTERNAL_ERROR"
}

/**
 * Creates a standardized error response
 */
function createErrorResponse(code: ErrorCode, message: string): AuthErrorResponse {
  const defaultMessages: Record<ErrorCode, string> = {
    INVALID_EMAIL: "Invalid email format",
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_DISABLED: "This account has been disabled",
    TOO_MANY_ATTEMPTS: "Too many attempts. Please try again later",
    NETWORK_ERROR: "Network error. Please check your connection",
    OPERATION_NOT_ALLOWED: "This login method is not enabled",
    POPUP_BLOCKED: "Login popup was blocked. Please enable popups",
    EMAIL_EXISTS: "This email is already in use",
    EXPIRED_TOKEN: "Your session has expired. Please login again",
    INVALID_TOKEN: "Invalid authentication token",
    SESSION_EXPIRED: "Your session has expired",
    WEAK_PASSWORD: "Password is too weak",
    EMAIL_NOT_VERIFIED: "Email verification required",
    INTERNAL_ERROR: "An internal error occurred. Please try again",
    SERVER_SIDE_INITIALIZATION: "TernSecure must be initialized on the client side",
    REQUIRES_VERIFICATION: "Email verification required",
    AUTHENTICATED: "Already authenticated",
    UNAUTHENTICATED: "Authentication required",
    UNVERIFIED: "Email verification required",
    NOT_INITIALIZED: "TernSecure services are not initialized",
    HOOK_CONTEXT: "Hook must be used within TernSecureProvider",
  }

  return {
    success: false,
    message: message || defaultMessages[code],
    code,
  }
}

/**
 * Handles Firebase authentication errors with multiple fallback mechanisms
 */
export function handleFirebaseAuthError(error: unknown): AuthErrorResponse {
  // Helper to extract clean error code from bundled format
  function extractBundledErrorCode(message: string): string | null {
    const match = message.match(/Firebase:\s*Error\s*\(auth\/([^)]+)\)/);
    return match ? match[1] : null;
  }

  // Helper to get final error details
  function getErrorDetails(code: string): AuthErrorResponse {
    // Remove 'auth/' prefix if present
    const cleanCode = code.replace('auth/', '');
    
    switch (cleanCode) {
      case 'invalid-email':
        return { success: false, message: 'Invalid email format', code: 'INVALID_EMAIL' };
      case 'invalid-credential':
      case 'invalid-login-credentials':
      case 'wrong-password':
      case 'user-not-found':
        return { success: false, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' };
      case 'user-disabled':
        return { success: false, message: 'This account has been disabled', code: 'USER_DISABLED' };
      case 'too-many-requests':
        return { success: false, message: 'Too many attempts. Please try again later', code: 'TOO_MANY_ATTEMPTS' };
      case 'network-request-failed':
        return { success: false, message: 'Network error. Please check your connection', code: 'NETWORK_ERROR' };
      case 'email-already-in-use':
        return { success: false, message: 'This email is already in use', code: 'EMAIL_EXISTS' };
      case 'weak-password':
        return { success: false, message: 'Password is too weak', code: 'WEAK_PASSWORD' };
      case 'operation-not-allowed':
        return { success: false, message: 'This login method is not enabled', code: 'OPERATION_NOT_ALLOWED' };
      case 'popup-blocked':
        return { success: false, message: 'Login popup was blocked. Please enable popups', code: 'POPUP_BLOCKED' };
      case 'expired-action-code':
      case 'user-token-expired':
        return { success: false, message: 'Your session has expired. Please login again', code: 'EXPIRED_TOKEN' };
      default:
        return { success: false, message: 'An unexpected error occurred', code: 'INTERNAL_ERROR' };
    }
  }

  try {
    // Case 1: Error is an object
    if (error && typeof error === 'object') {
      const errorObj = error as { code?: string; message?: string };
      
      // Check for bundled error message first
      if (errorObj.message) {
        const bundledCode = extractBundledErrorCode(errorObj.message);
        if (bundledCode) {
          return getErrorDetails(bundledCode);
        }
      }

      // Then check for regular error code
      if (errorObj.code) {
        return getErrorDetails(errorObj.code);
      }
    }

    // Case 2: Error is a string
    if (typeof error === 'string') {
      const bundledCode = extractBundledErrorCode(error);
      if (bundledCode) {
        return getErrorDetails(bundledCode);
      }
    }

    // Case 3: Try to stringify the error
    const errorString = String(error);
    const bundledCode = extractBundledErrorCode(errorString);
    if (bundledCode) {
      return getErrorDetails(bundledCode);
    }

  } catch (e) {
    // Fallback for any parsing errors
  }

  // Last resort fallback
  return {
    success: false,
    message: 'An unexpected error occurred. Please try again later',
    code: 'INTERNAL_ERROR'
  };
}

/**
 * Type guard to check if a response is an AuthErrorResponse
 */
export function isAuthErrorResponse(response: unknown): response is AuthErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    (response as { success: boolean }).success === false &&
    "code" in response &&
    "message" in response
  )
}



export function getErrorAlertVariant(error: SignInResponse | undefined) {
 if (!error) return "destructive"

  switch (error.error) {
    case "AUTHENTICATED":
      return "default"
    case "EMAIL_EXISTS":
    case "UNAUTHENTICATED":
    case "UNVERIFIED":
    case "REQUIRES_VERIFICATION":
    case "INVALID_EMAIL":
    case "INVALID_TOKEN":
    case "INTERNAL_ERROR":
    case "USER_DISABLED":
    case "TOO_MANY_ATTEMPTS":
    case "NETWORK_ERROR":
    case "SESSION_EXPIRED":
    case "EXPIRED_TOKEN":
    case "INVALID_CREDENTIALS":
    case "INVALID_EMAIL":
    case "INVALID_TOKEN":
    case "INTERNAL_ERROR":
    case "USER_DISABLED":
    case "TOO_MANY_ATTEMPTS":
    case "NETWORK_ERROR":
    case "INVALID_CREDENTIALS":
    default:
      return "destructive"
  }
}