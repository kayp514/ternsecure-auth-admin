//v2: redict with taking priority from the sign-in page

'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { signInWithEmail, signInWithRedirectGoogle, signInWithMicrosoft } from '@/app/actions/fire-actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { getRedirectResult } from 'firebase/auth'
import { ternSecureAuth } from '@/lib/client-init'
import { createSessionCookie, setServerSession } from '@/app/providers/server/session'
import { useAuth } from '@/app/providers/hooks/useAuth'
import type { SignInResponse } from '@/lib/types'
import { User } from 'firebase/auth'
import { getErrorAlertVariant, handleFirebaseAuthError } from '@/lib/errors'

const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const appName = process.env.NEXT_PUBLIC_FIREBASE_APP_NAME || "TernSecure"


export interface SignInProps {
  redirectUrl?: string
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

export function SignIn({
  redirectUrl,
  onError,
  onSuccess,
  className,
  customStyles = {}
}: SignInProps) {
  const [loading, setLoading] = useState(false)
  const [checkingRedirect, setCheckingRedirect] = useState(true)
  const [formError, setFormError] = useState<SignInResponse | null>(null)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [authResponse, setAuthResponse] = useState<SignInResponse | null>(null)
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const { requiresVerification, error: authError, status } = useAuth()
  const isRedirectSignIn = searchParams.get('signInRedirect') === 'true'


  const handleSuccessfulAuth = useCallback(
    async (user: User) => {
      try {
        const idToken = await user.getIdToken()
        await setServerSession(idToken)
        const sessionResult = await createSessionCookie(idToken)

        if (!sessionResult.success) {
          setFormError({
            success: false, 
            message: "Failed to create session", 
            error: 'INTERNAL_ERROR', 
            user: null
          })
        }

        onSuccess?.()

        // Use the finalRedirectUrl for navigation
        if (process.env.NODE_ENV === "production") {
          // Use window.location.href in production for a full page reload
          window.location.href = '/'
        } else {
          // Use router.push in development
          router.push('/')
        }
      } catch (err) {
        setFormError({
          success: false, 
          message: "Failed to complete authentication", 
          error: 'INTERNAL_ERROR', 
          user: null
        })
      }
    },
    [router, onSuccess],
  )



  const handleRedirectResult = useCallback(async () => {
    if (!isRedirectSignIn) return false
    setCheckingRedirect(true)
    try {
      console.log('Checking redirect result...');
      console.log('Current hostname:', window.location.hostname);
      console.log('Auth domain hostname:', authDomain);

    const isOnAuth = authDomain && 
    window.location.hostname === authDomain.replace(/https?:\/\//, '');
    console.log('Is on  AuthDomain:', isOnAuth);


      const result = await getRedirectResult(ternSecureAuth)
      console.log('Redirect result:', result);
      if (result) {
        const idToken = await result.user.getIdToken()
        const sessionResult = await createSessionCookie(idToken)
        if (!sessionResult.success) {
          throw new Error('Failed to create session')
        }
        const storedRedirectUrl = sessionStorage.getItem('auth_return_url')
        sessionStorage.removeItem('auth_redirect_url') 
        onSuccess?.()
        window.location.href = storedRedirectUrl || '/'
        return true
      }
      setCheckingRedirect(false)
    } catch (err) { 
      console.error('Redirect result error:', err)
      const errorMessage = err as SignInResponse
      setFormError(errorMessage)
      if (onError && err instanceof Error) {
        onError(err)
      }
      sessionStorage.removeItem('auth_redirect_url')
      return false
    }
  }, [isRedirectSignIn, redirectUrl, searchParams, onSuccess, onError])

 //const REDIRECT_TIMEOUT = 5000;

  useEffect(() => {
    if (isRedirectSignIn) {
      handleRedirectResult()
    }
  }, [handleRedirectResult, isRedirectSignIn])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)
    setAuthResponse(null)

    try {
      const response= await signInWithEmail(email, password)

      if (!response.success) {
        setFormError(response)
        return
      }

      if (response.user) {
        if(requiresVerification && !response.user.emailVerified) {
          setFormError({
            success: false, 
            message: 'Email verification required', 
            error: 'EMAIL_NOT_VERIFIED', 
            user: response.user
          })
          return
      }

      await handleSuccessfulAuth(response.user)
    }
    } catch (err) {
      const errorMessage = err as SignInResponse
      setFormError(errorMessage)
      if (onError && err instanceof Error) {
        onError(err)
      }
    } finally {
      setLoading(false)
    }
  }


  const handleVerificationRedirect = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/sign-in/verify")
  }


  if (checkingRedirect && isRedirectSignIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          
        </div>
      </div>
    )
  }


const activeError = formError || authResponse
const showEmailVerificationButton =
  activeError?.error === "EMAIL_NOT_VERIFIED" || activeError?.error === "REQUIRES_VERIFICATION"

  return (
    <div className="relative flex items-center justify-center">
    <Card className={cn("w-full max-w-md mx-auto mt-8", className, customStyles.card)}>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className={cn("font-bold", customStyles.title)}>Sign in to {`${appName}`} </CardTitle>
        <CardDescription className={cn("text-muted-foreground", customStyles.description)}>
          Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeError && (
            <Alert variant={getErrorAlertVariant(activeError)} className="animate-in fade-in-50">
              <AlertDescription>
              <span>{activeError.message}</span>
              {showEmailVerificationButton && (
                    <Button
                      type='button'
                      variant="link"
                      className="p-0 h-auto font-normal text-sm hover:underline"
                      onClick={handleVerificationRedirect}
                    >
                      Request new verification email →
                    </Button>
                  )}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className={cn(customStyles.label)}>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={cn(customStyles.input)}
              required
              aria-invalid={activeError?.error === "INVALID_EMAIL"}
              aria-describedby={activeError ? "error-message" : undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className={cn(customStyles.label)}>Password</Label>
            <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              disabled={loading}
              className={cn(customStyles.input)}
              required
              aria-invalid={activeError?.error === "INVALID_CREDENTIALS"}
              aria-describedby={activeError ? "error-message" : undefined}
            />
          <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className={cn("w-full", customStyles.button)}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}
