"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { INSTITUTION_ROLES, canManageUsers } from "@/lib/constants/institution-roles"
import { authStorage } from "@/lib/auth-storage"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const user = authStorage.getUser()
    const userRole = user?.institutionRole || INSTITUTION_ROLES.PROJECT_LEADER

    console.log("[v0] AdminLayout - Checking role:", userRole)

    if (!canManageUsers(userRole)) {
      // 非管理员，重定向到主页
      console.log("[v0] AdminLayout - Not admin, redirecting to dashboard")
      router.push("/dashboard")
    } else {
      console.log("[v0] AdminLayout - Admin access granted")
    }
  }, [router])

  return <>{children}</>
}
