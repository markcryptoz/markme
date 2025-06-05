"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { updateUserProfile } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { Wallet, User, Edit, Save, X, LogOut, Loader2 } from "lucide-react"

// Available sports interests
const SPORTS_INTERESTS = [
  { id: "basketball", label: "Basketball" },
  { id: "football", label: "Football" },
  { id: "baseball", label: "Baseball" },
  { id: "hockey", label: "Hockey" },
  { id: "soccer", label: "Soccer" },
  { id: "tennis", label: "Tennis" },
  { id: "golf", label: "Golf" },
  { id: "cricket", label: "Cricket" },
  { id: "ufc", label: "UFC/MMA" },
  { id: "wrestling", label: "Wrestling" },
]

export function ProfileTab() {
  const { user, loading, signIn, logout, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    interests: user?.interests || [],
  })

  const handleSignIn = async () => {
    const { success, error } = await signIn()
    if (success) {
      toast({
        title: "Successfully connected wallet",
        description: "Your wallet has been connected successfully to FUN FANS PLAY.",
      })
    } else {
      toast({
        title: "Failed to connect wallet",
        description: error?.message || "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset form
      setFormData({
        name: user?.name || "",
        username: user?.username || "",
        bio: user?.bio || "",
        interests: user?.interests || [],
      })
    }
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const { success, error } = await updateUserProfile({
        name: formData.name || null,
        username: formData.username || null,
        bio: formData.bio || null,
        interests: formData.interests,
      })

      if (success) {
        await refreshUser()
        setIsEditing(false)
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        throw error
      }
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInterestToggle = (interestId: string) => {
    setFormData((prev) => {
      const interests = [...(prev.interests || [])]
      if (interests.includes(interestId)) {
        return { ...prev, interests: interests.filter((id) => id !== interestId) }
      } else {
        return { ...prev, interests: [...interests, interestId] }
      }
    })
  }

  // Update the fallback avatar initials logic comment
  const getInitials = (name?: string | null) => {
    if (!name) return user?.wallet_address?.substring(0, 2) || "FFP"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getWalletDisplay = (address?: string | null) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-purple-600 border-r-transparent border-b-cyan-600 border-l-transparent animate-spin"></div>
          <p className="text-white/70">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center mb-6">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-white/60 mb-6 max-w-md">
          Connect your MetaMask wallet to access your profile and start trading on FUN FANS PLAY.
        </p>
        <Button
          onClick={handleSignIn}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-2 rounded-xl shadow-lg shadow-purple-500/25"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Profile</h1>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditToggle}
                className="border-white/20 text-white/80 hover:bg-white/5"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditToggle}
                className="border-white/20 text-white/80 hover:bg-white/5"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Disconnect</span>
                <span className="sm:hidden">Log Out</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="bg-white/5 border-white/10 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Profile Overview</CardTitle>
            <CardDescription className="text-white/60">Your public profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 border-2 border-purple-500/50">
                <AvatarImage src={user.avatar_url || ""} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 space-y-1">
                <h3 className="text-xl font-bold text-white">{user.name || user.username}</h3>
                {user.username && user.name && <p className="text-white/60">@{user.username}</p>}
                <div className="flex items-center justify-center mt-2">
                  <Badge variant="outline" className="bg-white/10 text-white/80 border-white/20">
                    <Wallet className="w-3 h-3 mr-1" />
                    {getWalletDisplay(user.wallet_address)}
                  </Badge>
                </div>
              </div>
            </div>

            {!isEditing && (
              <>
                {user.bio && (
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-2">About</h4>
                    <p className="text-white/80 text-sm">{user.bio}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-2">Interests</h4>
                  {user.interests && user.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest) => (
                        <Badge
                          key={interest}
                          className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-white border-purple-500/30"
                        >
                          {SPORTS_INTERESTS.find((s) => s.id === interest)?.label || interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/50 text-sm">No interests selected</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Profile Details / Edit Form */}
        <Card className="bg-white/5 border-white/10 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">{isEditing ? "Edit Profile" : "Profile Details"}</CardTitle>
            <CardDescription className="text-white/60">
              {isEditing ? "Update your profile information" : "Your detailed profile information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/70">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white/70">
                      Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="Your username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white/70">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-500 min-h-[100px]"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white/70">Interests</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SPORTS_INTERESTS.map((sport) => (
                      <div key={sport.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${sport.id}`}
                          checked={formData.interests?.includes(sport.id)}
                          onCheckedChange={() => handleInterestToggle(sport.id)}
                          className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <Label htmlFor={`interest-${sport.id}`} className="text-white/80 cursor-pointer text-sm">
                          {sport.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 h-10">
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-white/70"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-white/70"
                  >
                    Activity
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-white/70 mb-1">Full Name</h4>
                        <p className="text-white">{user.name || "Not provided"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white/70 mb-1">Username</h4>
                        <p className="text-white">@{user.username || "Not set"}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white/70 mb-1">Wallet Address</h4>
                      <p className="text-white font-mono text-sm">{user.wallet_address}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white/70 mb-1">Bio</h4>
                      <p className="text-white/80">{user.bio || "No bio provided"}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white/70 mb-1">Member Since</h4>
                      <p className="text-white/80">
                        {new Date(user.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="pt-4">
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                      <h3 className="text-white/80 mb-2">Recent Activity</h3>
                      <p className="text-white/60 text-sm">Your recent betting activity will appear here.</p>
                    </div>

                    {/* Placeholder for future activity data */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center h-32">
                        <p className="text-white/50">No recent activity</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
