// 认证相关 API
import { get, post, setToken, clearToken } from "./client"
import type { LoginRequest, LoginResponse, User, ApiResponse } from "../types"

export const authApi = {
  // 用户登录
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await post<LoginResponse>("/auth/login", data)
    if (response.data) {
      setToken(response.data.token)
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.data.refreshToken)
        localStorage.setItem("user_info", JSON.stringify(response.data.user))
      }
    }
    return response
  },

  // 用户登出
  async logout(): Promise<ApiResponse<void>> {
    const response = await post<void>("/auth/logout")
    clearToken()
    return response
  },

  // 刷新 token
  async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
    return post<LoginResponse>("/auth/refresh", { refreshToken })
  },

  // 获取当前用户信息
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return get<User>("/auth/current-user")
  },

  // 修改密码
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return post<void>("/auth/change-password", { oldPassword, newPassword })
  },

  // 发送验证码
  async sendCaptcha(phone: string): Promise<ApiResponse<void>> {
    return post<void>("/auth/send-captcha", { phone })
  },

  // 重置密码
  async resetPassword(phone: string, captcha: string, newPassword: string): Promise<ApiResponse<void>> {
    return post<void>("/auth/reset-password", { phone, captcha, newPassword })
  },

  // 用户注册
  async register(data: {
    username: string
    password: string
    realName: string
    phone: string
    email: string
    institutionId: string
    userType: string
  }): Promise<ApiResponse<User>> {
    return post<User>("/auth/register", data)
  },
}
