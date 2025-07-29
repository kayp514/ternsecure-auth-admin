'use server'

import { cookies } from 'next/headers';
import { adminTernSecureAuth as adminAuth } from '@/lib/admin-init';

interface FirebaseAuthError extends Error {
  code?: string;
}

export interface User {
    uid: string | null;
    email: string | null;
  }

export interface Session {
    user: User | null;
    token: string | null;
    error: Error | null;
}

export interface UserStatus {
  isValid: boolean
  error?: string
  userId?: string
}

export async function createSessionCookie(idToken: string) {
  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

      const cookieStore = await cookies();
      cookieStore.set('_session_cookie', sessionCookie, {
          maxAge: expiresIn,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
      });
      return { success: true, message: 'Session created' };
  } catch {
      return { success: false, message: 'Failed to create session' };
  }
}



export async function getServerSessionCookie() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('_session_cookie')?.value;

  if (!sessionCookie) {
    throw new Error('No session cookie found')
  }
    
  try {
    const decondeClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
    return {
      token: sessionCookie,
      userId: decondeClaims.uid
    }
  } catch (error) {
    console.error('Error verifying session:', error)
    throw new Error('Invalid Session')
  }
}


export async function getIdToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('_session_token')?.value;

  if (!token) {
    throw new Error('No session cookie found')
  }
    
  try {
    const decodedClaims = await adminAuth.verifyIdToken(token)
    return {
      token: token,
      userId: decodedClaims.uid
    }
  } catch (error) {
    console.error('Error verifying session:', error)
    throw new Error('Invalid Session')
  }
}

export async function setServerSession(token: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set('_tern', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    return { success: true, message: 'Session created' };
  } catch {
    return { success: false, message: 'Failed to create session' };
  }
}

  export async function verifyTernIdToken(token: string): Promise<{ valid: boolean; uid?: string; error?: string }> {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      return { valid: true, uid: decodedToken.uid };
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as FirebaseAuthError;
        if (error.name === 'FirebaseAuthError') {
          // Handle specific Firebase Auth errors
          switch (firebaseError.code) {
            case 'auth/id-token-expired':
              return { valid: false, error: 'Token has expired' };
            case 'auth/id-token-revoked':
              return { valid: false, error: 'Token has been revoked' };
            case 'auth/user-disabled':
              return { valid: false, error: 'User account has been disabled' };
            default:
              return { valid: false, error: 'Invalid token' };
          }
        }
      }
      return { valid: false, error: 'Error verifying token' };
    }
  }
  

  export async function verifyTernSessionCookie(session: string): Promise<{ valid: boolean; uid?: string; error?: string }>{
    try {
      const res = await adminAuth.verifySessionCookie(session);
      if (res) {
        return { valid: true, uid: res.uid };
      } else {
        return { valid: false, error: 'Invalid session'};
      }
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as FirebaseAuthError;
        if (error.name === 'FirebaseAuthError') {
          // Handle specific Firebase Auth errors
          switch (firebaseError.code) {
            case 'auth/id-token-expired':
              return { valid: false, error: 'Token has expired' };
            case 'auth/id-token-revoked':
              return { valid: false, error: 'Token has been revoked' };
            case 'auth/user-disabled':
              return { valid: false, error: 'User account has been disabled' };
            default:
              return { valid: false, error: 'Invalid token' };
          }
        }
      }
      return {error: 'Error verifying token', valid: false}
    }
  }

  export async function clearSessionCookie() {
    const cookieStore = await cookies()
    
    cookieStore.delete('_session_cookie')
    cookieStore.delete('_session_token')
    cookieStore.delete('_session')
  
    try {
      // Verify if there's an active session before revoking
      const sessionCookie = cookieStore.get('_session_cookie')?.value
      if (sessionCookie) {
        // Get the decoded claims to get the user's ID
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
        
        // Revoke all sessions for the user
        await adminAuth.revokeRefreshTokens(decodedClaims.uid)
      }
      
      return { success: true, message: 'Session cleared successfully' }
    } catch (error) {
      console.error('Error clearing session:', error)
      // Still return success even if revoking fails, as cookies are cleared
      return { success: true, message: 'Session cookies cleared' }
    }
  }


  export async function verifyUser(): Promise<UserStatus> {
    try {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get('_session_cookie')?.value
  
      if (!sessionCookie) {
        return { isValid: false }
      }
  
      // Verify the session cookie
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
      console.log(decodedClaims)
      
      // Additional check to ensure user still exists and is not disabled
      const user = await adminAuth.getUser(decodedClaims.uid)
      
      if (user.disabled) {
        throw new Error('User account is disabled or email not verified')
      }
  
      return {
        isValid: true,
        userId: user.uid
      }
    } catch (error) {
      console.error('Error verifying user:', error)
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Failed to verify user'
      }
    }
  }