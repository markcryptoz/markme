"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Wallet,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Rocket,
  Star,
  ArrowRight,
  Play,
  Menu,
  User,
  Settings,
} from "lucide-react"
import { MarketplaceTab } from "@/components/marketplace-tab"
import { TokenDetail } from "@/components/token-detail"
import { SportsCategories } from "@/components/sports-categories"
import { LoadingScreen } from "@/components/loading-screen"
import { ProfileTab } from "@/components/profile-tab"
import { SupabaseSetup } from "@/components/supabase-setup"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { AdminPanel } from "@/components/admin-panel"

function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("home")
  const [selectedCategory, setSelectedCategory] = useState("popular")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signIn, logout } = useAuth()

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const handleTokenSelect = (tokenId: string) => {
    setSelectedToken(tokenId)
    setActiveTab("details")
  }

  const handleBackToMarketplace = () => {
    setSelectedToken(null)
    setActiveTab("marketplace")
  }

  const handleCategorySelect = (category: string, subcategory?: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory || null)
    if (activeTab !== "marketplace") {
      setActiveTab("marketplace")
    }
    setMobileMenuOpen(false)
  }

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile-Optimized Header */}
      <header className="border-b border-white/10 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  FUN FANS PLAY
                </h1>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse"></div>
                <span className="hidden sm:inline">Live Markets</span>
                <span className="sm:hidden">Live</span>
              </Badge>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="sm:hidden">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white p-2">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-black border-white/10 w-80">
                  <div className="mt-6">
                    <SportsCategories onCategorySelect={handleCategorySelect} isMobile />
                  </div>
                </SheetContent>
              </Sheet>

              {user ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white p-2"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="ml-2 hidden sm:inline">Profile</span>
                  </Button>
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-white/5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/10">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-white/80">
                      {user.wallet_address.slice(0, 4)}...{user.wallet_address.slice(-3)}
                    </span>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={signIn}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border-0 shadow-lg shadow-purple-500/25 text-xs sm:text-sm px-3 sm:px-4"
                >
                  <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Mobile-Optimized Tab Navigation with Scrollable Support */}
          <div className="relative mb-4 sm:mb-8 mt-3 sm:mt-6">
            <div className="sm:hidden">
              {/* Mobile Scrollable Tabs */}
              <div className="flex overflow-x-auto scrollbar-hide bg-white/5 border border-white/10 rounded-lg p-1">
                <div className="flex space-x-1 min-w-max">
                  <button
                    onClick={() => setActiveTab("home")}
                    className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === "home"
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setActiveTab("marketplace")}
                    className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === "marketplace"
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Marketplace
                  </button>
                  <button
                    onClick={() => setActiveTab("details")}
                    disabled={!selectedToken}
                    className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === "details" && selectedToken
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                        : selectedToken
                          ? "text-white/70 hover:text-white hover:bg-white/10"
                          : "text-white/30 cursor-not-allowed"
                    }`}
                  >
                    Token Details
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === "profile"
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("setup")}
                    className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === "setup"
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Setup
                  </button>
                  <button
                    onClick={() => setActiveTab("admin")}
                    className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === "admin"
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Tabs */}
            <TabsList className="hidden sm:grid w-full grid-cols-6 bg-white/5 border border-white/10 rounded-xl p-1 h-auto">
              <TabsTrigger
                value="home"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg text-white/70 py-2.5"
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="marketplace"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg text-white/70 py-2.5"
              >
                Marketplace
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg text-white/70 py-2.5"
                disabled={!selectedToken}
              >
                Token Details
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg text-white/70 py-2.5"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="setup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg text-white/70 py-2.5"
              >
                <Settings className="w-4 h-4 mr-1" />
                Setup
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg text-white/70 py-2.5"
              >
                <Settings className="w-4 h-4 mr-1" />
                Admin
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Home Tab - Landing Page */}
          <TabsContent value="home" className="space-y-8 sm:space-y-12">
            {/* Desktop Sports Categories */}
            <div className="hidden sm:block">
              <SportsCategories onCategorySelect={handleCategorySelect} />
            </div>

            {/* Mobile Hero Section */}
            <section className="text-center py-10 sm:py-20 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 rounded-2xl sm:rounded-3xl"></div>
              <div className="relative z-10 px-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                  The Future of Sports Betting
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
                  Trade position tokens for live sports matches on the blockchain. Decentralized, transparent, and
                  powered by smart contracts.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg shadow-purple-500/25"
                    onClick={() => setActiveTab("marketplace")}
                  >
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Start Trading
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white/20 text-white/80 hover:bg-white/5 px-6 sm:px-8 py-3 rounded-xl"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Watch Demo
                  </Button>
                </div>
              </div>
            </section>

            {/* Mobile-Optimized Stats Section */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-3 sm:p-6 text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">$2.4M</h3>
                  <p className="text-white/60 text-xs sm:text-sm">Total Volume</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-3 sm:p-6 text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">12,847</h3>
                  <p className="text-white/60 text-xs sm:text-sm">Active Traders</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-3 sm:p-6 text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">156</h3>
                  <p className="text-white/60 text-xs sm:text-sm">Live Markets</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-3 sm:p-6 text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">98.7%</h3>
                  <p className="text-white/60 text-xs sm:text-sm">Uptime</p>
                </CardContent>
              </Card>
            </section>

            {/* Mobile-Optimized Features Section */}
            <section className="py-10 sm:py-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent px-2">
                Why Choose FUN FANS PLAY?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300 hover:bg-white/10">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Decentralized & Secure</h3>
                    <p className="text-white/60 text-sm sm:text-base">
                      Built on blockchain technology with smart contracts ensuring transparency and security for all
                      trades.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300 hover:bg-white/10">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Real-Time Trading</h3>
                    <p className="text-white/60 text-sm sm:text-base">
                      Trade position tokens with real-time price updates and instant settlement on match completion.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300 hover:bg-white/10">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Global Markets</h3>
                    <p className="text-white/60 text-sm sm:text-base">
                      Access betting markets for sports events worldwide, from football to cricket to esports.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Mobile-Optimized CTA Section */}
            <section className="text-center py-10 sm:py-20 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 mx-2 sm:mx-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent px-2">
                Ready to Start Trading?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Join thousands of traders already using FUN FANS PLAY to trade on their favorite sports.
              </p>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl shadow-lg shadow-purple-500/25 mx-4 sm:mx-0"
                onClick={() => setActiveTab("marketplace")}
              >
                Enter Marketplace
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </section>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <div className="space-y-4 sm:space-y-6">
              <div className="hidden sm:block">
                <SportsCategories onCategorySelect={handleCategorySelect} />
              </div>
              <MarketplaceTab
                onTokenSelect={handleTokenSelect}
                category={selectedCategory}
                subcategory={selectedSubcategory}
              />
            </div>
          </TabsContent>

          {/* Token Details Tab */}
          <TabsContent value="details">
            {selectedToken && <TokenDetail tokenId={selectedToken} onBack={handleBackToMarketplace} />}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          {/* Setup Tab */}
          <TabsContent value="setup">
            <SupabaseSetup />
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin">
            <AdminPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function HomePageWithAuth() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  )
}
