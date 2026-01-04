"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Building2,
  Users,
  FileText,
  CheckSquare,
  FolderOpen,
  Award,
  Database,
  BarChart3,
  Settings,
  GraduationCap,
  Bell,
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const menuItems = [
  {
    title: "工作台",
    icon: LayoutDashboard,
    items: [{ title: "我的事项", icon: Bell, href: "/supervisor/dashboard" }],
  },
  {
    title: "需求管理",
    icon: ClipboardList,
    items: [{ title: "需求征集", icon: ClipboardList, href: "/supervisor/demand" }],
  },
  {
    title: "项目管理",
    icon: FolderOpen,
    items: [
      { title: "申报管理", icon: FileText, href: "/supervisor/application" },
      { title: "立项评审", icon: CheckSquare, href: "/supervisor/review" },
      { title: "任务书管理", icon: FolderOpen, href: "/supervisor/task" },
      { title: "变更管理", icon: FileText, href: "/supervisor/change" },
      { title: "中期检查", icon: CheckSquare, href: "/supervisor/midterm" },
      { title: "年度检查", icon: CheckSquare, href: "/supervisor/annual" },
      { title: "结题验收", icon: Award, href: "/supervisor/acceptance" },
      { title: "项目库管理", icon: Database, href: "/supervisor/project-library" },
    ],
  },
  {
    title: "成果管理",
    icon: Award,
    items: [
      { title: "成果审核", icon: CheckSquare, href: "/supervisor/achievement-review" },
      { title: "成果鉴定", icon: Award, href: "/supervisor/achievement-appraisal" },
    ],
  },
  {
    title: "共享资源",
    icon: Database,
    items: [
      { title: "基础数据", icon: Database, href: "/supervisor/basic-data" },
      { title: "专业软件", icon: BookOpen, href: "/supervisor/software" },
      { title: "科研仪器", icon: Settings, href: "/supervisor/equipment" },
    ],
  },
  {
    title: "综合分析",
    icon: BarChart3,
    items: [
      { title: "项目总览", icon: LayoutDashboard, href: "/supervisor/overview" },
      { title: "统计分析", icon: BarChart3, href: "/supervisor/statistics" },
    ],
  },
  {
    title: "配置管理",
    icon: Settings,
    items: [
      { title: "申报配置", icon: Settings, href: "/supervisor/config/application" },
      { title: "评分规则", icon: Settings, href: "/supervisor/config/scoring" },
      { title: "字典管理", icon: Settings, href: "/supervisor/config/dictionary" },
      { title: "流程配置", icon: Settings, href: "/supervisor/config/workflow" },
      { title: "权限管理", icon: Settings, href: "/supervisor/config/permissions" },
    ],
  },
  {
    title: "专家库",
    icon: GraduationCap,
    items: [{ title: "专家管理", icon: GraduationCap, href: "/supervisor/expert" }],
  },
  {
    title: "系统管理",
    icon: Users,
    items: [
      { title: "角色管理", icon: Users, href: "/supervisor/system/role" },
      { title: "用户管理", icon: Users, href: "/supervisor/system/user" },
      { title: "机构管理", icon: Building2, href: "/supervisor/system/institution" },
      { title: "发布管理", icon: FileText, href: "/supervisor/system/publish" },
    ],
  },
]

export function SupervisorSidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  useEffect(() => {
    const activeGroup = menuItems.find((group) =>
      group.items.some((item) => pathname === item.href || pathname?.startsWith(item.href + "/")),
    )
    if (activeGroup && !expandedGroups.includes(activeGroup.title)) {
      setExpandedGroups([activeGroup.title])
    }
  }, [pathname])

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupTitle) ? prev.filter((t) => t !== groupTitle) : [...prev, groupTitle],
    )
  }

  return (
    <div className="w-64 min-w-64 max-w-64 bg-[#4B95F3] text-white flex flex-col h-full border-r shrink-0">
      {/* Header */}
      <div className="border-b border-white/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Logo" width={36} height={36} className="rounded-full bg-white p-1" />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-white whitespace-nowrap">科研项目管理系统</h2>
            <p className="text-xs text-white/70 whitespace-nowrap">监测监管端</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          {menuItems.map((group) => {
            const isExpanded = expandedGroups.includes(group.title)
            const hasActiveItem = group.items.some(
              (item) => pathname === item.href || pathname?.startsWith(item.href + "/"),
            )
            const GroupIcon = group.icon

            return (
              <div key={group.title} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors text-left",
                    "text-white hover:bg-white/10",
                    hasActiveItem && "bg-white/20",
                  )}
                >
                  <GroupIcon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-sm font-medium whitespace-nowrap">{group.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="pl-6 space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                      const ItemIcon = item.icon

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm",
                            isActive
                              ? "bg-white text-[#4B95F3] font-medium"
                              : "text-white/80 hover:bg-white/10 hover:text-white",
                          )}
                        >
                          <ItemIcon className="h-3.5 w-3.5 shrink-0" />
                          <span className="whitespace-nowrap">{item.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/20 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-medium">管</span>
          </div>
          <div className="flex-1 min-w-0 text-sm">
            <p className="font-medium text-white whitespace-nowrap">管理员</p>
            <p className="text-xs text-white/70 whitespace-nowrap">在线</p>
          </div>
        </div>
      </div>
    </div>
  )
}
