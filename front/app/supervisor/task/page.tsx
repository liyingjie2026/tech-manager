"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { taskBookApi } from "@/lib/api/taskbook"
import { useToast } from "@/hooks/use-toast"
import {
  getStatusText,
  getStatusColor,
  getProjectTypeText,
  getProjectCategoryText,
  getResearchFieldText,
} from "@/lib/utils/status-maps"
const SIGN_STATUS_MAP: Record<string, { label: string; variant: any }> = {
  pending: { label: "待签订", variant: "secondary" },
  processing: { label: "流程中", variant: "default" },
  signed: { label: "已签订", variant: "default" },
}

export default function SupervisorTaskManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [taskBooks, setTaskBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const loadTaskBooks = async () => {
    try {
      setLoading(true)
      const response = await taskBookApi.getList({ pageNum: currentPage, pageSize })
      if (response.data) {
        const list = response.data.records || []
        setTaskBooks(list)
        setTotal(response.data.total || list.length)
      }
    } catch (error) {
      console.error("Failed to load task books:", error)
      toast({
        title: "加载失败",
        description: "无法加载任务书列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTaskBooks()
  }, [currentPage, pageSize])

  const handleApprove = async (id: string) => {
    try {
      await taskBookApi.review(id, true, "审核通过")
      toast({
        title: "审核成功",
        description: "任务书已审核通过",
      })
      loadTaskBooks()
    } catch (error) {
      toast({
        title: "审核失败",
        description: "任务书审核失败，请重试",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      await taskBookApi.review(id, false, "审核不通过")
      toast({
        title: "驳回成功",
        description: "任务书已驳回",
      })
      loadTaskBooks()
    } catch (error) {
      toast({
        title: "驳回失败",
        description: "任务书驳回失败，请重试",
        variant: "destructive",
      })
    }
  }

  const renderActions = (taskBook: any) => {
    const signStatus = taskBook.signStatus

    // 待签订 - 暂无操作
    if (signStatus === "pending") {
      return <span className="text-muted-foreground">-</span>
    }

    // 流程中（待审核） - 审核通过、驳回
    if (signStatus === "processing" && taskBook.status === "pending") {
      return (
        <div className="flex justify-center gap-2">
          <Button size="sm" onClick={() => handleApprove(taskBook.id)}>
            <CheckCircle2 className="h-4 w-4 mr-1" />
            审核通过
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleReject(taskBook.id)}>
            <XCircle className="h-4 w-4 mr-1" />
            驳回
          </Button>
        </div>
      )
    }

    // 已签订 - 查看
    if (signStatus === "signed") {
      return (
        <Button size="sm" variant="outline" onClick={() => router.push(`/supervisor/task/${taskBook.id}`)}>
          <Eye className="h-4 w-4 mr-1" />
          查看
        </Button>
      )
    }

    return (
      <Button size="sm" variant="outline" onClick={() => router.push(`/supervisor/task/${taskBook.id}`)}>
        <Eye className="h-4 w-4 mr-1" />
        查看
      </Button>
    )
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">任务书管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理立项项目的任务书签订和执行</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">待签订</p>
              <p className="text-3xl font-bold mt-2">{taskBooks.filter((tb) => tb.signStatus === "pending").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">流程中</p>
              <p className="text-3xl font-bold mt-2">
                {taskBooks.filter((tb) => tb.signStatus === "processing").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">已签订</p>
              <p className="text-3xl font-bold mt-2">{taskBooks.filter((tb) => tb.signStatus === "signed").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">总计</p>
              <p className="text-3xl font-bold mt-2">{taskBooks.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索项目名称或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="任务书状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待签订</SelectItem>
                <SelectItem value="processing">流程中</SelectItem>
                <SelectItem value="signed">已签订</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="default">查询</Button>
            <Button variant="outline">重置</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>任务书列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : taskBooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无任务书数据</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>项目编号</TableHead>
                      <TableHead>项目名称</TableHead>
                      <TableHead>项目类型</TableHead>
                      <TableHead>任务书状态</TableHead>
                      <TableHead>项目经费预算（万元）</TableHead>
                      <TableHead>项目开始时间</TableHead>
                      <TableHead>项目结束时间</TableHead>
                      <TableHead>项目负责人</TableHead>
                      <TableHead>承担单位</TableHead>
                      <TableHead>提交时间</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskBooks.map((taskBook) => (
                      <TableRow key={taskBook.id}>
                        <TableCell className="font-mono">{taskBook.projectNo}</TableCell>
                        <TableCell className="font-medium">{taskBook.projectName}</TableCell>
                        <TableCell>{getProjectTypeText(taskBook.projectType)}</TableCell>
                        <TableCell>
                          <Badge variant={SIGN_STATUS_MAP[taskBook.signStatus]?.variant || "secondary"}>
                            {SIGN_STATUS_MAP[taskBook.signStatus]?.label || taskBook.signStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{taskBook.totalBudget?.toFixed(2) || "-"}</TableCell>
                        <TableCell>{taskBook.startDate}</TableCell>
                        <TableCell>{taskBook.endDate}</TableCell>
                        <TableCell>{taskBook.projectLeader}</TableCell>
                        <TableCell>{taskBook.institutionName}</TableCell>
                        <TableCell>{taskBook.submitTime || "-"}</TableCell>
                        <TableCell className="text-center">{renderActions(taskBook)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between px-4 py-4 border-t mt-4">
                <div className="text-sm text-muted-foreground">共 {total} 条</div>
                <div className="flex items-center gap-2">
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(v) => {
                      setPageSize(Number(v))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10条/页</SelectItem>
                      <SelectItem value="20">20条/页</SelectItem>
                      <SelectItem value="50">50条/页</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      上一页
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
