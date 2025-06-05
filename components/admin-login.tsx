"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminAuth } from "@/lib/admin-auth"
import { Shield, Lock, Eye, EyeOff, AlertCircle, Key } from "lucide-react"

interface AdminLoginProps {
  onLoginSuccess: () => void
  title?: string
  description?: string
}

export function AdminLogin({
  onLoginSuccess,
  title = "Admin Access",
  description = "Enter admin credentials to continue",
}: AdminLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (AdminAuth.login(username, password)) {
      onLoginSuccess()
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  const credentials = AdminAuth.getCredentials()
  const isUsingFallback = credentials.username === "admin" && credentials.password === "password"

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-2xl">{title}</CardTitle>
            <CardDescription className="text-white/60 mt-2">{description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isUsingFallback && (
            <Alert className="bg-yellow-500/10 border-yellow-500/30">
              <Key className="h-4 w-4" />
              <AlertDescription className="text-yellow-400">
                <strong>Development Mode:</strong> Using default credentials. Set NEXT_PUBLIC_ADMIN_USERNAME and
                NEXT_PUBLIC_ADMIN_PASSWORD in your .env file for production.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/70">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-500 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </div>
              )}
            </Button>
          </form>

          {isUsingFallback && (
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-2">
              <h4 className="text-white font-medium text-sm">Default Credentials:</h4>
              <div className="text-xs text-white/60 space-y-1">
                <div>
                  Username: <code className="text-cyan-400">admin</code>
                </div>
                <div>
                  Password: <code className="text-cyan-400">password</code>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
