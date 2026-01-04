"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Clock, Search } from "lucide-react"
import { todoApi, type TodoItem, type TodoStatistics } from "@/lib/api/todo"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function TodoPage() {
  const { toast } = useToast()
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [statistics, setStatistics] = useState<TodoStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("pending")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    fetchTodos()
    fetchStatistics()
  }, [page, typeFilter, statusFilter])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const params: any = {
        page,
        size: pageSize,
        status: statusFilter === "all" ? undefined : statusFilter,
        type: typeFilter === "all" ? undefined : typeFilter,
        keyword: keyword || undefined,
      }
      const response = await todoApi.list(params)
      setTodos(response.records || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error("[v0] Failed to fetch todos:", error)
      toast({
        title: "加载失败",
        description: "获取待办事项失败，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const stats = await todoApi.getStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error("[v0] Failed to fetch todo statistics:", error)
    }
  }

  const handleComplete = async (id: number) => {
    try {
      await todoApi.complete(id)
      toast({
        title: "操作成功",
        description: "待办事项已完成",
      })
      fetchTodos()
      fetchStatistics()
    } catch (error) {
      console.error("[v0] Failed to complete todo:", error)
      toast({
        title: "操作失败",
        description: "完成待办事项失败，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchTodos()
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      urgent: { variant: "destructive", icon: <AlertCircle className="h-3 w-3" /> },
      high: { variant: "default", icon: <Clock className="h-3 w-3" /> },
      normal: { variant: "secondary", icon: null },
      low: { variant: "outline", icon: null },
    }
    const config = variants[priority] || variants.normal
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {priority === "urgent" && "紧急"}
        {priority === "high" && "高"}
        {priority === "normal" && "普通"}
        {priority === "low" && "低"}
      </Badge>
    )
  }

  const getTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      project_review: "项目评审",
      taskbook_review: "任务书评审",
      taskbook_sign: "任务书签署",
      midterm_submit: "中期检查提交",
      midterm_review: "中期检查评审",
      annual_submit: "年报提交",
      annual_review: "年报评审",
      change_review: "变更评审",
      acceptance_submit: "验收提交",
      acceptance_review: "验收评审",
    }
    return typeMap[type] || type
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">待办事项</h1>
        <p className="text-muted-foreground mt-2">管理您的待办任务，及时处理重要事项</p>
      </div>

      {statistics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>待处理</CardDescription>
              <CardTitle className="text-3xl">{statistics.pendingCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>紧急事项</CardDescription>
              <CardTitle className="text-3xl text-destructive">{statistics.urgentCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>已逾期</CardDescription>
              <CardTitle className="text-3xl text-orange-500">{statistics.overdueCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>本周到期</CardDescription>
              <CardTitle className="text-3xl">{statistics.weekCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索待办事项..."
                  className="pl-8"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                />
              </div>
              <Button onClick={handleSearch}>搜索</Button>
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="project_review">项目评审</SelectItem>
                  <SelectItem value="taskbook_review">任务书评审</SelectItem>
                  <SelectItem value="taskbook_sign">任务书签署</SelectItem>
                  <SelectItem value="midterm_submit">中期检查提交</SelectItem>
                  <SelectItem value="midterm_review">中期检查评审</SelectItem>
                  <SelectItem value="annual_submit">年报提交</SelectItem>
                  <SelectItem value="annual_review">年报评审</SelectItem>
                  <SelectItem value="change_review">变更评审</SelectItem>
                  <SelectItem value="acceptance_submit">验收提交</SelectItem>
                  <SelectItem value="acceptance_review">验收评审</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无待办事项</div>
          ) : (
            <div className="space-y-4">
              {todos.map((todo) => (
                <Card key={todo.id} className={todo.isOverdue ? "border-destructive" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{todo.title}</h3>
                          {getPriorityBadge(todo.priority)}
                          <Badge variant="outline">{getTypeName(todo.type)}</Badge>
                          {todo.isOverdue && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              已逾期
                            </Badge>
                          )}
                          {!todo.isOverdue && todo.daysRemaining <= 3 && (
                            <Badge variant="default" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {todo.daysRemaining}天后到期
                            </Badge>
                          )}
                        </div>
                        {todo.description && <p className="text-sm text-muted-foreground">{todo.description}</p>}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>截止时间: {todo.deadline}</span>
                          {todo.businessNo && <span>业务编号: {todo.businessNo}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {todo.linkUrl && (
                          <Link href={todo.linkUrl}>
                            <Button size="sm">查看详情</Button>
                          </Link>
                        )}
                        {todo.status === "pending" && (
                          <Button size="sm" variant="outline" onClick={() => handleComplete(todo.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            完成
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {total > pageSize && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                上一页
              </Button>
              <span className="text-sm text-muted-foreground">
                第 {page} 页，共 {Math.ceil(total / pageSize)} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / pageSize)}
              >
                下一页
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
