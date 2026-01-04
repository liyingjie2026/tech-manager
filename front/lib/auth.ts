export interface AuthUser {
  id: string
  username: string
  realName: string
  userType: string
  institutionId: string
  institutionName: string
  department?: string
  roles: string[]
  phone?: string
  email?: string
}

export interface AuthData {
  token: string
  refreshToken: string
  expiresIn: number
  user: AuthUser
}

// 认证服务
export const authService = {
  // 登录
  async login(username: string, password: string): Promise<{ code: number; message: string; data: AuthData | null }> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    return response.json()
  },

  // 保存认证信息
  saveAuth(data: AuthData) {
    if (typeof window === "undefined") return
    localStorage.setItem("token", data.token)
    localStorage.setItem("refreshToken", data.refreshToken)
    localStorage.setItem("user", JSON.stringify(data.user))
    localStorage.setItem("tokenExpiry", String(Date.now() + data.expiresIn * 1000))
  },

  // 清除认证信息
  clearAuth() {
    if (typeof window === "undefined") return
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    localStorage.removeItem("tokenExpiry")
  },

  // 获取token
  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  },

  // 获取当前用户
  getCurrentUser(): AuthUser | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  // 检查是否已登录
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    const token = localStorage.getItem("token")
    const expiry = localStorage.getItem("tokenExpiry")
    if (!token || !expiry) return false
    return Date.now() < Number.parseInt(expiry)
  },

  // 登出
  logout() {
    this.clearAuth()
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  },

  // 检查用户类型
  hasUserType(types: string[]): boolean {
    const user = this.getCurrentUser()
    if (!user) return false
    return types.includes(user.userType)
  },

  // 检查角色
  hasRole(roleCode: string): boolean {
    const user = this.getCurrentUser()
    if (!user) return false
    return user.roles.includes(roleCode)
  },
}

// 创建带认证的fetch
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = authService.getToken()

  const headers = new Headers(options.headers)
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // 如果token过期，跳转到登录页
  if (response.status === 401) {
    authService.logout()
  }

  return response
}
