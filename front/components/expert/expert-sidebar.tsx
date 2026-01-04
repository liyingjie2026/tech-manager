"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ClipboardList, User, FileCheck, FileUp } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Menu } from "lucide-react" // Import Menu icon

const navigation = [
  { name: "工作台", href: "/expert", icon: LayoutDashboard },
  { name: "待评审项目", href: "/expert/review", icon: ClipboardList },
  { name: "结论上传", href: "/expert/conclusion", icon: FileUp, badge: "组长" },
  { name: "评审历史", href: "/expert/history", icon: FileCheck },
  { name: "个人信息", href: "/expert/profile", icon: User },
]

export function ExpertSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "border-r bg-gradient-to-b from-[#4B95F3] to-[#6BA8F5] flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/20">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Logo" width={36} height={36} className="rounded-full bg-white p-1" />
            <div>
              <div className="font-semibold text-sm text-white">科研项目管理系统</div>
              <div className="text-xs text-white/70">专家评审端</div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("text-white hover:bg-white/10", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = item.href === "/expert" ? pathname === "/expert" : pathname?.startsWith(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive ? "bg-white text-[#4B95F3] font-medium" : "text-white/80 hover:bg-white/10 hover:text-white",
                collapsed && "justify-center",
              )}
              title={collapsed ? item.name : ""}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="flex-1">{item.name}</span>}
              {!collapsed && item.badge && (
                <span className="text-xs bg-orange-400 text-white px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
