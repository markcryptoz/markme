"use client"

import { useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Zap,
  Dices,
  ListFilter,
  Trophy,
  ClubIcon as Football,
  Shirt,
  Swords,
  Timer,
  Flame,
  Star,
} from "lucide-react"

// Sports categories with their respective icons and subcategories
const sportsCategories = [
  {
    id: "home",
    name: "Home",
    icon: <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
  },
  {
    id: "live",
    name: "Live",
    icon: <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
  },
  {
    id: "popular",
    name: "Popular",
    icon: <Flame className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
    subcategories: ["NBA", "WNBA", "College Basketball", "EuroLeague", "International"],
  },
  {
    id: "football",
    name: "Football",
    icon: <Football className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
    subcategories: ["NFL", "College Football", "CFL", "XFL"],
  },
  {
    id: "baseball",
    name: "Baseball",
    icon: <Shirt className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
    subcategories: ["MLB", "International", "Minor League"],
  },
  {
    id: "hockey",
    name: "Hockey",
    icon: <Swords className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
    subcategories: ["NHL", "Women's Hockey", "International", "AHL"],
  },
  {
    id: "soccer",
    name: "Soccer",
    icon: <Football className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
    subcategories: ["Premier League", "La Liga", "Bundesliga", "Serie A", "MLS", "Women's Soccer", "World Cup"],
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
    subcategories: ["ATP", "WTA", "Grand Slams", "Davis Cup"],
  },
  {
    id: "golf",
    name: "Golf",
    icon: <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
    subcategories: ["PGA Tour", "European Tour", "LPGA", "Majors"],
  },
  {
    id: "cricket",
    name: "Cricket",
    icon: <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
    subcategories: ["IPL", "International", "T20", "Test Matches"],
  },
  {
    id: "ufc",
    name: "UFC/MMA",
    icon: <Swords className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
    subcategories: ["UFC", "Bellator", "ONE Championship"],
  },
  {
    id: "wrestling",
    name: "Wrestling",
    icon: <Swords className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
    subcategories: ["WWE", "AEW", "Olympic"],
  },
  {
    id: "parlay",
    name: "Parlays",
    icon: <Dices className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
  },
  {
    id: "all",
    name: "A-Z Sports",
    icon: <ListFilter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />,
  },
]

interface SportsCategoriesProps {
  onCategorySelect?: (category: string, subcategory?: string) => void
  isMobile?: boolean
}

export function SportsCategories({ onCategorySelect, isMobile = false }: SportsCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState("popular")
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category)
    setActiveSubcategory(null)
    if (onCategorySelect) {
      onCategorySelect(category)
    }
  }

  const handleSubcategorySelect = (subcategory: string) => {
    setActiveSubcategory(subcategory)
    if (onCategorySelect) {
      onCategorySelect(activeCategory, subcategory)
    }
  }

  const selectedCategory = sportsCategories.find((cat) => cat.id === activeCategory)

  if (isMobile) {
    return (
      <div className="flex flex-col h-full max-h-[80vh] overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-4 flex-shrink-0">Sports Categories</h3>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-2 pb-4">
            {sportsCategories.map((category) => (
              <div key={category.id}>
                <Button
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full justify-start ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {category.icon}
                  {category.name}
                </Button>
                {activeCategory === category.id && category.subcategories && (
                  <div className="ml-4 mt-2 space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSubcategorySelect("all")}
                      className="w-full justify-start text-xs text-white/60 hover:text-white hover:bg-white/5"
                    >
                      All {category.name}
                    </Button>
                    {category.subcategories.map((subcategory) => (
                      <Button
                        key={subcategory}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSubcategorySelect(subcategory)}
                        className={`w-full justify-start text-xs ${
                          activeSubcategory === subcategory
                            ? "text-purple-400 bg-white/5"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {subcategory}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Categories Horizontal Scroll */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-1 p-1 bg-white/5 rounded-lg">
          {sportsCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => handleCategorySelect(category.id)}
              className={`flex-shrink-0 text-xs sm:text-sm ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {category.icon}
              <span className="hidden sm:inline">{category.name}</span>
              <span className="sm:hidden">{category.name.split(" ")[0]}</span>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Subcategories if available */}
      {selectedCategory?.subcategories && (
        <ScrollArea className="w-full whitespace-nowrap">
          <Tabs defaultValue={activeSubcategory || "all"} className="w-full">
            <TabsList className="bg-white/5 border border-white/10 h-8 sm:h-9 p-0.5 sm:p-1 inline-flex">
              <TabsTrigger
                value="all"
                onClick={() => handleSubcategorySelect("all")}
                className="h-6 sm:h-7 px-2 sm:px-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-white/70 flex-shrink-0"
              >
                All {selectedCategory.name}
              </TabsTrigger>
              {selectedCategory.subcategories.map((subcategory) => (
                <TabsTrigger
                  key={subcategory}
                  value={subcategory}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  className="h-6 sm:h-7 px-2 sm:px-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-white/70 flex-shrink-0"
                >
                  {subcategory}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {/* Featured Events for the selected category */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-3 sm:p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-lg font-bold text-white flex items-center">
            <Timer className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Featured {selectedCategory?.name} Events
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white/80 hover:bg-white/5 text-xs sm:text-sm px-2 sm:px-3"
          >
            View All
          </Button>
        </div>
        <p className="text-white/60 text-xs sm:text-sm">
          Select a match from the marketplace to view detailed betting options and analytics.
        </p>
      </div>
    </div>
  )
}
