"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authService, type AuthUser } from "@/lib/auth"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 不需要认证的路径
const publicPaths = ["/", "/login", "/register", "/forgot-password"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 检查认证状态
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser()
      const isAuth = authService.isAuthenticated()

      if (isAuth && currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
        // 如果不是公开路径且未认证，跳转到登录
        if (!publicPaths.includes(pathname)) {
          router.push("/login")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password)
      if (response.data) {
        authService.saveAuth(response.data)
        setUser(response.data.user)
        return { success: true, message: "登录成功" }
      }
      return { success: false, message: response.message || "登录失败" }
    } catch (error) {
      return { success: false, message: "网络错误" }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
