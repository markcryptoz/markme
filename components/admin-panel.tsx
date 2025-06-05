"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminLogin } from "@/components/admin-login"
import { AdminAuth } from "@/lib/admin-auth"
import { DatabaseUtils } from "@/lib/database-utils"
import type { UserProfile } from "@/lib/supabase"
import {
  Users,
  Search,
  UserPlus,
  Activity,
  Database,
  Trash2,
  RefreshCw,
  AlertCircle,
  LogOut,
  Clock,
} from "lucide-react"

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(AdminAuth.isAuthenticated())
    setLoading(false)

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
      loadData()
    }
  }, [isAuthenticated])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setSessionTime(AdminAuth.getSessionTimeRemaining())
  }

  const handleLogout = () => {
    AdminAuth.logout()
    setIsAuthenticated(false)
    setUsers([])
    setSearchResults([])
    setStats({ totalUsers: 0, newUsersToday: 0, activeUsers: 0 })
  }

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Load users and stats
      const [usersResult, statsResult] = await Promise.all([DatabaseUtils.getAllUsers(), DatabaseUtils.getUserStats()])

      if (usersResult.error) throw usersResult.error
      if (statsResult.error) throw statsResult.error

      setUsers(usersResult.users)
      setStats({
        totalUsers: statsResult.totalUsers,
        newUsersToday: statsResult.newUsersToday,
        activeUsers: statsResult.activeUsers,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const { users: results, error } = await DatabaseUtils.searchUsers(searchQuery)
    if (error) {
      setError("Search failed")
    } else {
      setSearchResults(results)
    }
  }

  const handleDeleteUser = async (walletAddress: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    const { success, error } = await DatabaseUtils.deleteUser(walletAddress)
    if (success) {
      await loadData() // Refresh data
    } else {
      setError("Failed to delete user")
    }
  }

  const getInitials = (name?: string | null, walletAddress?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return walletAddress?.substring(0, 2) || "NB"
  }

  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const UserCard = ({ user }: { user: UserProfile }) => (
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm">
                {getInitials(user.name, user.wallet_address)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-white font-medium">{user.name || user.username || "Anonymous"}</h4>
              <p className="text-white/60 text-sm">{formatWalletAddress(user.wallet_address)}</p>
              {user.interests && user.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.interests.slice(0, 3).map((interest) => (
                    <Badge key={interest} className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {user.interests.length > 3 && (
                    <Badge className="bg-white/10 text-white/60 border-white/20 text-xs">
                      +{user.interests.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Active</Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteUser(user.wallet_address)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        title="Admin Panel Access"
        description="Enter admin credentials to access the admin panel"
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-purple-600 border-r-transparent border-b-cyan-600 border-l-transparent animate-spin"></div>
          <p className="text-white/70">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white/60">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Session: {sessionTime}m</span>
          </div>
          <Button onClick={loadData} variant="outline" className="border-white/20 text-white/80 hover:bg-white/5">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
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

      {error && (
        <Alert className="bg-red-500/10 border-red-500/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
            <p className="text-white/60 text-sm">Total Users</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.newUsersToday}</h3>
            <p className="text-white/60 text-sm">New Today</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.activeUsers}</h3>
            <p className="text-white/60 text-sm">Active Users</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600"
          >
            <Database className="w-4 h-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger
            value="search"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">All Users</CardTitle>
              <CardDescription className="text-white/60">Manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.length > 0 ? (
                  users.map((user) => <UserCard key={user.wallet_address} user={user} />)
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/60">No users found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Search Users</CardTitle>
              <CardDescription className="text-white/60">Search by username, name, or wallet address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-500"
                />
                <Button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => <UserCard key={user.wallet_address} user={user} />)
                ) : searchQuery ? (
                  <div className="text-center py-8">
                    <p className="text-white/60">No users found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/60">Enter a search term to find users</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
