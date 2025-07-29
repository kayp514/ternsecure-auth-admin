import { FirebaseConfigForm } from "@/components/form-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your Firebase project settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Firebase Configuration</CardTitle>
          <CardDescription>Update your Firebase project configuration details</CardDescription>
        </CardHeader>
        <CardContent>
          <FirebaseConfigForm />
        </CardContent>
      </Card>
    </div>
  )
}
