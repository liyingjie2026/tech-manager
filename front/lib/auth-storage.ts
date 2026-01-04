// 统一的认证数据存储管理
export interface User {
  id: number
  username: string
  realName: string
  name?: string
  role?: string
  roles?: Array<{ id: number; roleName: string; roleCode: string }>
  institutionRole?: "project_leader" | "institution_admin"
  institution?: string
  institutionId?: number
  institutionName?: string
  email?: string
  phone?: string
  expertId?: number
  expertName?: string
  permissions?: string[]
  avatar?: string
  department?: string
  position?: string
  status?: number
}

class AuthStorage {
  private static readonly USER_KEY = "current_user"
  private static readonly TOKEN_KEY = "auth_token"
  private static readonly INSTITUTION_ROLE_KEY = "institution_role"

  // Save user
  saveUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(AuthStorage.USER_KEY, JSON.stringify(user))
      console.log("[v0] User saved:", user)
    }
  }

  // Get user
  getUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(AuthStorage.USER_KEY)
      if (userStr) {
        try {
          return JSON.parse(userStr)
        } catch (e) {
          console.error("[v0] Failed to parse user data:", e)
          return null
        }
      }
    }
    return null
  }

  // Save institution role
  saveInstitutionRole(role: "project_leader" | "institution_admin"): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(AuthStorage.INSTITUTION_ROLE_KEY, role)
      console.log("[v0] Institution role saved:", role)
    }
  }

  // Get institution role
  getInstitutionRole(): "project_leader" | "institution_admin" {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem(AuthStorage.INSTITUTION_ROLE_KEY)
      return (role as "project_leader" | "institution_admin") || "project_leader"
    }
    return "project_leader"
  }

  // Save token
  saveToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(AuthStorage.TOKEN_KEY, token)
    }
  }

  // Get token
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AuthStorage.TOKEN_KEY)
    }
    return null
  }

  // Clear all auth data
  clearAuth(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AuthStorage.USER_KEY)
      localStorage.removeItem(AuthStorage.TOKEN_KEY)
      localStorage.removeItem(AuthStorage.INSTITUTION_ROLE_KEY)
      console.log("[v0] Auth data cleared")
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getUser() !== null
  }
}

export const authStorage = new AuthStorage()
