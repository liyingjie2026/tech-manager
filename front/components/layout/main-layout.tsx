"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authStorage } from "@/lib/auth-storage"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check role on route change and clear cache if switching between admin/expert/research
    const user = authStorage.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    // Detect role change based on pathname
    const isAdminRoute = pathname.startsWith("/dashboard/admin")
    const isExpertRoute = pathname.startsWith("/dashboard/expert-reviews")
    const isResearchRoute = !isAdminRoute && !isExpertRoute

    // Store last accessed role type
    const lastRoleType = sessionStorage.getItem("last_role_type")
    let currentRoleType = "research"
    if (isAdminRoute) currentRoleType = "admin"
    if (isExpertRoute) currentRoleType = "expert"

    // If role type changed, clear cache and force re-login
    if (lastRoleType && lastRoleType !== currentRoleType) {
      authStorage.clearAuth()
      router.push("/login")
      return
    }

    sessionStorage.setItem("last_role_type", currentRoleType)
  }, [pathname, router])

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-card">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-64">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
