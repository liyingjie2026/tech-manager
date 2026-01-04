"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Clock, AlertCircle, CheckCircle2, Flame, Calendar } from "lucide-react"
import { todoApi } from "@/lib/api/todo"
import { cn } from "@/lib/utils"

export function TodoStatisticsComponent() {
  const [statistics, setStatistics] = useState({
    totalCount: 0,
    pendingCount: 0,
    processingCount: 0,
    completedCount: 0,
    urgentCount: 0,
    overdueCount: 0,
    todayCount: 0,
    weekCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      const response = await todoApi.getStatistics()
      if (response.data) {
        setStatistics(response.data)
      }
    } catch (error) {
      console.error("Failed to load statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      label: "待处理",
      value: statistics.pendingCount,
      icon: Bell,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "紧急待办",
      value: statistics.urgentCount,
      icon: Flame,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "已逾期",
      value: statistics.overdueCount,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "今日到期",
      value: statistics.todayCount,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "本周到期",
      value: statistics.weekCount,
      icon: Calendar,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      label: "已完成",
      value: statistics.completedCount,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded" />
                <div className="h-8 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export { TodoStatisticsComponent as TodoStatistics }
