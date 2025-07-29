"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FirebaseConfigForm() {
  const [config, setConfig] = useState({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    privateKey: "",
    clientEmail: "",
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real application, you would send this to a secure API endpoint
      // that updates environment variables or configuration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Firebase configuration has been successfully updated.")
    } catch (error) {
      toast.error("Failed to update configuration.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Client Configuration</CardTitle>
            <CardDescription>These settings are used for client-side Firebase initialization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                value={config.projectId}
                onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                placeholder="your-project-id"
              />
            </div>

            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="AIza..."
              />
            </div>

            <div>
              <Label htmlFor="authDomain">Auth Domain</Label>
              <Input
                id="authDomain"
                value={config.authDomain}
                onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                placeholder="your-project.firebaseapp.com"
              />
            </div>

            <div>
              <Label htmlFor="storageBucket">Storage Bucket</Label>
              <Input
                id="storageBucket"
                value={config.storageBucket}
                onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
                placeholder="your-project.appspot.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Admin Configuration</CardTitle>
            <CardDescription>These settings are used for server-side Firebase Admin SDK</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                value={config.clientEmail}
                onChange={(e) => setConfig({ ...config, clientEmail: e.target.value })}
                placeholder="firebase-adminsdk-...@your-project.iam.gserviceaccount.com"
              />
            </div>

            <div>
              <Label htmlFor="privateKey">Private Key</Label>
              <Textarea
                id="privateKey"
                value={config.privateKey}
                onChange={(e) => setConfig({ ...config, privateKey: e.target.value })}
                placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
              <Input
                id="messagingSenderId"
                value={config.messagingSenderId}
                onChange={(e) => setConfig({ ...config, messagingSenderId: e.target.value })}
                placeholder="123456789"
              />
            </div>

            <div>
              <Label htmlFor="appId">App ID</Label>
              <Input
                id="appId"
                value={config.appId}
                onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                placeholder="1:123456789:web:..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Updating..." : "Update Configuration"}
      </Button>
    </form>
  )
}
