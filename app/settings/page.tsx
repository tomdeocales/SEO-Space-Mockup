"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useToast } from "@/components/ui/toast-banner"
import { PageLoader } from "@/components/ui/spinner"
import { User, Bell, Key, Building2, Eye, EyeOff } from "lucide-react"
import { RequireAuth } from "@/components/require-auth"
import { useCompetitor } from "@/components/competitor-provider"

export default function SettingsPage() {
  const { competitor, isSwitching, setCompetitor } = useCompetitor()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const { showToast } = useToast()

  // Form state
  const [accountName, setAccountName] = useState("Product Manager")
  const [accountEmail, setAccountEmail] = useState("pm@seospace.io")
  const [workspaceName, setWorkspaceName] = useState("SEO Space")
  const [emailWeekly, setEmailWeekly] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [emailRoadmap, setEmailRoadmap] = useState(false)

  const handleSaveSettings = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setShowSaveModal(false)
      showToast("Settings saved successfully", "success")
    }, 1000)
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-white">
        <Sidebar
          competitor={competitor}
          onCompetitorChange={setCompetitor}
          isLoading={isSwitching}
          disableCompetitorToggle
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div className="lg:pl-64">
          <TopBar
            title="Settings"
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />

          <main className="p-4 sm:p-6 space-y-6">
            {isSwitching ? (
              <PageLoader />
            ) : (
              <>
                {/* Account Settings */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      Account Information
                    </CardTitle>
                    <CardDescription>Manage your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={accountEmail}
                          onChange={(e) => setAccountEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Workspace Settings */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      Workspace Settings
                    </CardTitle>
                    <CardDescription>Configure your workspace preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="workspace">Workspace Name</Label>
                      <Input id="workspace" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
                    </div>
                  </CardContent>
                </Card>

                {/* Email Notifications */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      Email Notifications
                    </CardTitle>
                    <CardDescription>Choose what updates you receive</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Weekly Summary Report</Label>
                        <p className="text-sm text-muted-foreground">Receive a weekly digest of parity changes</p>
                      </div>
                      <Switch checked={emailWeekly} onCheckedChange={setEmailWeekly} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Gap Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when new competitor features are detected
                        </p>
                      </div>
                      <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Roadmap Updates</Label>
                        <p className="text-sm text-muted-foreground">Notifications when roadmap items change status</p>
                      </div>
                      <Switch checked={emailRoadmap} onCheckedChange={setEmailRoadmap} />
                    </div>
                  </CardContent>
                </Card>

                {/* API Keys */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      API Keys
                    </CardTitle>
                    <CardDescription>Manage your API access credentials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value="sk_live_seo_space_a1b2c3d4e5f6g7h8i9j0"
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Use this key to access the SEO Space API</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={() => setShowSaveModal(true)}>Save Changes</Button>
                </div>
              </>
            )}
          </main>
        </div>

        {/* Save Confirmation Modal */}
        <ConfirmModal
          open={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onConfirm={handleSaveSettings}
          title="Save Settings"
          description="Are you sure you want to save these changes to your settings?"
          confirmText="Save"
          loading={saving}
        />
      </div>
    </RequireAuth>
  )
}
