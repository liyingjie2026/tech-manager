"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  FileText,
  FolderOpen,
  Award,
  Users,
  Bell,
  Search,
  Trophy,
  Database,
  CheckSquare,
  ClipboardList,
  FileCheck,
  RefreshCw,
  DollarSign,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

const menuItems = [
  {
    title: "工作台",
    items: [{ title: "我的事项", icon: Bell, href: "/dashboard" }],
  },
  {
    title: "需求管理",
    items: [{ title: "需求征集", icon: ClipboardList, href: "/dashboard/demands" }],
  },
  {
    title: "项目管理",
    items: [
      { title: "项目一览", icon: FileText, href: "/dashboard/my-projects" },
      { title: "项目申报", icon: FileText, href: "/dashboard/projects/apply" },
      { title: "任务书管理", icon: FolderOpen, href: "/dashboard/projects/task" },
      { title: "项目变更", icon: RefreshCw, href: "/dashboard/projects/change" },
      { title: "中期检查", icon: CheckSquare, href: "/dashboard/midterm-review" },
      { title: "项目验收", icon: FileCheck, href: "/dashboard/project-acceptance" },
      { title: "预算管理", icon: DollarSign, href: "/dashboard/budget-management" },
    ],
  },
  {
    title: "成果管理",
    items: [
      { title: "项目成果", icon: Award, href: "/dashboard/achievements" },
      { title: "成果转化", icon: RefreshCw, href: "/dashboard/achievements/transformation" },
      { title: "项目获奖", icon: Trophy, href: "/dashboard/achievements/awards" },
    ],
  },
  {
    title: "揭榜挂帅",
    items: [{ title: "我要揭榜", icon: Trophy, href: "/dashboard/bidding" }],
  },
  {
    title: "资源查找",
    items: [
      { title: "资源检索", icon: Search, href: "/dashboard/resources" },
      { title: "查重检测", icon: FileCheck, href: "/dashboard/duplicate-check" },
      { title: "科技查新", icon: Database, href: "/dashboard/query-search" },
    ],
  },
  {
    title: "系统管理",
    items: [
      { title: "单位管理", icon: Building2, href: "/dashboard/system" },
      { title: "人员管理", icon: Users, href: "/dashboard/personnel" },
    ],
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="bg-[#4B95F3] text-white">
      <SidebarHeader className="border-b border-white/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Logo" width={36} height={36} className="rounded-full bg-white p-1" />
          <div>
            <h2 className="text-base font-semibold text-white">科研机构端</h2>
            <p className="text-xs text-white/70">湖南大学</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="[&_[data-slot=sidebar-group-label]]:text-white/70 [&_[data-slot=sidebar-menu-button]]:text-white/80 [&_[data-slot=sidebar-menu-button]:hover]:bg-white/10 [&_[data-slot=sidebar-menu-button]:hover]:text-white [&_[data-slot=sidebar-menu-button][data-active=true]]:bg-white [&_[data-slot=sidebar-menu-button][data-active=true]]:text-[#4B95F3]">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/20 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-white/20">
            <AvatarFallback className="bg-white/20 text-white">张</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-sm">
            <p className="font-medium text-white">张教授</p>
            <p className="text-xs text-white/70">项目负责人</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
