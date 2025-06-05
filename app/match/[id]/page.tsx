"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
  PieChart,
  Activity,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, PieChart as RechartsPieChart, Cell, Pie } from "recharts"

// Mock data for the specific match
const mockMatchData = {
  id: "1",
  sport: "⚽",
  teamA: "Manchester United",
  teamB: "Liverpool",
  startTime: "2024-01-15T15:00:00Z",
  currentPrice: 1.24,
  marketCap: 125000,
  priceChange: 5.2,
  volume24h: 45000,
  totalHolders: 1250,
  status: "live",
  teamASupport: 65,
  teamBSupport: 35,
  totalSupply: 100000,
  userBalance: {
    teamA: 150,
    teamB: 75,
    collateral: 500,
  },
}

// Mock price history data
const priceHistory = [
  { time: "00:00", price: 1.15 },
  { time: "04:00", price: 1.18 },
  { time: "08:00", price: 1.22 },
  { time: "12:00", price: 1.2 },
  { time: "16:00", price: 1.24 },
  { time: "20:00", price: 1.26 },
]

// Mock order book data
const orderBook = {
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

// Mock recent trades
const recentTrades = [
  { time: "14:32", side: "buy", amount: 250, price: 1.24 },
  { time: "14:30", side: "sell", amount: 180, price: 1.23 },
  { time: "14:28", side: "buy", amount: 320, price: 1.24 },
  { time: "14:25", side: "buy", amount: 150, price: 1.23 },
  { time: "14:22", side: "sell", amount: 200, price: 1.22 },
]

const COLORS = ["#3b82f6", "#ef4444"]

export default function MatchDetailPage() {
  const params = useParams()
  const [buyAmount, setBuyAmount] = useState("")
  const [sellAmount, setSellAmount] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("teamA")
  const [timeLeft, setTimeLeft] = useState("")

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

  const pieData = [
    { name: mockMatchData.teamA, value: mockMatchData.teamASupport, color: "#3b82f6" },
    { name: mockMatchData.teamB, value: mockMatchData.teamBSupport, color: "#ef4444" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Markets
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{mockMatchData.sport}</span>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {mockMatchData.teamA} vs {mockMatchData.teamB}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}</span>
                    <Badge
                      variant={mockMatchData.status === "live" ? "destructive" : "secondary"}
                      className={
                        mockMatchData.status === "live"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }
                    >
                      {mockMatchData.status === "live" ? "🔴 LIVE" : "⏰ Upcoming"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Token Price</p>
                      <p className="text-xl font-bold text-white">${mockMatchData.currentPrice}</p>
                      <div
                        className={`flex items-center text-sm ${mockMatchData.priceChange >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {mockMatchData.priceChange >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(mockMatchData.priceChange)}%
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Market Cap</p>
                      <p className="text-xl font-bold text-white">${mockMatchData.marketCap.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">24h Volume</p>
                      <p className="text-xl font-bold text-white">${mockMatchData.volume24h.toLocaleString()}</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Holders</p>
                      <p className="text-xl font-bold text-white">{mockMatchData.totalHolders.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Price Chart (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    price: {
                      label: "Price",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-64"
                >
                  <LineChart data={priceHistory}>
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Team Support Distribution */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Team Support Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartContainer
                    config={{
                      teamA: {
                        label: mockMatchData.teamA,
                        color: "#3b82f6",
                      },
                      teamB: {
                        label: mockMatchData.teamB,
                        color: "#ef4444",
                      },
                    }}
                    className="h-48"
                  >
                    <RechartsPieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ChartContainer>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{mockMatchData.teamA}</span>
                        <span className="text-blue-400 font-bold">{mockMatchData.teamASupport}%</span>
                      </div>
                      <Progress value={mockMatchData.teamASupport} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{mockMatchData.teamB}</span>
                        <span className="text-red-400 font-bold">{mockMatchData.teamBSupport}%</span>
                      </div>
                      <Progress value={mockMatchData.teamBSupport} className="h-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Book and Recent Trades */}
            <Tabs defaultValue="orderbook" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="orderbook" className="data-[state=active]:bg-slate-700">
                  Order Book
                </TabsTrigger>
                <TabsTrigger value="trades" className="data-[state=active]:bg-slate-700">
                  Recent Trades
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orderbook">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-green-400 font-semibold mb-3">Bids</h4>
                        <div className="space-y-1">
                          {orderBook.bids.map((bid, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-green-400">${bid.price}</span>
                              <span className="text-white">{bid.amount}</span>
                              <span className="text-slate-400">{bid.total}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-red-400 font-semibold mb-3">Asks</h4>
                        <div className="space-y-1">
                          {orderBook.asks.map((ask, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-red-400">${ask.price}</span>
                              <span className="text-white">{ask.amount}</span>
                              <span className="text-slate-400">{ask.total}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trades">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-slate-400 border-b border-slate-600 pb-2">
                        <span>Time</span>
                        <span>Side</span>
                        <span>Amount</span>
                        <span>Price</span>
                      </div>
                      {recentTrades.map((trade, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 text-sm">
                          <span className="text-slate-400">{trade.time}</span>
                          <span className={trade.side === "buy" ? "text-green-400" : "text-red-400"}>
                            {trade.side.toUpperCase()}
                          </span>
                          <span className="text-white">{trade.amount}</span>
                          <span className="text-white">${trade.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Trading Panel */}
          <div className="space-y-6">
            {/* User Wallet */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Collateral (USDC)</span>
                  <span className="text-white font-semibold">${mockMatchData.userBalance.collateral}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{mockMatchData.teamA} Tokens</span>
                  <span className="text-blue-400 font-semibold">{mockMatchData.userBalance.teamA}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{mockMatchData.teamB} Tokens</span>
                  <span className="text-red-400 font-semibold">{mockMatchData.userBalance.teamB}</span>
                </div>
              </CardContent>
            </Card>

            {/* Trading Panel */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Trade Tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                    <TabsTrigger value="buy" className="data-[state=active]:bg-green-600">
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="data-[state=active]:bg-red-600">
                      Sell
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm">Select Team</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          variant={selectedTeam === "teamA" ? "default" : "outline"}
                          onClick={() => setSelectedTeam("teamA")}
                          className={selectedTeam === "teamA" ? "bg-blue-600" : "border-slate-600 text-slate-400"}
                        >
                          {mockMatchData.teamA}
                        </Button>
                        <Button
                          variant={selectedTeam === "teamB" ? "default" : "outline"}
                          onClick={() => setSelectedTeam("teamB")}
                          className={selectedTeam === "teamB" ? "bg-red-600" : "border-slate-600 text-slate-400"}
                        >
                          {mockMatchData.teamB}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">Amount (USDC)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        className="mt-2 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="text-sm text-slate-400">
                      <div className="flex justify-between">
                        <span>Estimated tokens:</span>
                        <span>{buyAmount ? Math.floor(Number(buyAmount) / mockMatchData.currentPrice) : 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform fee (1%):</span>
                        <span>${buyAmount ? (Number(buyAmount) * 0.01).toFixed(2) : "0.00"}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700">Buy Tokens</Button>
                  </TabsContent>

                  <TabsContent value="sell" className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm">Select Team</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          variant={selectedTeam === "teamA" ? "default" : "outline"}
                          onClick={() => setSelectedTeam("teamA")}
                          className={selectedTeam === "teamA" ? "bg-blue-600" : "border-slate-600 text-slate-400"}
                        >
                          {mockMatchData.teamA} ({mockMatchData.userBalance.teamA})
                        </Button>
                        <Button
                          variant={selectedTeam === "teamB" ? "default" : "outline"}
                          onClick={() => setSelectedTeam("teamB")}
                          className={selectedTeam === "teamB" ? "bg-red-600" : "border-slate-600 text-slate-400"}
                        >
                          {mockMatchData.teamB} ({mockMatchData.userBalance.teamB})
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">Amount (Tokens)</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                        className="mt-2 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="text-sm text-slate-400">
                      <div className="flex justify-between">
                        <span>Estimated USDC:</span>
                        <span>
                          ${sellAmount ? (Number(sellAmount) * mockMatchData.currentPrice).toFixed(2) : "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform fee (1%):</span>
                        <span>
                          ${sellAmount ? (Number(sellAmount) * mockMatchData.currentPrice * 0.01).toFixed(2) : "0.00"}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-red-600 hover:bg-red-700">Sell Tokens</Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Match Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Match Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Supply:</span>
                  <span className="text-white">{mockMatchData.totalSupply.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform Fee:</span>
                  <span className="text-white">1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Oracle Status:</span>
                  <span className="text-yellow-400">Awaiting Result</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Settlement:</span>
                  <span className="text-white">Auto (Post-match)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
