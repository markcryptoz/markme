import { createClient } from "@supabase/supabase-js"

// Use your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ukhdvpzftmnkofkmtqbk.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVraGR2cHpmdG1ua29ma210cWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDc0NTMsImV4cCI6MjA2NDcyMzQ1M30.WTbsn5UFHdvB8Q7Q9yKrteASuxwaoIzsy1CAgAIsAIQ"

// Validate that we have the required configuration
if (!supabaseUrl || supabaseUrl === "YOUR_SUPABASE_URL_HERE") {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY_HERE") {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Create a single instance of the Supabase client for client-side usage
let clientSideSupabase: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!clientSideSupabase) {
    clientSideSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return clientSideSupabase
}

// For server-side operations (if needed)
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("user_profiles").select("count").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { connected: false, error: error.message }
    }

    console.log("Supabase connection successful!")
    return { connected: true, error: null }
  } catch (error) {
    console.error("Supabase connection test failed:", error)
    return { connected: false, error: "Failed to connect to Supabase" }
  }
}

// Database types
export type UserProfile = {
  wallet_address: string
  name: string | null
  username: string | null
  bio: string | null
  interests: string[] | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
