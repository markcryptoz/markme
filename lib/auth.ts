import { getSupabaseClient } from "./supabase"
import type { UserProfile } from "./supabase"

// Generate a random nonce for signing
export const generateNonce = () => {
  return Math.floor(Math.random() * 1000000).toString()
}

// Sign in with MetaMask
export const signInWithMetaMask = async (): Promise<{ user: UserProfile | null; error: any }> => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    const walletAddress = accounts[0].toLowerCase()

    // Generate a nonce for the user to sign
    const nonce = generateNonce()
    const message = `Sign this message to verify your wallet ownership: ${nonce}`

    // Ask user to sign the message
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, walletAddress],
    })

    // Verify the signature on the server side (simplified for this example)
    // In a real app, you'd verify this server-side

    // Check if user exists in Supabase
    const supabase = getSupabaseClient()
    let { data: user, error: fetchError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError
    }

    // If user doesn't exist, create a new profile
    if (!user) {
      const { data: newUser, error: insertError } = await supabase
        .from("user_profiles")
        .insert([
          {
            wallet_address: walletAddress,
            name: null,
            username: `user_${walletAddress.substring(2, 8)}`,
            bio: null,
            interests: [],
            avatar_url: null,
          },
        ])
        .select()
        .single()

      if (insertError) throw insertError
      user = newUser
    }

    // Create a custom session (simplified)
    localStorage.setItem("funfansplay_wallet", walletAddress)
    localStorage.setItem("funfansplay_auth_time", Date.now().toString())

    return { user, error: null }
  } catch (error) {
    console.error("Error signing in with MetaMask:", error)
    return { user: null, error }
  }
}

// Sign out
export const signOut = async () => {
  localStorage.removeItem("funfansplay_wallet")
  localStorage.removeItem("funfansplay_auth_time")
  return true
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false

  const wallet = localStorage.getItem("funfansplay_wallet")
  const authTime = localStorage.getItem("funfansplay_auth_time")

  if (!wallet || !authTime) return false

  // Optional: Check if the session is expired (e.g., after 24 hours)
  const expiryTime = 24 * 60 * 60 * 1000 // 24 hours
  if (Date.now() - Number.parseInt(authTime) > expiryTime) {
    signOut()
    return false
  }

  return true
}

// Get current user
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  if (!isAuthenticated()) return null

  const walletAddress = localStorage.getItem("funfansplay_wallet")
  if (!walletAddress) return null

  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("user_profiles").select("*").eq("wallet_address", walletAddress).single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  return data
}

// Update user profile
export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error: any }> => {
  try {
    if (!isAuthenticated()) throw new Error("Not authenticated")

    const walletAddress = localStorage.getItem("funfansplay_wallet")
    if (!walletAddress) throw new Error("Wallet address not found")

    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from("user_profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("wallet_address", walletAddress)

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error }
  }
}
