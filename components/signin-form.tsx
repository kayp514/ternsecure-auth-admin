"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  useSignIn,
  useSignInContext,
  useTernSecure,
} from "@tern-secure/nextjs";
import type { SignInResponse, TernSecureUser } from "@tern-secure/nextjs";

const appName = process.env.NEXT_PUBLIC_FIREBASE_APP_NAME || "TernSecure";

export interface SignInProps {
  redirectUrl?: string;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  className?: string;
  customStyles?: {
    card?: string;
    input?: string;
    button?: string;
    label?: string;
    separator?: string;
    title?: string;
    description?: string;
    socialButton?: string;
  };
}

export function SignIn({ className, ...props }: React.ComponentProps<"div">) {
  const { signIn, isLoaded } = useSignIn();
  const { handleSignInSuccess, redirectAfterSignIn } = useSignInContext();
  const { createActiveSession } = useTernSecure();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<SignInResponse | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  if (!isLoaded) {
    return null;
  }

  const handleSuccess = (user: TernSecureUser | null) => {
    if (user) {
      handleSignInSuccess(user);
    }
  };

  const signInPasswordField = async () => {
    const res = await signIn.withEmailAndPassword({ email, password });
    if (res.status === "error") {
      setFormError({
        status: "error",
        error: res.error,
        message: res.message,
      });
    }

    if (res.status === "success") {
      createActiveSession({ session: res.user });
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    return signInPasswordField();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className={cn("w-full max-w-md mx-auto mt-8", className)}>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className={cn("font-bold")}>
            Sign in to {`${appName}`}{" "}
          </CardTitle>
          <CardDescription className={cn("text-muted-foreground")}>
            Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            {formError && (
              <Alert variant="destructive" className="animate-in fade-in-50">
                <AlertDescription>{formError.message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                aria-invalid={formError?.error === "INVALID_EMAIL"}
                aria-describedby={formError ? "error-message" : undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
                  required
                  aria-invalid={formError?.error === "INVALID_CREDENTIALS"}
                  aria-describedby={formError ? "error-message" : undefined}
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
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className={cn("w-full")}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
