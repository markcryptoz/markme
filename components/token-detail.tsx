"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  Activity,
  Wallet,
  Trophy,
  Target,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, AreaChart, Area } from "recharts"

// Mock data for Team A and Team B tokens
const mockMatchData = {
  id: "1",
  sport: "⚽",
  teamA: {
    name: "Manchester United",
    symbol: "MUN",
    currentPrice: 1.24,
    marketCap: 125000,
    priceChange: 5.2,
    volume24h: 45000,
    totalHolders: 1250,
    totalSupply: 50000,
    winProbability: 65,
    userBalance: 150,
  },
  teamB: {
    name: "Liverpool",
    symbol: "LIV",
    currentPrice: 0.76,
    marketCap: 76000,
    priceChange: -2.1,
    volume24h: 32000,
    totalHolders: 890,
    totalSupply: 50000,
    winProbability: 35,
    userBalance: 75,
  },
  startTime: "2024-01-15T15:00:00Z",
  status: "live",
  userCollateral: 500,
}

// Mock price history for both teams
const teamAPriceHistory = [
  { time: "00:00", price: 1.15 },
  { time: "04:00", price: 1.18 },
  { time: "08:00", price: 1.22 },
  { time: "12:00", price: 1.2 },
  { time: "16:00", price: 1.24 },
  { time: "20:00", price: 1.26 },
]

const teamBPriceHistory = [
  { time: "00:00", price: 0.85 },
  { time: "04:00", price: 0.82 },
  { time: "08:00", price: 0.78 },
  { time: "12:00", price: 0.8 },
  { time: "16:00", price: 0.76 },
  { time: "20:00", price: 0.74 },
]

// Mock order book data for both teams
const teamAOrderBook = {
  bids: [
    { price: 1.23, amount: 1500, total: 1500 },
    { price: 1.22, amount: 2300, total: 3800 },
    { price: 1.21, amount: 1800, total: 5600 },
    { price: 1.2, amount: 2100, total: 7700 },
  ],
  asks: [
    { price: 1.25, amount: 1200, total: 1200 },
    { price: 1.26, amount: 1900, total: 3100 },
    { price: 1.27, amount: 1600, total: 4700 },
    { price: 1.28, amount: 2200, total: 6900 },
  ],
}

const teamBOrderBook = {
  bids: [
    { price: 0.75, amount: 1800, total: 1800 },
    { price: 0.74, amount: 2100, total: 3900 },
    { price: 0.73, amount: 1600, total: 5500 },
    { price: 0.72, amount: 1900, total: 7400 },
  ],
  asks: [
    { price: 0.77, amount: 1400, total: 1400 },
    { price: 0.78, amount: 1700, total: 3100 },
    { price: 0.79, amount: 1300, total: 4400 },
    { price: 0.8, amount: 2000, total: 6400 },
  ],
}

// Mock recent trades for both teams
const teamARecentTrades = [
  { time: "14:32", side: "buy", amount: 250, price: 1.24 },
  { time: "14:30", side: "sell", amount: 180, price: 1.23 },
  { time: "14:28", side: "buy", amount: 320, price: 1.24 },
  { time: "14:25", side: "buy", amount: 150, price: 1.23 },
  { time: "14:22", side: "sell", amount: 200, price: 1.22 },
]

const teamBRecentTrades = [
  { time: "14:31", side: "sell", amount: 300, price: 0.76 },
  { time: "14:29", side: "buy", amount: 150, price: 0.77 },
  { time: "14:27", side: "sell", amount: 280, price: 0.76 },
  { time: "14:24", side: "sell", amount: 200, price: 0.75 },
  { time: "14:21", side: "buy", amount: 180, price: 0.76 },
]

interface TokenDetailProps {
  tokenId: string
  onBack: () => void
}

function TokenDetail({ tokenId, onBack }: TokenDetailProps) {
  const [timeLeft, setTimeLeft] = useState("")
  const [selectedTeamForTrading, setSelectedTeamForTrading] = useState<"teamA" | "teamB">("teamA")
  const [buyAmount, setBuyAmount] = useState("")
  const [sellAmount, setSellAmount] = useState("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const matchTime = new Date(mockMatchData.startTime).getTime()
      const difference = matchTime - now

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft("Match Started")
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const TeamSection = ({
    team,
    teamKey,
    priceHistory,
    orderBook,
    recentTrades,
    color,
  }: {
    team: typeof mockMatchData.teamA
    teamKey: "teamA" | "teamB"
    priceHistory: typeof teamAPriceHistory
    orderBook: typeof teamAOrderBook
    recentTrades: typeof teamARecentTrades
    color: string
  }) => (
    <div className="space-y-3 sm:space-y-6 w-full overflow-hidden">
      {/* Team Header - Mobile Optimized */}
      <div className={`bg-gradient-to-r ${color} rounded-lg p-3 sm:p-6 border border-opacity-30 w-full`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-2xl font-bold text-white truncate">{team.name}</h2>
              <p className="text-white/80 text-xs sm:text-base">${team.symbol} Token</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg sm:text-3xl font-bold text-white">{team.winProbability}%</div>
            <div className="text-white/80 text-xs sm:text-sm">Win Prob.</div>
          </div>
        </div>
      </div>

      {/* Team Metrics - Mobile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full">
        <Card className="bg-white/5 border-white/10 hover:bg-white/10">
          <CardContent className="p-2 sm:p-4">
            <div className="text-center">
              <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-purple-500 mx-auto mb-1" />
              <p className="text-white/60 text-xs">Price</p>
              <p className="text-sm sm:text-lg font-bold text-white">{formatCurrency(team.currentPrice)}</p>
              <div
                className={`flex items-center justify-center text-xs ${team.priceChange >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {team.priceChange >= 0 ? (
                  <TrendingUp className="w-2 h-2 mr-1" />
                ) : (
                  <TrendingDown className="w-2 h-2 mr-1" />
                )}
                {Math.abs(team.priceChange)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 hover:bg-white/10">
          <CardContent className="p-2 sm:p-4">
            <div className="text-center">
              <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-cyan-500 mx-auto mb-1" />
              <p className="text-white/60 text-xs">Market Cap</p>
              <p className="text-sm sm:text-lg font-bold text-white">{formatCurrency(team.marketCap)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 hover:bg-white/10">
          <CardContent className="p-2 sm:p-4">
            <div className="text-center">
              <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-green-500 mx-auto mb-1" />
              <p className="text-white/60 text-xs">24h Volume</p>
              <p className="text-sm sm:text-lg font-bold text-white">{formatCurrency(team.volume24h)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 hover:bg-white/10">
          <CardContent className="p-2 sm:p-4">
            <div className="text-center">
              <Users className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-white/60 text-xs">Holders</p>
              <p className="text-sm sm:text-lg font-bold text-white">{team.totalHolders.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Chart - Mobile Optimized */}
      <Card className="bg-white/5 border-white/10 hover:bg-white/10 w-full overflow-hidden">
        <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-white flex items-center text-sm sm:text-lg">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="truncate">{team.name} Price Chart (24h)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 pb-3 sm:pb-6">
          <div className="w-full overflow-hidden">
            <ChartContainer
              config={{
                price: {
                  label: "Price",
                  color: teamKey === "teamA" ? "#8b5cf6" : "#ef4444",
                },
              }}
              className="h-40 sm:h-64 w-full"
            >
              <AreaChart data={priceHistory} width="100%" height="100%">
                <defs>
                  <linearGradient id={`gradient-${teamKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={teamKey === "teamA" ? "#8b5cf6" : "#ef4444"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={teamKey === "teamA" ? "#8b5cf6" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#64748b" fontSize={10} tick={{ fontSize: 10 }} width={40} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={teamKey === "teamA" ? "#8b5cf6" : "#ef4444"}
                  strokeWidth={2}
                  fill={`url(#gradient-${teamKey})`}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Order Book and Recent Trades - Mobile Optimized */}
      <div className="w-full overflow-hidden">
        <Tabs defaultValue="orderbook" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10 h-8 sm:h-9">
            <TabsTrigger
              value="orderbook"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 text-xs sm:text-sm"
            >
              Order Book
            </TabsTrigger>
            <TabsTrigger
              value="trades"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 text-xs sm:text-sm"
            >
              Recent Trades
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orderbook" className="w-full overflow-hidden">
            <Card className="bg-white/5 border-white/10 hover:bg-white/10">
              <CardContent className="p-2 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Mobile: Stack vertically, Desktop: Side by side */}
                  <div className="w-full overflow-hidden">
                    <h4 className="text-green-400 font-semibold mb-2 text-sm">Bids</h4>
                    <div className="space-y-1 text-xs">
                      <div className="grid grid-cols-3 gap-2 text-green-400/60 font-medium">
                        <span>Price</span>
                        <span className="text-center">Amount</span>
                        <span className="text-right">Total</span>
                      </div>
                      {orderBook.bids.slice(0, 4).map((bid, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2">
                          <span className="text-green-400 truncate">{formatCurrency(bid.price)}</span>
                          <span className="text-white text-center">{bid.amount}</span>
                          <span className="text-white/60 text-right">{bid.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full overflow-hidden">
                    <h4 className="text-red-400 font-semibold mb-2 text-sm">Asks</h4>
                    <div className="space-y-1 text-xs">
                      <div className="grid grid-cols-3 gap-2 text-red-400/60 font-medium">
                        <span>Price</span>
                        <span className="text-center">Amount</span>
                        <span className="text-right">Total</span>
                      </div>
                      {orderBook.asks.slice(0, 4).map((ask, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2">
                          <span className="text-red-400 truncate">{formatCurrency(ask.price)}</span>
                          <span className="text-white text-center">{ask.amount}</span>
                          <span className="text-white/60 text-right">{ask.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trades" className="w-full overflow-hidden">
            <Card className="bg-white/5 border-white/10 hover:bg-white/10">
              <CardContent className="p-2 sm:p-4">
                <div className="w-full overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-white/60 border-b border-white/20 pb-2 mb-2">
                      <span>Time</span>
                      <span>Side</span>
                      <span className="text-center">Amount</span>
                      <span className="text-right">Price</span>
                    </div>
                    {recentTrades.slice(0, 5).map((trade, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 text-xs py-1">
                        <span className="text-white/60">{trade.time}</span>
                        <span className={trade.side === "buy" ? "text-green-400" : "text-red-400"}>
                          {trade.side.toUpperCase()}
                        </span>
                        <span className="text-white text-center">{trade.amount}</span>
                        <span className="text-white text-right">{formatCurrency(trade.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  return (
    <div className="space-y-3 sm:space-y-6 w-full overflow-hidden px-1 sm:px-0">
      {/* Mobile-Optimized Header */}
      <div className="flex flex-col space-y-3 w-full">
        <div className="flex items-center space-x-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white p-2 flex-shrink-0"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-xs sm:text-sm">Back</span>
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-3xl flex-shrink-0">{mockMatchData.sport}</span>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-2xl font-bold text-white truncate">
                  {mockMatchData.teamA.name} vs {mockMatchData.teamB.name}
                </h1>
                <div className="flex items-center space-x-2 text-xs text-white/60">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span>{timeLeft}</span>
                  <Badge
                    variant={mockMatchData.status === "live" ? "destructive" : "secondary"}
                    className={`text-xs flex-shrink-0 ${
                      mockMatchData.status === "live"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}
                  >
                    {mockMatchData.status === "live" ? "🔴 LIVE" : "⏰ Upcoming"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Match Overview */}
      <Card className="bg-white/5 border-white/10 hover:bg-white/10 w-full overflow-hidden">
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 items-center">
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-purple-400">{mockMatchData.teamA.winProbability}%</div>
              <div className="text-white font-semibold text-xs sm:text-base truncate">{mockMatchData.teamA.name}</div>
              <div className="text-white/60 text-xs">{formatCurrency(mockMatchData.teamA.currentPrice)}</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-white mb-1">VS</div>
              <div className="text-white/60 text-xs">Total Market</div>
              <div className="text-sm sm:text-xl font-bold text-white">
                {formatCurrency(mockMatchData.teamA.marketCap + mockMatchData.teamB.marketCap)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-red-400">{mockMatchData.teamB.winProbability}%</div>
              <div className="text-white font-semibold text-xs sm:text-base truncate">{mockMatchData.teamB.name}</div>
              <div className="text-white/60 text-xs">{formatCurrency(mockMatchData.teamB.currentPrice)}</div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <Progress value={mockMatchData.teamA.winProbability} className="h-2 sm:h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 sm:gap-6 w-full">
        {/* Team Sections - Mobile Full Width */}
        <div className="xl:col-span-3 w-full overflow-hidden">
          <Tabs defaultValue="teamA" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10 mb-6 sm:mb-8 h-10 sm:h-12">
              <TabsTrigger
                value="teamA"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 text-xs sm:text-sm truncate"
              >
                {mockMatchData.teamA.name}
              </TabsTrigger>
              <TabsTrigger
                value="teamB"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 text-xs sm:text-sm truncate"
              >
                {mockMatchData.teamB.name}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teamA" className="w-full overflow-hidden pt-4 sm:pt-6">
              <TeamSection
                team={mockMatchData.teamA}
                teamKey="teamA"
                priceHistory={teamAPriceHistory}
                orderBook={teamAOrderBook}
                recentTrades={teamARecentTrades}
                color="from-purple-600/20 to-purple-800/20 border-purple-500"
              />
            </TabsContent>

            <TabsContent value="teamB" className="w-full overflow-hidden pt-4 sm:pt-6">
              <TeamSection
                team={mockMatchData.teamB}
                teamKey="teamB"
                priceHistory={teamBPriceHistory}
                orderBook={teamBOrderBook}
                recentTrades={teamBRecentTrades}
                color="from-red-600/20 to-red-800/20 border-red-500"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile-Optimized Trading Panel */}
        <div className="xl:col-span-1 space-y-3 sm:space-y-6 w-full overflow-hidden">
          {/* User Wallet */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10">
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-white flex items-center text-sm">
                <Wallet className="w-4 h-4 mr-2" />
                Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-3">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Collateral (USDC)</span>
                <span className="text-white font-semibold">{formatCurrency(mockMatchData.userCollateral)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{mockMatchData.teamA.symbol} Tokens</span>
                <span className="text-purple-400 font-semibold">{mockMatchData.teamA.userBalance}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">{mockMatchData.teamB.symbol} Tokens</span>
                <span className="text-red-400 font-semibold">{mockMatchData.teamB.userBalance}</span>
              </div>
              <div className="pt-2 border-t border-white/20">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Total Value</span>
                  <span className="text-white font-bold">
                    {formatCurrency(
                      mockMatchData.userCollateral +
                        mockMatchData.teamA.userBalance * mockMatchData.teamA.currentPrice +
                        mockMatchData.teamB.userBalance * mockMatchData.teamB.currentPrice,
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Trading Panel */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10">
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-white flex items-center text-sm">
                <Target className="w-4 h-4 mr-2" />
                Quick Trade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-3 pb-3">
              <div>
                <label className="text-white/60 text-xs">Select Team Token</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={selectedTeamForTrading === "teamA" ? "default" : "outline"}
                    onClick={() => setSelectedTeamForTrading("teamA")}
                    className={`text-xs p-2 h-auto ${
                      selectedTeamForTrading === "teamA"
                        ? "bg-gradient-to-r from-purple-600 to-purple-700"
                        : "border-white/20 text-white/60"
                    }`}
                  >
                    <div className="text-center w-full">
                      <div className="font-semibold">{mockMatchData.teamA.symbol}</div>
                      <div className="text-xs opacity-80">{formatCurrency(mockMatchData.teamA.currentPrice)}</div>
                    </div>
                  </Button>
                  <Button
                    variant={selectedTeamForTrading === "teamB" ? "default" : "outline"}
                    onClick={() => setSelectedTeamForTrading("teamB")}
                    className={`text-xs p-2 h-auto ${
                      selectedTeamForTrading === "teamB"
                        ? "bg-gradient-to-r from-red-600 to-red-700"
                        : "border-white/20 text-white/60"
                    }`}
                  >
                    <div className="text-center w-full">
                      <div className="font-semibold">{mockMatchData.teamB.symbol}</div>
                      <div className="text-xs opacity-80">{formatCurrency(mockMatchData.teamB.currentPrice)}</div>
                    </div>
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 h-8">
                  <TabsTrigger
                    value="buy"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 text-xs"
                  >
                    Buy
                  </TabsTrigger>
                  <TabsTrigger
                    value="sell"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 text-xs"
                  >
                    Sell
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="buy" className="space-y-3">
                  <div>
                    <label className="text-white/60 text-xs">Amount (USDC)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="mt-1 bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-500 text-sm h-8"
                    />
                  </div>

                  <div className="text-xs text-white/60 space-y-1">
                    <div className="flex justify-between">
                      <span>Estimated tokens:</span>
                      <span>
                        {buyAmount
                          ? Math.floor(
                              Number(buyAmount) /
                                (selectedTeamForTrading === "teamA"
                                  ? mockMatchData.teamA.currentPrice
                                  : mockMatchData.teamB.currentPrice),
                            )
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee (1%):</span>
                      <span>{buyAmount ? formatCurrency(Number(buyAmount) * 0.01) : "$0.00"}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-xs py-2 h-8">
                    Buy {selectedTeamForTrading === "teamA" ? mockMatchData.teamA.symbol : mockMatchData.teamB.symbol}
                  </Button>
                </TabsContent>

                <TabsContent value="sell" className="space-y-3">
                  <div>
                    <label className="text-white/60 text-xs">Amount (Tokens)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                      className="mt-1 bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-purple-500 text-sm h-8"
                      max={
                        selectedTeamForTrading === "teamA"
                          ? mockMatchData.teamA.userBalance
                          : mockMatchData.teamB.userBalance
                      }
                    />
                    <div className="text-xs text-white/50 mt-1">
                      Available:{" "}
                      {selectedTeamForTrading === "teamA"
                        ? mockMatchData.teamA.userBalance
                        : mockMatchData.teamB.userBalance}{" "}
                      tokens
                    </div>
                  </div>

                  <div className="text-xs text-white/60 space-y-1">
                    <div className="flex justify-between">
                      <span>Estimated USDC:</span>
                      <span>
                        {sellAmount
                          ? formatCurrency(
                              Number(sellAmount) *
                                (selectedTeamForTrading === "teamA"
                                  ? mockMatchData.teamA.currentPrice
                                  : mockMatchData.teamB.currentPrice),
                            )
                          : "$0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee (1%):</span>
                      <span>
                        {sellAmount
                          ? formatCurrency(
                              Number(sellAmount) *
                                (selectedTeamForTrading === "teamA"
                                  ? mockMatchData.teamA.currentPrice
                                  : mockMatchData.teamB.currentPrice) *
                                0.01,
                            )
                          : "$0.00"}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-xs py-2 h-8">
                    Sell {selectedTeamForTrading === "teamA" ? mockMatchData.teamA.symbol : mockMatchData.teamB.symbol}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Match Information */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10">
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-white text-sm">Match Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-3 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Total Supply (Each):</span>
                <span className="text-white">50,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Platform Fee:</span>
                <span className="text-white">1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Oracle Status:</span>
                <span className="text-yellow-400">Awaiting</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Settlement:</span>
                <span className="text-white">Auto</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Winner Takes:</span>
                <span className="text-green-400">100%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export { TokenDetail }
