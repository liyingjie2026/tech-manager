"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderKanban, FileCheck, CheckCircle2, DollarSign, Bell, ClipboardList, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { dashboardApi, type DashboardData } from "@/lib/api/dashboard"
import { todoApi } from "@/lib/api/todo"
import { formatDate } from "@/lib/utils/date-format"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await dashboardApi.getDashboard()
      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.error("[v0] Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTodoAction = async (todoId: number, linkUrl?: string) => {
    try {
      // If todo has a link URL, navigate to it
      if (linkUrl) {
        window.location.href = linkUrl
      } else {
        // Otherwise mark as complete
        await todoApi.complete(todoId)
        loadDashboardData()
      }
    } catch (error) {
      console.error("[v0] Failed to complete todo:", error)
    }
  }

  const quickActions = [
    { name: "项目台账", href: "/dashboard/my-projects", icon: FolderKanban },
    { name: "立项申请", href: "/dashboard/project-application", icon: FileCheck },
    { name: "信息查重", href: "/dashboard/duplicate-check", icon: CheckCircle2 },
    { name: "项目验收", href: "/dashboard/project-acceptance", icon: ClipboardList },
  ]

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  const statistics = dashboardData?.projectStats || {
    total: 0,
    inProgress: 0,
    accepted: 0,
    totalBudget: 0,
  }

  const notifications = dashboardData?.notifications || []
  const todoItems = dashboardData?.todoItems || []
  const recentProjects = dashboardData?.recentProjects || []

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>首页</span>
        <span>&gt;</span>
        <span className="text-foreground">首页</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">项目总览</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">已立项项目</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}个</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">申报中项目</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.inProgress}个</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">已验收项目</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.accepted}个</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总预算金额</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalBudget.toFixed(2)}万元</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>通知公告</CardTitle>
              </div>
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="sm">
                  更多
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              <span className="text-destructive">通知({notifications.filter((n) => n.type === "notice").length})</span>
              <span className="mx-2">|</span>
              <span>公告({notifications.filter((n) => n.type === "announcement").length})</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">暂无通知</div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Todo Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <CardTitle>待办事项</CardTitle>
              </div>
              <Link href="/dashboard/todos">
                <Button variant="ghost" size="sm">
                  更多
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {todoItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">暂无待办事项</div>
            ) : (
              <div className="space-y-4">
                {todoItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2">{item.title}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {item.typeName || item.type}
                        </Badge>
                        <span>{formatDate(item.deadline)}</span>
                        {item.isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            已逾期
                          </Badge>
                        )}
                        {!item.isOverdue && item.daysRemaining <= 3 && (
                          <Badge variant="secondary" className="text-xs">
                            {item.daysRemaining}天后到期
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleTodoAction(item.id, item.linkUrl)}>
                      办理
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>项目列表</CardTitle>
            <Link href="/dashboard/my-projects">
              <Button variant="ghost" size="sm">
                查看全部
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">暂无项目</div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{project.name || "未命名项目"}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>项目编号: {project.projectNo || "-"}</span>
                      <span>状态: {project.status || "-"}</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/my-projects/${project.id}`}>
                    <Button size="sm" variant="outline">
                      查看详情
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快捷入口</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.name} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{action.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
