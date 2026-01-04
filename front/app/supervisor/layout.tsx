"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SupervisorSidebar } from "@/components/supervisor/supervisor-sidebar"
import { PortalSwitcher } from "@/components/shared/portal-switcher"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut } from "lucide-react"
import { authStorage } from "@/lib/auth-storage"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { backendPost } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [userName, setUserName] = useState("监管用户")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const user = authStorage.getUser()
    if (user) {
      const displayName = user.realName || user.username || "监管用户"
      setUserName(displayName)
    }
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await backendPost("/api/auth/logout", {})
      authStorage.clearAuth()
      toast({
        title: "退出成功",
        description: "您已安全退出系统",
      })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      authStorage.clearAuth()
      router.push("/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full overflow-hidden">
        <SupervisorSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-[#1677cf] bg-[#1890ff] flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/10" />
              <PortalSwitcher />
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/10">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white/20 text-white">{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-white/90">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>个人信息</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? "退出中..." : "退出登录"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
