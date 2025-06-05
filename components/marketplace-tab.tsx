"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, TrendingDown, Clock, Users, Filter } from "lucide-react"

// Mock data for ongoing matches across different sports
const mockMatches = [
  // Basketball
  {
    id: "1",
    sport: "🏀",
    category: "basketball",
    subcategory: "NBA",
    teamA: "Lakers",
    teamB: "Warriors",
    startTime: "2024-01-15T20:00:00Z",
    currentPrice: 2.15,
    marketCap: 215000,
    priceChange: 8.7,
    volume24h: 78000,
    totalHolders: 2100,
    status: "live",
  },
  {
    id: "2",
    sport: "🏀",
    category: "basketball",
    subcategory: "WNBA",
    teamA: "Liberty",
    teamB: "Aces",
    startTime: "2024-01-15T18:30:00Z",
    currentPrice: 1.85,
    marketCap: 95000,
    priceChange: 3.2,
    volume24h: 42000,
    totalHolders: 950,
    status: "upcoming",
  },
  {
    id: "3",
    sport: "🏀",
    category: "basketball",
    subcategory: "College Basketball",
    teamA: "Duke",
    teamB: "North Carolina",
    startTime: "2024-01-15T19:00:00Z",
    currentPrice: 1.65,
    marketCap: 82000,
    priceChange: 5.8,
    volume24h: 38000,
    totalHolders: 780,
    status: "upcoming",
  },
  // Football
  {
    id: "4",
    sport: "🏈",
    category: "football",
    subcategory: "NFL",
    teamA: "Chiefs",
    teamB: "Bills",
    startTime: "2024-01-15T21:30:00Z",
    currentPrice: 2.45,
    marketCap: 245000,
    priceChange: 10.2,
    volume24h: 98000,
    totalHolders: 2400,
    status: "upcoming",
  },
  {
    id: "5",
    sport: "🏈",
    category: "football",
    subcategory: "College Football",
    teamA: "Alabama",
    teamB: "Georgia",
    startTime: "2024-01-15T17:00:00Z",
    currentPrice: 1.95,
    marketCap: 195000,
    priceChange: 7.5,
    volume24h: 85000,
    totalHolders: 1900,
    status: "live",
  },
  // Soccer
  {
    id: "6",
    sport: "⚽",
    category: "soccer",
    subcategory: "Premier League",
    teamA: "Manchester United",
    teamB: "Liverpool",
    startTime: "2024-01-15T15:00:00Z",
    currentPrice: 1.24,
    marketCap: 125000,
    priceChange: 5.2,
    volume24h: 45000,
    totalHolders: 1250,
    status: "live",
  },
  {
    id: "7",
    sport: "⚽",
    category: "soccer",
    subcategory: "Women's Soccer",
    teamA: "USWNT",
    teamB: "England",
    startTime: "2024-01-15T16:00:00Z",
    currentPrice: 1.35,
    marketCap: 67000,
    priceChange: 2.8,
    volume24h: 28000,
    totalHolders: 670,
    status: "upcoming",
  },
  // Hockey
  {
    id: "8",
    sport: "🏒",
    category: "hockey",
    subcategory: "NHL",
    teamA: "Maple Leafs",
    teamB: "Bruins",
    startTime: "2024-01-15T19:30:00Z",
    currentPrice: 1.78,
    marketCap: 89000,
    priceChange: 4.3,
    volume24h: 36000,
    totalHolders: 890,
    status: "upcoming",
  },
  {
    id: "9",
    sport: "🏒",
    category: "hockey",
    subcategory: "Women's Hockey",
    teamA: "Canada",
    teamB: "USA",
    startTime: "2024-01-15T18:00:00Z",
    currentPrice: 1.45,
    marketCap: 58000,
    priceChange: 3.1,
    volume24h: 24000,
    totalHolders: 580,
    status: "live",
  },
  // Baseball
  {
    id: "10",
    sport: "⚾",
    category: "baseball",
    subcategory: "MLB",
    teamA: "Yankees",
    teamB: "Red Sox",
    startTime: "2024-01-15T18:30:00Z",
    currentPrice: 1.92,
    marketCap: 115000,
    priceChange: 6.7,
    volume24h: 52000,
    totalHolders: 1150,
    status: "upcoming",
  },
  // Tennis
  {
    id: "11",
    sport: "🎾",
    category: "tennis",
    subcategory: "Grand Slams",
    teamA: "Novak Djokovic",
    teamB: "Rafael Nadal",
    startTime: "2024-01-15T16:00:00Z",
    currentPrice: 3.42,
    marketCap: 342000,
    priceChange: 12.3,
    volume24h: 125000,
    totalHolders: 3200,
    status: "upcoming",
  },
  // Cricket
  {
    id: "12",
    sport: "🏏",
    category: "cricket",
    subcategory: "International",
    teamA: "India",
    teamB: "Australia",
    startTime: "2024-01-15T09:30:00Z",
    currentPrice: 0.89,
    marketCap: 89000,
    priceChange: -2.1,
    volume24h: 32000,
    totalHolders: 890,
    status: "upcoming",
  },
  // UFC/MMA
  {
    id: "13",
    sport: "🥊",
    category: "ufc",
    subcategory: "UFC",
    teamA: "Jon Jones",
    teamB: "Francis Ngannou",
    startTime: "2024-01-15T22:00:00Z",
    currentPrice: 4.25,
    marketCap: 425000,
    priceChange: 15.8,
    volume24h: 180000,
    totalHolders: 4250,
    status: "upcoming",
  },
  // Golf
  {
    id: "14",
    sport: "⛳",
    category: "golf",
    subcategory: "PGA Tour",
    teamA: "Tiger Woods",
    teamB: "Rory McIlroy",
    startTime: "2024-01-15T14:00:00Z",
    currentPrice: 2.75,
    marketCap: 137000,
    priceChange: 8.9,
    volume24h: 65000,
    totalHolders: 1370,
    status: "live",
  },
  // Table Tennis
  {
    id: "15",
    sport: "🏓",
    category: "tabletennis",
    subcategory: "International",
    teamA: "Zhang Wei",
    teamB: "Ma Long",
    startTime: "2024-01-15T12:00:00Z",
    currentPrice: 0.45,
    marketCap: 12000,
    priceChange: 1.2,
    volume24h: 5000,
    totalHolders: 340,
    status: "upcoming",
  },
  // Badminton
  {
    id: "16",
    sport: "🏸",
    category: "badminton",
    subcategory: "International",
    teamA: "Viktor Axelsen",
    teamB: "Kento Momota",
    startTime: "2024-01-15T14:30:00Z",
    currentPrice: 0.78,
    marketCap: 34000,
    priceChange: -1.5,
    volume24h: 15000,
    totalHolders: 567,
    status: "live",
  },
]

interface MarketplaceTabProps {
  onTokenSelect: (tokenId: string) => void
  category?: string
  subcategory?: string | null
}

export function MarketplaceTab({ onTokenSelect, category = "popular", subcategory = null }: MarketplaceTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMatches, setFilteredMatches] = useState(mockMatches)

  useEffect(() => {
    let filtered = mockMatches

    // Filter by category
    if (category && category !== "home" && category !== "live" && category !== "all" && category !== "popular") {
      filtered = filtered.filter((match) => match.category === category)
    }

    // Filter by subcategory if provided and not "all"
    if (subcategory && subcategory !== "all") {
      filtered = filtered.filter((match) => match.subcategory === subcategory)
    }

    // Filter by live status if live category is selected
    if (category === "live") {
      filtered = filtered.filter((match) => match.status === "live")
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (match) =>
          match.teamA.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.teamB.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredMatches(filtered)
  }, [searchTerm, category, subcategory])

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4 sm:space-y-8 w-full overflow-hidden">
      {/* Mobile-Optimized Search and Filters */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 flex-1">
          <div className="relative flex-1 sm:max-w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
            <Input
              placeholder="Search matches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-500 h-10 sm:h-auto"
            />
          </div>
          <Button variant="outline" className="border-white/20 text-white/80 hover:bg-white/5 sm:flex-shrink-0 h-10">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="text-white/60 text-center sm:text-right text-sm">
          <span className="text-white font-semibold">{filteredMatches.length}</span> active markets
        </div>
      </div>

      {/* Mobile-Optimized Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-white/60 text-xs">Markets</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{filteredMatches.length}</p>
              </div>
              <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 text-purple-500 mx-auto sm:mx-0 mt-1 sm:mt-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-white/60 text-xs">Volume</p>
                <p className="text-lg sm:text-2xl font-bold text-white">$1.2M</p>
              </div>
              <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 text-cyan-500 mx-auto sm:mx-0 mt-1 sm:mt-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-white/60 text-xs">Traders</p>
                <p className="text-lg sm:text-2xl font-bold text-white">8,347</p>
              </div>
              <Users className="h-5 w-5 sm:h-8 sm:w-8 text-green-500 mx-auto sm:mx-0 mt-1 sm:mt-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-white/60 text-xs">Return</p>
                <p className="text-lg sm:text-2xl font-bold text-white">+12.4%</p>
              </div>
              <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 text-yellow-500 mx-auto sm:mx-0 mt-1 sm:mt-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile-Optimized Match Cards Grid */}
      <div className="w-full overflow-hidden">
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredMatches.map((match) => (
              <Card
                key={match.id}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer group hover:bg-white/10 w-full overflow-hidden"
                onClick={() => onTokenSelect(match.id)}
              >
                <CardHeader className="pb-2 px-3 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className="text-lg sm:text-2xl flex-shrink-0">{match.sport}</span>
                      <Badge
                        variant={match.status === "live" ? "destructive" : "secondary"}
                        className={`text-xs flex-shrink-0 ${
                          match.status === "live"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {match.status === "live" ? "🔴 LIVE" : "⏰ Upcoming"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-white/60 flex-shrink-0">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="text-xs">{formatTime(match.startTime)}</span>
                    </div>
                  </div>

                  <CardTitle className="text-sm sm:text-base text-white group-hover:text-purple-400 transition-colors leading-tight truncate">
                    {match.teamA} vs {match.teamB}
                  </CardTitle>
                  <div className="text-xs text-white/60 mt-1 truncate">{match.subcategory}</div>
                </CardHeader>

                <CardContent className="pt-0 px-3 pb-3">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="min-w-0 flex-1">
                        <p className="text-white/60 text-xs">Token Price</p>
                        <div className="flex items-center space-x-1">
                          <p className="text-base sm:text-xl font-bold text-white">${match.currentPrice}</p>
                          <div
                            className={`flex items-center ${match.priceChange >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {match.priceChange >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            <span className="text-xs font-medium">{Math.abs(match.priceChange)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-white/60 text-xs">Market Cap</p>
                        <p className="text-sm sm:text-lg font-semibold text-white">{formatCurrency(match.marketCap)}</p>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="text-white/60">24h Volume</p>
                        <p className="text-white font-medium truncate">{formatCurrency(match.volume24h)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white/60">Holders</p>
                        <p className="text-white font-medium">{match.totalHolders.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 text-xs py-2 h-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle buy action
                        }}
                      >
                        Buy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs py-2 h-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle sell action
                        }}
                      >
                        Sell
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 w-full">
            <div className="text-white/60 text-base sm:text-lg">No matches found for the selected criteria</div>
            <Button
              variant="outline"
              className="mt-4 border-white/20 text-white/80 hover:bg-white/5"
              onClick={() => setSearchTerm("")}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
