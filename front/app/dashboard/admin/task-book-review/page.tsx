"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Search, Eye, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { taskBookApi } from "@/lib/api/taskbook"
import { UI_CONSTANTS } from "@/lib/constants/ui-constants"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function TaskBookReviewPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [taskBookList, setTaskBookList] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const loadTaskBooks = async () => {
    setLoading(true)
    try {
      const response = await taskBookApi.getList({
        page: currentPage,
        pageSize,
        keyword: searchTerm,
        status: "pending_institution",
      })
      setTaskBookList(response.records || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error("Failed to load task books:", error)
      toast({
        title: "加载失败",
        description: "无法加载任务书列表，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTaskBooks()
  }, [currentPage, pageSize])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadTaskBooks()
      } else {
        setCurrentPage(1)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      pending_institution: { label: "待机构审核", variant: "default" },
      pending_supervisor: { label: "待监管审核", variant: "secondary" },
      approved: { label: "已审核通过", variant: "outline" },
      rejected: { label: "审核未通过", variant: "destructive" },
    }
    const config = statusConfig[status] || { label: status, variant: "default" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const renderActions = (taskBook: any) => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/admin/task-book-review/${taskBook.id}`)}
        >
          <Eye className="h-4 w-4 mr-1" />
          查看
        </Button>
        <Button size="sm" onClick={() => router.push(`/dashboard/admin/task-book-review/${taskBook.id}?action=review`)}>
          <CheckCircle2 className="h-4 w-4 mr-1" />
          审核
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">任务书审核</h1>
        <p className="text-muted-foreground mt-1">审核项目负责人提交的任务书，审核通过后上报监管端</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索任务书编号、项目名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${UI_CONSTANTS.INPUT_HEIGHT}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>待审核任务书列表</CardTitle>
          <CardDescription>共 {total} 条待审核任务书</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>任务书编号</TableHead>
                <TableHead>项目名称</TableHead>
                <TableHead>项目编号</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : taskBookList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    暂无待审核任务书
                  </TableCell>
                </TableRow>
              ) : (
                taskBookList.map((taskBook) => (
                  <TableRow key={taskBook.id}>
                    <TableCell className="font-medium">{taskBook.code}</TableCell>
                    <TableCell className="max-w-xs truncate">{taskBook.projectName}</TableCell>
                    <TableCell>{taskBook.projectId}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{taskBook.submittedAt}</TableCell>
                    <TableCell>{getStatusBadge(taskBook.status)}</TableCell>
                    <TableCell className="text-right">{renderActions(taskBook)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {!loading && total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">共 {total} 条</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UI_CONSTANTS.PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} 条/页
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(total / pageSize)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
