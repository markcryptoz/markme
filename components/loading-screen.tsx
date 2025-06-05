"use client"

import { useEffect, useState } from "react"
import { Zap, TrendingUp, BarChart3, Target } from "lucide-react"

interface LoadingScreenProps {
  onLoadingComplete?: () => void
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const loadingSteps = [
    { text: "Initializing DeFi Protocol", icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { text: "Connecting to Blockchain", icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { text: "Loading Sports Markets", icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { text: "Preparing Trading Interface", icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" /> },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            onLoadingComplete?.()
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onLoadingComplete])

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepTimer)
          return prev
        }
        return prev + 1
      })
    }, 1200)

    return () => clearInterval(stepTimer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-cyan-900/30" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 max-w-md sm:max-w-lg mx-auto text-center">
        {/* Logo Section */}
        <div className="mb-8 sm:mb-12">
          <div className="relative">
            {/* Pulsing Ring */}
            <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-purple-500/30 animate-ping" />
            <div className="absolute inset-2 w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-cyan-500/50 animate-pulse" />

            {/* Logo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
            </div>
          </div>

          <h1 className="mt-4 sm:mt-6 text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            FUN FANS PLAY
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/60">Decentralized Sports Betting</p>
        </div>

        {/* Progress Section */}
        <div className="w-full max-w-xs sm:max-w-sm">
          {/* Progress Bar */}
          <div className="relative mb-6 sm:mb-8">
            <div className="w-full h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="mt-2 text-right">
              <span className="text-xs sm:text-sm text-white/80 font-mono">{progress}%</span>
            </div>
          </div>

          {/* Loading Steps */}
          <div className="space-y-3 sm:space-y-4">
            {loadingSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 sm:space-x-4 transition-all duration-500 ${
                  index <= currentStep ? "opacity-100 translate-x-0" : "opacity-40 translate-x-2"
                }`}
              >
                <div
                  className={`flex-shrink-0 p-2 sm:p-2.5 rounded-lg transition-all duration-500 ${
                    index === currentStep
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg shadow-purple-500/30 scale-110"
                      : index < currentStep
                        ? "bg-green-600/80"
                        : "bg-white/10"
                  }`}
                >
                  <div className={index === currentStep ? "animate-spin" : ""}>{step.icon}</div>
                </div>
                <span
                  className={`text-sm sm:text-base transition-colors duration-500 ${
                    index <= currentStep ? "text-white" : "text-white/50"
                  }`}
                >
                  {step.text}
                </span>
                {index < currentStep && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-white/50 animate-pulse">Powered by Blockchain Technology</p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <div
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
