import { getSupabaseClient } from "./supabase"
import type { UserProfile } from "./supabase"

// Database utility functions for user management
export class DatabaseUtils {
  private static supabase = getSupabaseClient()

  // Get all users (for admin purposes)
  static async getAllUsers(): Promise<{ users: UserProfile[]; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      return { users: data || [], error: null }
    } catch (error) {
      console.error("Error fetching users:", error)
      return { users: [], error }
    }
  }

  // Get user statistics
  static async getUserStats(): Promise<{
    totalUsers: number
    newUsersToday: number
    activeUsers: number
    error: any
  }> {
    try {
      // Get total users
      const { count: totalUsers, error: totalError } = await this.supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })

      if (totalError) throw totalError

      // Get users created today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: newUsersToday, error: todayError } = await this.supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString())

      if (todayError) throw todayError

      // For now, consider all users as active (in a real app, you'd track last login)
      const activeUsers = totalUsers || 0

      return {
        totalUsers: totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        activeUsers,
        error: null,
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
      return {
        totalUsers: 0,
        newUsersToday: 0,
        activeUsers: 0,
        error,
      }
    }
  }

  // Search users by username or wallet address
  static async searchUsers(query: string): Promise<{ users: UserProfile[]; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .select("*")
        .or(`username.ilike.%${query}%,wallet_address.ilike.%${query}%,name.ilike.%${query}%`)
        .limit(10)

      if (error) throw error

      return { users: data || [], error: null }
    } catch (error) {
      console.error("Error searching users:", error)
      return { users: [], error }
    }
  }

  // Get users by interests
  static async getUsersByInterest(interest: string): Promise<{ users: UserProfile[]; error: any }> {
    try {
      const { data, error } = await this.supabase.from("user_profiles").select("*").contains("interests", [interest])

      if (error) throw error

      return { users: data || [], error: null }
    } catch (error) {
      console.error("Error fetching users by interest:", error)
      return { users: [], error }
    }
  }

  // Delete user (admin function)
  static async deleteUser(walletAddress: string): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await this.supabase.from("user_profiles").delete().eq("wallet_address", walletAddress)

      if (error) throw error

      return { success: true, error: null }
    } catch (error) {
      console.error("Error deleting user:", error)
      return { success: false, error }
    }
  }

  // Update user activity (for tracking active users)
  static async updateUserActivity(walletAddress: string): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await this.supabase
        .from("user_profiles")
        .update({ updated_at: new Date().toISOString() })
        .eq("wallet_address", walletAddress)

      if (error) throw error

      return { success: true, error: null }
    } catch (error) {
      console.error("Error updating user activity:", error)
      return { success: false, error }
    }
  }
}
