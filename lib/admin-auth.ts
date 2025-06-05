// Admin authentication utilities
export class AdminAuth {
  private static readonly FALLBACK_USERNAME = "admin"
  private static readonly FALLBACK_PASSWORD = "password"

  // Get admin credentials from environment or fallback
  static getCredentials() {
    return {
      username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || this.FALLBACK_USERNAME,
      password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || this.FALLBACK_PASSWORD,
    }
  }

  // Validate admin credentials
  static validateCredentials(username: string, password: string): boolean {
    const credentials = this.getCredentials()
    return username === credentials.username && password === credentials.password
  }

  // Check if user is authenticated as admin
  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false

    const adminAuth = localStorage.getItem("funfansplay_admin_auth")
    const authTime = localStorage.getItem("funfansplay_admin_auth_time")

    if (!adminAuth || !authTime) return false

    // Check if session is expired (1 hour)
    const expiryTime = 60 * 60 * 1000 // 1 hour
    if (Date.now() - Number.parseInt(authTime) > expiryTime) {
      this.logout()
      return false
    }

    return adminAuth === "authenticated"
  }

  // Login admin
  static login(username: string, password: string): boolean {
    if (this.validateCredentials(username, password)) {
      localStorage.setItem("funfansplay_admin_auth", "authenticated")
      localStorage.setItem("funfansplay_admin_auth_time", Date.now().toString())
      return true
    }
    return false
  }

  // Logout admin
  static logout(): void {
    localStorage.removeItem("funfansplay_admin_auth")
    localStorage.removeItem("funfansplay_admin_auth_time")
  }

  // Get remaining session time in minutes
  static getSessionTimeRemaining(): number {
    const authTime = localStorage.getItem("funfansplay_admin_auth_time")
    if (!authTime) return 0

    const expiryTime = 60 * 60 * 1000 // 1 hour
    const elapsed = Date.now() - Number.parseInt(authTime)
    const remaining = expiryTime - elapsed

    return Math.max(0, Math.floor(remaining / (60 * 1000))) // Convert to minutes
  }
}
