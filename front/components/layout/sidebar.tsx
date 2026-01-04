"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  Search,
  Settings,
  X,
  ChevronDown,
  ClipboardList,
  Award,
  Target,
  Menu,
  CheckCircle,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useMemo } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Image from "next/image"
import { INSTITUTION_ROLES, ROLE_CONFIG } from "@/lib/constants/institution-roles"
import { authStorage } from "@/lib/auth-storage"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  const [userRole, setUserRole] = useState<string>(INSTITUTION_ROLES.PROJECT_LEADER)

  useEffect(() => {
    const user = authStorage.getUser()
    const role = user?.institutionRole || INSTITUTION_ROLES.PROJECT_LEADER
    console.log("[v0] Sidebar - Loading role from authStorage:", role)
    setUserRole(role)
  }, [])

  const [projectManagementOpen, setProjectManagementOpen] = useState(true)
  const [achievementManagementOpen, setAchievementManagementOpen] = useState(false)
  const [resourceSearchOpen, setResourceSearchOpen] = useState(false)
  const [systemManagementOpen, setSystemManagementOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const navigation = [{ name: "工作台", href: "/dashboard", icon: Home }]

  const demandManagement = [{ name: "需求征集", href: "/dashboard/demands", icon: ClipboardList }]

  const projectLeaderItems = useMemo(
    () => [
      { name: "项目一览", href: "/dashboard/my-projects" },
      { name: "项目申报", href: "/dashboard/projects/apply" },
      { name: "任务书管理", href: "/dashboard/task-management" },
      { name: "项目变更", href: "/dashboard/project-change" },
      { name: "中期检查", href: "/dashboard/projects/midterm" },
      { name: "年度检查", href: "/dashboard/projects/annual" },
      { name: "项目验收", href: "/dashboard/project-acceptance" },
    ],
    [],
  )

  const adminReviewItems = useMemo(
    () => [
      { name: "项目一览", href: "/dashboard/my-projects" },
      { name: "任务书审核", href: "/dashboard/admin/task-book-review" },
      { name: "变更审核", href: "/dashboard/admin/change-review" },
      { name: "中期检查审核", href: "/dashboard/admin/midterm-review" },
      { name: "年度检查审核", href: "/dashboard/admin/annual-review" },
      { name: "验收审核", href: "/dashboard/admin/acceptance-review" },
    ],
    [],
  )

  const projectManagementItems = userRole === INSTITUTION_ROLES.ADMIN ? adminReviewItems : projectLeaderItems

  const achievementManagementItems = [
    { name: "项目成果", href: "/dashboard/achievements" },
    { name: "成果转化", href: "/dashboard/achievements/transformation" },
    { name: "项目获奖", href: "/dashboard/achievements/awards" },
  ]

  const resourceSearchItems = [
    { name: "资源共享", href: "/dashboard/resources" },
    { name: "成果检索", href: "/dashboard/resource-sharing" },
  ]

  const systemManagementItems = [
    { name: "用户管理", href: "/dashboard/admin/users" },
    { name: "资质管理", href: "/dashboard/system/qualifications" },
    { name: "单位管理", href: "/dashboard/system" },
  ]

  const biddingNavigation = [{ name: "我要揭榜", href: "/dashboard/bidding", icon: Target }]

  const duplicateCheckNavigation = [{ name: "查重检测", href: "/dashboard/duplicate-check", icon: FileCheck }]

  const assessmentNavigation = [{ name: "考核评价", href: "/dashboard/assessment", icon: CheckCircle }]

  const showSystemManagement = userRole === INSTITUTION_ROLES.ADMIN

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-[#4B95F3] to-[#6BA8F5] border-r border-white/20 transition-all duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/20">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <Image src="/images/logo.png" alt="Logo" width={36} height={36} className="rounded-full bg-white p-1" />
                <div>
                  <h1 className="text-base font-semibold text-white">科研项目管理系统</h1>
                  <p className="text-xs text-white/70">{ROLE_CONFIG[userRole]?.name || "科研机构端"}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn("text-white hover:bg-white/10 hidden lg:flex", collapsed && "mx-auto")}
                onClick={() => setCollapsed(!collapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-white text-[#4B95F3]" : "text-white/80 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center",
                  )}
                  title={collapsed ? item.name : ""}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && item.name}
                </Link>
              )
            })}

            {demandManagement.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-white text-[#4B95F3]" : "text-white/80 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center",
                  )}
                  title={collapsed ? item.name : ""}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && item.name}
                </Link>
              )
            })}

            {!collapsed && (
              <>
                <Collapsible open={projectManagementOpen} onOpenChange={setProjectManagementOpen}>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        "text-white/90 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        项目管理
                      </div>
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", projectManagementOpen && "rotate-180")}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-1">
                    {projectManagementItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 pl-11 pr-3 py-2 rounded-lg text-sm transition-colors",
                            isActive
                              ? "bg-white text-[#4B95F3] font-medium"
                              : "text-white/80 hover:bg-white/10 hover:text-white",
                          )}
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}

            {duplicateCheckNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-white text-[#4B95F3]" : "text-white/80 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center",
                  )}
                  title={collapsed ? item.name : ""}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && item.name}
                </Link>
              )
            })}

            {!collapsed && (
              <>
                <Collapsible open={achievementManagementOpen} onOpenChange={setAchievementManagementOpen}>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        "text-white/90 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5" />
                        成果管理
                      </div>
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", achievementManagementOpen && "rotate-180")}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-1">
                    {achievementManagementItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 pl-11 pr-3 py-2 rounded-lg text-sm transition-colors",
                            isActive
                              ? "bg-white text-[#4B95F3] font-medium"
                              : "text-white/80 hover:bg-white/10 hover:text-white",
                          )}
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}

            {biddingNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-white text-[#4B95F3]" : "text-white/80 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center",
                  )}
                  title={collapsed ? item.name : ""}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && item.name}
                </Link>
              )
            })}

            {assessmentNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-white text-[#4B95F3]" : "text-white/80 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center",
                  )}
                  title={collapsed ? item.name : ""}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && item.name}
                </Link>
              )
            })}

            {!collapsed && (
              <>
                <Collapsible open={resourceSearchOpen} onOpenChange={setResourceSearchOpen}>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        "text-white/90 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Search className="h-5 w-5" />
                        成果检索
                      </div>
                      <ChevronDown className={cn("h-4 w-4 transition-transform", resourceSearchOpen && "rotate-180")} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-1">
                    {resourceSearchItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 pl-11 pr-3 py-2 rounded-lg text-sm transition-colors",
                            isActive
                              ? "bg-white text-[#4B95F3] font-medium"
                              : "text-white/80 hover:bg-white/10 hover:text-white",
                          )}
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </CollapsibleContent>
                </Collapsible>

                {showSystemManagement && (
                  <Collapsible open={systemManagementOpen} onOpenChange={setSystemManagementOpen}>
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "flex w-full items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          "text-white/90 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Settings className="h-5 w-5" />
                          系统管理
                        </div>
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", systemManagementOpen && "rotate-180")}
                        />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 space-y-1">
                      {systemManagementItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-3 pl-11 pr-3 py-2 rounded-lg text-sm transition-colors",
                              isActive
                                ? "bg-white text-[#4B95F3] font-medium"
                                : "text-white/80 hover:bg-white/10 hover:text-white",
                            )}
                          >
                            {item.name}
                          </Link>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </>
            )}
          </nav>
        </div>
      </aside>
    </>
  )
}
