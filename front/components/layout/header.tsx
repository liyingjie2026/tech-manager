"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Bell, LogOut } from "lucide-react"
import { PortalSwitcher } from "@/components/shared/portal-switcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api/auth"
import { useToast } from "@/hooks/use-toast"
import { authStorage } from "@/lib/auth-storage"

export function Header() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{ name: string; username: string; realName?: string } | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const userData = authStorage.getUser()
    console.log("[v0] Header loading user data:", userData)
    if (userData) {
      const displayName = userData.realName || userData.name || userData.username
      setUser({
        name: displayName,
        username: userData.username,
        realName: userData.realName,
      })
      console.log("[v0] Display name set to:", displayName)
    }
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      // Call backend logout API to clear Redis cache
      await authApi.logout()

      authStorage.clearAuth()

      toast({
        title: "退出成功",
        description: "您已成功退出登录",
      })

      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      toast({
        title: "退出失败",
        description: "退出登录时发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getUserInitials = () => {
    if (!user?.name) return "U"
    const names = user.name.split("（")[0].split("")
    return names.slice(0, 2).join("")
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#4B95F3] border-b border-[#3a7fd9]">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <PortalSwitcher />
          <div className="h-8 w-px bg-white/20" />
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
            <Input
              type="search"
              placeholder="请输入搜索内容"
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative hover:bg-white/10 text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3 hover:bg-white/10 text-white">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-white/20 text-white text-sm">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user?.name || "用户"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.realName || user?.name || "用户"}</p>
                  <p className="text-xs leading-none text-muted-foreground">账号: {user?.username}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>个人信息</DropdownMenuItem>
              <DropdownMenuItem>设置</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "退出中..." : "退出登录"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
