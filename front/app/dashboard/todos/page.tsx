"use client"

import { TodoStatistics } from "@/components/todo/todo-statistics"
import { TodoList } from "@/components/todo/todo-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList } from "lucide-react"

export default function TodosPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>首页</span>
        <span>&gt;</span>
        <span className="text-foreground">待办事项</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3">
        <ClipboardList className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold">待办事项</h1>
          <p className="text-sm text-muted-foreground mt-1">管理和处理您的待办任务</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <TodoStatistics />

      {/* Todo List */}
      <Card>
        <CardHeader>
          <CardTitle>我的待办</CardTitle>
          <CardDescription>按优先级和截止时间排序</CardDescription>
        </CardHeader>
        <CardContent>
          <TodoList />
        </CardContent>
      </Card>
    </div>
  )
}
