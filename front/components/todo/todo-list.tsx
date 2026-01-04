"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Clock, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react"
import { todoApi, type TodoItem } from "@/lib/api/todo"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    keyword: "",
  })

  useEffect(() => {
    loadTodos()
  }, [page, filters])

  const loadTodos = async () => {
    try {
      setLoading(true)
      const response = await todoApi.list({
        page,
        size: 10,
        ...filters,
      })
      if (response.data) {
        setTodos(response.data.records || [])
        setTotal(response.data.total || 0)
      }
    } catch (error) {
      console.error("Failed to load todos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id: number) => {
    try {
      await todoApi.complete(id)
      loadTodos()
    } catch (error) {
      console.error("Failed to complete todo:", error)
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
      urgent: "destructive",
      high: "default",
      normal: "secondary",
      low: "outline",
    }
    return variants[priority] || "secondary"
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      pending: "default",
      processing: "secondary",
      completed: "outline",
      cancelled: "outline",
    }
    return variants[status] || "default"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="搜索待办事项..."
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="w-full"
          />
        </div>
        <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="待办类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="project_review">项目评审</SelectItem>
            <SelectItem value="taskbook_audit">任务书审核</SelectItem>
            <SelectItem value="change_audit">变更审核</SelectItem>
            <SelectItem value="midterm_review">中期检查</SelectItem>
            <SelectItem value="annual_review">年报检查</SelectItem>
            <SelectItem value="acceptance_review">验收审核</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="待办状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="pending">待处理</SelectItem>
            <SelectItem value="processing">处理中</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Todo List */}
      {todos.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">暂无待办事项</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <Card
              key={todo.id}
              className={cn("hover:shadow-md transition-shadow", todo.isOverdue && "border-destructive")}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getPriorityBadge(todo.priority)}>{todo.priorityName}</Badge>
                      <Badge variant="outline">{todo.typeName}</Badge>
                      {todo.isOverdue && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          已逾期
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-medium text-base mb-1 line-clamp-1">{todo.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{todo.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        截止: {todo.deadline}
                      </span>
                      {todo.daysRemaining >= 0 && (
                        <span className={cn(todo.daysRemaining <= 1 ? "text-destructive font-medium" : "")}>
                          剩余 {todo.daysRemaining} 天
                        </span>
                      )}
                      <span>编号: {todo.businessNo}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {todo.status === "pending" && (
                      <>
                        <Link href={todo.linkUrl || "#"}>
                          <Button size="sm" className="whitespace-nowrap">
                            去处理
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleComplete(todo.id)}
                          className="whitespace-nowrap"
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          完成
                        </Button>
                      </>
                    )}
                    {todo.status === "completed" && (
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        已完成
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 10 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {total} 条，第 {page} / {Math.ceil(total / 10)} 页
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(total / 10)}
              onClick={() => setPage(page + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
