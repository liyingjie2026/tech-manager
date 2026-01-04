"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  FileText,
  FolderKanban,
  FileCheck,
  BarChart3,
  CheckCircle,
  Settings,
  Users,
  ClipboardList,
  Calendar,
} from "lucide-react"
import { INSTITUTION_ROLES, ROLE_CONFIG } from "@/lib/constants/institution-roles"

// 项目负责人导航
const PROJECT_LEADER_NAV = [
  { icon: Home, label: "工作台", href: "/dashboard" },
  { icon: FileText, label: "我的项目", href: "/dashboard/my-projects" },
  { icon: FolderKanban, label: "项目申报", href: "/dashboard/projects/apply" },
  { icon: ClipboardList, label: "任务书管理", href: "/dashboard/task-management" },
  { icon: FileCheck, label: "项目变更", href: "/dashboard/projects/change" },
  { icon: Calendar, label: "中期检查", href: "/dashboard/projects/midterm" },
  { icon: Calendar, label: "年度检查", href: "/dashboard/projects/annual" },
  { icon: CheckCircle, label: "项目验收", href: "/dashboard/project-acceptance" },
]

// 机构管理员导航
const ADMIN_NAV = [
  { icon: Home, label: "工作台", href: "/dashboard" },
  { icon: ClipboardList, label: "任务书审核", href: "/dashboard/task-management" },
  { icon: FileCheck, label: "变更审核", href: "/dashboard/projects/change" },
  { icon: Calendar, label: "中期检查审核", href: "/dashboard/projects/midterm" },
  { icon: Calendar, label: "年度检查审核", href: "/dashboard/projects/annual" },
  { icon: CheckCircle, label: "验收审核", href: "/dashboard/project-acceptance" },
  { icon: BarChart3, label: "数据统计", href: "/dashboard/admin/statistics" },
  { icon: Users, label: "用户管理", href: "/dashboard/admin/users" },
  { icon: Settings, label: "系统设置", href: "/dashboard/admin/settings" },
]

export function RoleBasedSidebar() {
  const pathname = usePathname()

  // 从localStorage获取用户角色
  const userRole = useMemo(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("institutionRole") as any) || INSTITUTION_ROLES.PROJECT_LEADER
    }
    return INSTITUTION_ROLES.PROJECT_LEADER
  }, [])

  // 根据角色选择导航菜单
  const navigation = userRole === INSTITUTION_ROLES.ADMIN ? ADMIN_NAV : PROJECT_LEADER_NAV

  return (
    <div className="w-64 bg-gradient-to-b from-[#4B95F3] to-[#6BA8F5] min-h-screen flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <span className="text-xl font-bold text-[#4B95F3]">科</span>
          </div>
          <div className="text-white">
            <div className="font-semibold">科研项目管理系统</div>
            <div className="text-xs opacity-80">{ROLE_CONFIG[userRole].name}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive ? "bg-white text-[#4B95F3] font-medium" : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Role Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
        <div className="text-white/60 text-xs text-center">
          <div>当前角色：{ROLE_CONFIG[userRole].name}</div>
        </div>
      </div>
    </div>
  )
}
