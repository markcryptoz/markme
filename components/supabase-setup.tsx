"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AdminLogin } from "@/components/admin-login"
import { AdminAuth } from "@/lib/admin-auth"
import { testSupabaseConnection } from "@/lib/supabase"
import { Database, CheckCircle, XCircle, AlertCircle, Copy, ExternalLink, LogOut, Clock } from "lucide-react"

export function SupabaseSetup() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean
    error: string | null
    testing: boolean
  }>({
    connected: false,
    error: null,
    testing: false,
  })

  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(AdminAuth.isAuthenticated())

    // Update session time every minute
    const updateSessionTime = () => {
      setSessionTime(AdminAuth.getSessionTimeRemaining())
    }

    updateSessionTime()
    const interval = setInterval(updateSessionTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      // Test connection on component mount when authenticated
      handleTestConnection()
    }
  }, [isAuthenticated])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setSessionTime(AdminAuth.getSessionTimeRemaining())
  }

  const handleLogout = () => {
    AdminAuth.logout()
    setIsAuthenticated(false)
  }

  const handleTestConnection = async () => {
    setConnectionStatus({ connected: false, error: null, testing: true })

    const result = await testSupabaseConnection()

    setConnectionStatus({
      connected: result.connected,
      error: result.error,
      testing: false,
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const setupSteps = [
    {
      title: "Get your Supabase URL",
      description: "Go to your Supabase project settings → API → Project URL",
      example: "https://your-project-id.supabase.co",
    },
    {
      title: "Get your Anon Key",
      description: "Go to your Supabase project settings → API → Project API keys → anon public",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
  ]

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        title="Setup Access"
        description="Enter admin credentials to access the setup panel"
      />
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header with logout */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Database Setup</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white/60">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Session: {sessionTime}m</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Supabase Connection Status
          </CardTitle>
          <CardDescription className="text-white/60">Check your database connection status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {connectionStatus.testing ? (
                <div className="w-5 h-5 border-2 border-t-purple-600 border-r-transparent border-b-cyan-600 border-l-transparent rounded-full animate-spin" />
              ) : connectionStatus.connected ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-white">
                {connectionStatus.testing
                  ? "Testing connection..."
                  : connectionStatus.connected
                    ? "Connected to Supabase"
                    : "Not connected"}
              </span>
            </div>
            <Badge
              variant={connectionStatus.connected ? "default" : "destructive"}
              className={
                connectionStatus.connected
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }
            >
              {connectionStatus.connected ? "Online" : "Offline"}
            </Badge>
          </div>

          {connectionStatus.error && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">{connectionStatus.error}</AlertDescription>
            </Alert>
          )}

          {connectionStatus.connected && (
            <Alert className="bg-green-500/10 border-green-500/30">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-400">
                ✅ Database connected successfully! Your user_profiles table is ready.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleTestConnection}
              disabled={connectionStatus.testing}
              variant="outline"
              className="border-white/20 text-white/80 hover:bg-white/5"
            >
              Test Connection
            </Button>
            {!connectionStatus.connected && (
              <Button
                onClick={() => setShowSetup(!showSetup)}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                Setup Guide
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      {!connectionStatus.connected && showSetup && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Supabase Setup Guide</CardTitle>
            <CardDescription className="text-white/60">
              Follow these steps to connect your Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Create Project */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                  1
                </span>
                Create Supabase Project
              </h3>
              <div className="ml-8 space-y-2">
                <p className="text-white/70">
                  If you haven't already, create a new project at{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 inline-flex items-center"
                  >
                    supabase.com
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </p>
              </div>
            </div>

            {/* Step 2: Get Credentials */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                  2
                </span>
                Get Your Credentials
              </h3>
              <div className="ml-8 space-y-4">
                {setupSteps.map((step, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium text-white">{step.title}</h4>
                    <p className="text-white/70 text-sm">{step.description}</p>
                    <div className="bg-black/50 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                      <code className="text-cyan-400 text-sm">{step.example}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(step.example)}
                        className="text-white/60 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Update Configuration */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                  3
                </span>
                Update Configuration
              </h3>
              <div className="ml-8 space-y-4">
                <p className="text-white/70">
                  Replace the placeholder values in <code className="text-cyan-400">lib/supabase.ts</code>:
                </p>
                <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-400">const</span> <span className="text-cyan-400">supabaseUrl</span>{" "}
                    <span className="text-gray-400">=</span>{" "}
                    <span className="text-green-400">"YOUR_SUPABASE_URL_HERE"</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">const</span> <span className="text-cyan-400">supabaseAnonKey</span>{" "}
                    <span className="text-gray-400">=</span>{" "}
                    <span className="text-green-400">"YOUR_SUPABASE_ANON_KEY_HERE"</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Run SQL Script */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                  4
                </span>
                Create Database Table
              </h3>
              <div className="ml-8 space-y-2">
                <p className="text-white/70">
                  Run the SQL script in your Supabase SQL editor to create the user_profiles table.
                </p>
                <Button
                  variant="outline"
                  className="border-white/20 text-white/80 hover:bg-white/5"
                  onClick={() => {
                    // This would trigger the SQL script execution in v0
                    console.log("Running SQL script...")
                  }}
                >
                  Run SQL Script
                </Button>
              </div>
            </div>

            <Alert className="bg-blue-500/10 border-blue-500/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-400">
                After updating your credentials, refresh the page and test the connection again.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Environment Variables Guide */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Environment Variables</CardTitle>
          <CardDescription className="text-white/60">
            Configure admin credentials and other environment variables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-2">
            <h4 className="text-white font-medium">Add to your .env.local file:</h4>
            <div className="text-sm space-y-1">
              <div>
                <span className="text-gray-400"># Admin Credentials</span>
              </div>
              <div>
                <span className="text-cyan-400">NEXT_PUBLIC_ADMIN_USERNAME</span>
                <span className="text-gray-400">=</span>
                <span className="text-green-400">your_admin_username</span>
              </div>
              <div>
                <span className="text-cyan-400">NEXT_PUBLIC_ADMIN_PASSWORD</span>
                <span className="text-gray-400">=</span>
                <span className="text-green-400">your_secure_password</span>
              </div>
              <div className="mt-2">
                <span className="text-gray-400"># Supabase Configuration</span>
              </div>
              <div>
                <span className="text-cyan-400">NEXT_PUBLIC_SUPABASE_URL</span>
                <span className="text-gray-400">=</span>
                <span className="text-green-400">your_supabase_url</span>
              </div>
              <div>
                <span className="text-cyan-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                <span className="text-gray-400">=</span>
                <span className="text-green-400">your_supabase_anon_key</span>
              </div>
            </div>
          </div>

          <Alert className="bg-yellow-500/10 border-yellow-500/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-yellow-400">
              <strong>Security Note:</strong> If environment variables are not set, the system will use default
              credentials (admin/password). Always set custom credentials in production!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
